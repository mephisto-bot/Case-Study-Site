import { RegistrationFormData, AttendeeRecord, MentorshipApplication, AlumniCoachApplication } from '../types';
import { getAdminConfig, getStoredRegistrations, saveStoredRegistrations, getStoredUpcomingSession } from './storage';
import { getRegistrationStatus } from '../utils/registrationTiming';
import { getNextSessionTargetDate } from '../utils/dateHelpers';
import { insertRegistrationToSupabase } from './supabase';
import { sendSessionRegistrationReceivedEmail } from './emailService';

export interface RegistrationResponse {
  success: boolean;
  message: string;
  record?: AttendeeRecord;
  syncedToGoogleSheets: boolean;
}

export const submitRegistration = async (data: RegistrationFormData): Promise<RegistrationResponse> => {
  const config = getAdminConfig();
  const regStatus = getRegistrationStatus(config.registrationMode);

  if (!regStatus.isOpen) {
    return {
      success: false,
      message: regStatus.message || 'Registration is currently closed for the upcoming session.',
      syncedToGoogleSheets: false
    };
  }

  const timestamp = new Date().toISOString();
  let synced = false;

  const newRecord: AttendeeRecord = {
    id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    fullName: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    attendeeType: data.attendeeType,
    mediaConsent: data.mediaConsent,
    attendanceEssay: data.attendanceEssay?.trim(),
    timestamp,
    status: 'pending',
    syncedToGoogleSheets: false
  };

  // If a Google Apps Script Web App URL is configured, send the POST request
  if (config.appsScriptUrl && config.appsScriptUrl.trim().startsWith('http')) {
    try {
      const payload = {
        fullName: newRecord.fullName,
        email: newRecord.email,
        phone: newRecord.phone,
        attendeeType: newRecord.attendeeType,
        mediaConsent: newRecord.mediaConsent,
        attendanceEssay: newRecord.attendanceEssay,
        timestamp: newRecord.timestamp,
        status: 'pending',
        source: 'CIH Case Study Web App'
      };

      // Google Apps Script requires text/plain or no-cors to prevent preflight block
      await fetch(config.appsScriptUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });

      synced = true;
      newRecord.syncedToGoogleSheets = true;
    } catch (err) {
      console.warn('Could not post to Google Apps Script URL, saving locally:', err);
    }
  } else {
    // Simulate slight network latency for polished UX
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  // 1. Sync to Supabase Database (if configured)
  try {
    const sbRes = await insertRegistrationToSupabase(newRecord);
    if (sbRes.success) {
      synced = true;
    }
  } catch (sbErr) {
    console.warn('Supabase sync notice:', sbErr);
  }

  // 2. Persist locally for immediate offline & admin state
  try {
    const existing = getStoredRegistrations();
    saveStoredRegistrations([newRecord, ...existing]);
  } catch (err) {
    console.error('Error saving registration locally', err);
  }

  // 3. Instant Confirmation Email to Applicant
  try {
    const upcoming = getStoredUpcomingSession();
    await sendSessionRegistrationReceivedEmail(newRecord, upcoming);
  } catch (mailErr) {
    console.warn('Instant registration confirmation email notice:', mailErr);
  }

  return {
    success: true,
    message: 'Registration completed successfully!',
    record: newRecord,
    syncedToGoogleSheets: synced
  };
};

/**
 * Generates an .ics iCalendar file for the upcoming Wednesday session
 */
export const downloadCalendarInvite = (title: string = "CIH Wednesday Case Study", description: string = "Weekly life skills, mentorship, and IKIGAI session at Community Innovation Hub.") => {
  const nextWed = getNextSessionTargetDate();
  const endWed = new Date(nextWed.getTime() + 6 * 60 * 60 * 1000); // 6 hours (10:00 AM - 4:00 PM)

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Community Innovation Hub//CIH Case Study//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    'LOCATION:Community Innovation Hub (CIH)\\, Plot 104 5th Avenue Abesan Estate\\, Ipaja\\, Lagos\\, Nigeria (Strictly On-Site)',
    `DTSTART:${formatDate(nextWed)}`,
    `DTEND:${formatDate(endWed)}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: CIH Wednesday Case Study starts in 30 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'CIH_Case_Study_Session.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getGoogleCalendarUrl = (title: string = "CIH Wednesday Case Study", details: string = "Weekly life skills, mentorship, and IKIGAI session at Community Innovation Hub.") => {
  const nextWed = getNextSessionTargetDate();
  const endWed = new Date(nextWed.getTime() + 6 * 60 * 60 * 1000);

  const formatGCal = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, '');

  const start = formatGCal(nextWed);
  const end = formatGCal(endWed);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent('Community Innovation Hub, Plot 104, 5th Avenue Abesan Estate, Ipaja, Lagos, Nigeria')}`;
};

export interface CloudAdminData {
  success: boolean;
  registrations: AttendeeRecord[];
  mentorshipApplications: MentorshipApplication[];
  coachApplications: AlumniCoachApplication[];
  error?: string;
}

/**
 * Fetches all real-time attendee registrations, mentorship applications,
 * and alumni coach applications from the central Google Sheets backend.
 */
export const fetchCloudAdminData = async (): Promise<CloudAdminData> => {
  const config = getAdminConfig();
  if (!config.appsScriptUrl || !config.appsScriptUrl.trim().startsWith('http')) {
    return {
      success: false,
      registrations: [],
      mentorshipApplications: [],
      coachApplications: [],
      error: 'Google Apps Script URL is not configured.'
    };
  }

  try {
    const url = `${config.appsScriptUrl.trim()}?action=getAllAdminData&_t=${Date.now()}`;
    const resp = await fetch(url, { method: 'GET' });
    if (!resp.ok) {
      throw new Error(`Server returned HTTP ${resp.status}`);
    }
    const data = await resp.json();
    return {
      success: true,
      registrations: Array.isArray(data.registrations) ? data.registrations : [],
      mentorshipApplications: Array.isArray(data.mentorshipApplications) ? data.mentorshipApplications : [],
      coachApplications: Array.isArray(data.coachApplications) ? data.coachApplications : []
    };
  } catch (err: any) {
    console.warn('Real-time cloud admin data fetch notice:', err);
    return {
      success: false,
      registrations: [],
      mentorshipApplications: [],
      coachApplications: [],
      error: err?.message || 'Could not fetch cloud data'
    };
  }
};

/**
 * Updates an applicant's status directly in the Google Sheet across all devices
 */
export const updateCloudRecordStatus = async (
  type: 'mentorship' | 'coach' | 'attendee',
  idOrEmail: string,
  status: string
): Promise<boolean> => {
  const config = getAdminConfig();
  if (!config.appsScriptUrl || !config.appsScriptUrl.trim().startsWith('http')) {
    return false;
  }

  try {
    let action = 'updateAttendeeStatus';
    let payload: any = { action, email: idOrEmail, status };
    if (type === 'mentorship') {
      action = 'updateMentorshipStatus';
      payload = { action, id: idOrEmail, status };
    } else if (type === 'coach') {
      action = 'updateCoachStatus';
      payload = { action, id: idOrEmail, status };
    }

    await fetch(config.appsScriptUrl.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      mode: 'no-cors'
    });
    return true;
  } catch (e) {
    console.warn('Could not update cloud record status:', e);
    return false;
  }
};
