import { getAdminConfig } from '../services/storage';

export interface RegistrationStatus {
  isOpen: boolean;
  status: 'OPEN' | 'SATURDAY_CLOSED' | 'SUNDAY_CLOSED' | 'MONDAY_CLOSED' | 'TUESDAY_CLOSED' | 'WEDNESDAY_CLOSED' | 'MANUALLY_CLOSED';
  title: string;
  message: string;
  reopenText: string;
  nextSessionDate: string;
  deadlineText: string;
  isOverridden: boolean;
}

/**
 * Returns whether registration is open or closed based on day-of-week in West Africa Time (WAT / UTC+1)
 * and admin configuration override.
 * Rule: Registration closes every Saturday at 11:59 PM WAT for the upcoming Wednesday case study.
 */
export function getRegistrationStatus(customMode?: 'auto' | 'force_open' | 'force_closed'): RegistrationStatus {
  const config = getAdminConfig();
  const mode = customMode || config.registrationMode || 'auto';

  // Manual Overrides
  if (mode === 'force_open') {
    return {
      isOpen: true,
      status: 'OPEN',
      title: 'Registration is Open (Manual Override)',
      message: 'Organizer manual override is active. Registrations are currently accepted.',
      reopenText: 'Open now',
      nextSessionDate: 'Upcoming Wednesday',
      deadlineText: 'Open until manually closed',
      isOverridden: true,
    };
  }

  if (mode === 'force_closed') {
    return {
      isOpen: false,
      status: 'MANUALLY_CLOSED',
      title: 'Registration Temporarily Closed',
      message: 'Registration for the upcoming Case Study has been paused by the organizers.',
      reopenText: 'Please check back shortly',
      nextSessionDate: 'Upcoming Wednesday',
      deadlineText: 'Closed by organizer',
      isOverridden: true,
    };
  }

  // Automatic Day-of-Week Mode in WAT (West Africa Time - UTC+1 / Africa/Lagos)
  const now = new Date();
  const watString = now.toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
  const watDate = new Date(watString);
  const dayOfWeek = watDate.getDay(); // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday

  // Sunday through Wednesday: Registration is closed for the upcoming Wednesday session
  if (dayOfWeek === 0 || dayOfWeek === 1 || dayOfWeek === 2 || dayOfWeek === 3) {
    let dayName = 'Sunday';
    if (dayOfWeek === 1) dayName = 'Monday';
    if (dayOfWeek === 2) dayName = 'Tuesday';
    if (dayOfWeek === 3) dayName = 'Wednesday';

    return {
      isOpen: false,
      status: dayOfWeek === 3 ? 'WEDNESDAY_CLOSED' : dayOfWeek === 2 ? 'TUESDAY_CLOSED' : 'SATURDAY_CLOSED',
      title: dayOfWeek === 3 ? 'Case Study in Session Today' : 'Registration Closed for Upcoming Wednesday',
      message: dayOfWeek === 3
        ? 'The weekly Case Study session is currently in progress at Community Innovation Hub. Registration opens Thursday for next week.'
        : 'Registration closed on Saturday to allow CIH mentors to review applicant essays and select the 20 eligible participants. Shortlisted attendees will receive their selection email and admission ticket on Tuesday morning.',
      reopenText: 'Re-opens Thursday morning for the next weekly cohort',
      nextSessionDate: dayOfWeek === 3 ? 'In Session Today • 10:00 AM WAT' : 'This Wednesday • 10:00 AM WAT (Strictly 20 Selected)',
      deadlineText: 'Registration closed on Saturday',
      isOverridden: false,
    };
  }

  // Thursday, Friday, and Saturday: Open for registration until Saturday 11:59 PM WAT
  return {
    isOpen: true,
    status: 'OPEN',
    title: 'Registration Open for Upcoming Wednesday',
    message: 'Submit your application and essay for the upcoming Wednesday Case Study at Community Innovation Hub. Strictly eligible to 20 participants.',
    reopenText: 'Open now',
    nextSessionDate: 'Upcoming Wednesday • 10:00 AM WAT',
    deadlineText: 'Closes this Saturday at 11:59 PM WAT (Max 20 seats)',
    isOverridden: false,
  };
}
