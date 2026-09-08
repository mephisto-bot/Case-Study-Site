import { AttendeeRecord, MentorshipApplication, AlumniCoachApplication, UpcomingSession, SentEmailLog, EmailCategory } from '../types';
import { getAdminConfig, addStoredSentEmail } from './storage';

/**
 * CIH Brand Theme Tokens for Email Templates
 */
const BRAND = {
  name: 'Community Innovation Hub (CIH)',
  navy: '#0F172A',
  orange: '#FF6B00',
  emerald: '#059669',
  rose: '#E11D48',
  slate: '#475569',
  lightBg: '#F8FAFC',
  venue: 'Plot 104, 5th Avenue, Abesan Estate, Ipaja, Lagos, Nigeria',
  sessionTiming: 'Wednesdays • 10:00 AM – 1:00 PM WAT'
};

/**
 * Wraps email body content in a responsive, branded HTML email template
 */
const buildHtmlWrapper = (title: string, subtitle: string, badgeText: string, badgeBg: string, badgeColor: string, bodyContentHtml: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F1F5F9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #E2E8F0;">
          
          <!-- Brand Header -->
          <tr>
            <td style="background-color: ${BRAND.navy}; padding: 36px 30px; text-align: center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <span style="display: inline-block; background-color: ${badgeBg}; color: ${badgeColor}; padding: 5px 14px; border-radius: 9999px; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;">
                      ${badgeText}
                    </span>
                    <h1 style="color: #FFFFFF; margin: 0 0 6px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                      ${title}
                    </h1>
                    <p style="color: #94A3B8; margin: 0; font-size: 13px;">
                      ${subtitle}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Email Body -->
          <tr>
            <td style="padding: 32px 30px; line-height: 1.6; font-size: 14px; color: #334155;">
              ${bodyContentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: ${BRAND.lightBg}; padding: 24px 30px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #64748B;">
              <p style="margin: 0 0 6px 0; font-weight: 700; color: #0F172A;">
                Community Innovation Hub • Case Study &amp; Mentorship Directorate
              </p>
              <p style="margin: 0 0 10px 0;">
                📍 ${BRAND.venue} • ⏰ ${BRAND.sessionTiming}
              </p>
              <p style="margin: 0; font-size: 11px; color: #94A3B8;">
                This is an automated priority notification from the CIH Case Study &amp; Mentorship Platform. Please do not reply directly to this email. For official assistance, message us via WhatsApp or reach out on site.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Dispatches an email to Google Apps Script and records it in local outbox
 */
const dispatchEmail = async (params: {
  recipientEmail: string;
  recipientName: string;
  category: EmailCategory;
  subject: string;
  htmlBody: string;
  plainText: string;
  applicationId?: string;
  meta?: Record<string, any>;
}): Promise<SentEmailLog> => {
  const config = getAdminConfig();
  const timestamp = new Date().toISOString();
  const logId = `mail-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  let dispatchStatus: 'sent' | 'queued' | 'simulated' = 'simulated';

  // 1. Post to Google Apps Script if URL is configured
  if (config.appsScriptUrl && config.appsScriptUrl.trim().startsWith('http')) {
    try {
      await fetch(config.appsScriptUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'sendNotificationEmail',
          toEmail: params.recipientEmail.trim().toLowerCase(),
          recipientName: params.recipientName.trim(),
          category: params.category,
          subject: params.subject,
          htmlBody: params.htmlBody,
          plainText: params.plainText,
          timestamp,
          source: 'CIH Application Review Engine'
        }),
        mode: 'no-cors'
      });
      dispatchStatus = 'sent';
    } catch (err) {
      console.warn('Google Apps Script email dispatch notice (saved locally to outbox):', err);
      dispatchStatus = 'queued';
    }
  }

  // 2. Persist in Sent Emails Outbox for Admin Audit & In-App Tracking
  const emailLog: SentEmailLog = {
    id: logId,
    recipientEmail: params.recipientEmail.trim().toLowerCase(),
    recipientName: params.recipientName.trim(),
    category: params.category,
    subject: params.subject,
    htmlBody: params.htmlBody,
    plainText: params.plainText,
    sentAt: timestamp,
    status: dispatchStatus,
    applicationId: params.applicationId,
    meta: params.meta
  };

  addStoredSentEmail(emailLog);
  return emailLog;
};

// =========================================================================
// 1. WEDNESDAY CASE STUDY SESSION REGISTRATION EMAILS
// =========================================================================

/**
 * A. Submission Confirmation (Session Registration Received)
 */
export const sendSessionRegistrationReceivedEmail = async (
  attendee: AttendeeRecord,
  session?: UpcomingSession
): Promise<SentEmailLog> => {
  const subject = `Application Received: Wednesday Case Study Session (${session?.topicTitle || 'Ethics & Decision Science'})`;
  const bodyContent = `
    <p style="font-size: 16px; margin-top: 0;">Dear <strong>${attendee.fullName}</strong>,</p>
    
    <p>Thank you for registering to attend the upcoming <strong>Wednesday Case Study Plenary Session</strong> at the Community Innovation Hub (CIH).</p>

    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0 0 6px 0; font-weight: 700; color: #0F172A;">Registration Summary:</p>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #475569;">
        <li><strong>Applicant:</strong> ${attendee.fullName} (${attendee.attendeeType})</li>
        <li><strong>Email:</strong> ${attendee.email}</li>
        <li><strong>Phone / WhatsApp:</strong> ${attendee.phone}</li>
        <li><strong>Target Topic:</strong> ${session?.topicTitle || 'Ethics & Cognitive Decision Science'}</li>
        <li><strong>Venue:</strong> ${BRAND.venue}</li>
      </ul>
    </div>

    <p style="font-weight: 700; color: #0F172A;">What Happens Next?</p>
    <p>To preserve high-impact interactive sparring and deep psychological safety, physical on-site capacity is strictly capped at <strong>20 seats per cohort</strong>. CIH facilitators review all applications and essays on a rolling basis.</p>
    <p>You will receive an <strong>instant email update</strong> notifying you whether your seat is approved or declined, along with your official digital pass.</p>

    <p style="margin-top: 24px;">Warm regards,<br><strong>The CIH Facilitation &amp; Review Team</strong></p>
  `;

  const plainText = `Dear ${attendee.fullName},\n\nThank you for registering for the upcoming Wednesday Case Study Session at CIH. Your registration is received and under review. Physical seats are limited to 20 participants. You will receive an instant email once reviewed.\n\nCIH Team`;
  const htmlBody = buildHtmlWrapper(
    'Registration Received',
    'Wednesday Case Study Cohort • 20-Seat Physical Capacity',
    'Application Under Review',
    '#FEF3C7',
    '#92400E',
    bodyContent
  );

  return dispatchEmail({
    recipientEmail: attendee.email,
    recipientName: attendee.fullName,
    category: 'session_registration_confirmed',
    subject,
    htmlBody,
    plainText,
    applicationId: attendee.id
  });
};

/**
 * B. Session Application ACCEPTED
 */
export const sendSessionAcceptedEmail = async (
  attendee: AttendeeRecord,
  session?: UpcomingSession
): Promise<SentEmailLog> => {
  const sessionDate = session?.dateStr || 'Upcoming Wednesday';
  const sessionTopic = session?.topicTitle || 'Cognitive Decision Science & Ethics';
  const subject = `🎉 Congratulations! Your Seat is Confirmed for Wednesday Case Study: "${sessionTopic}"`;

  const bodyContent = `
    <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 12px; padding: 18px; margin-bottom: 24px; text-align: center;">
      <span style="font-size: 28px; display: block; margin-bottom: 6px;">🎟️</span>
      <h2 style="color: #065F46; margin: 0 0 6px 0; font-size: 18px; font-weight: 800;">Official Admission Pass Confirmed</h2>
      <p style="color: #047857; margin: 0; font-size: 13px;">
        You have been selected among the <strong>20 physical cohort seats</strong> for this Wednesday's session.
      </p>
    </div>

    <p style="font-size: 15px; margin-top: 0;">Dear <strong>${attendee.fullName}</strong>,</p>
    
    <p>The CIH Review Committee has reviewed your application and statement of interest. We are thrilled to invite you to take your seat in this Wednesday's plenary debate!</p>

    <div style="background-color: #0F172A; color: #FFFFFF; border-radius: 16px; padding: 22px; margin: 24px 0;">
      <p style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #FF6B00; font-weight: 800;">
        Case Study Session Details:
      </p>
      <table role="presentation" width="100%" style="font-size: 13px; color: #E2E8F0; line-height: 1.8;">
        <tr>
          <td width="30%" style="color: #94A3B8; font-weight: 600;">Date:</td>
          <td style="font-weight: 700; color: #FFFFFF;">${sessionDate}</td>
        </tr>
        <tr>
          <td style="color: #94A3B8; font-weight: 600;">Time:</td>
          <td style="font-weight: 700; color: #FFFFFF;">10:00 AM – 1:00 PM WAT (Punctuality Strictly Enforced)</td>
        </tr>
        <tr>
          <td style="color: #94A3B8; font-weight: 600;">Topic:</td>
          <td style="font-weight: 700; color: #FF6B00;">${sessionTopic}</td>
        </tr>
        <tr>
          <td style="color: #94A3B8; font-weight: 600;">Venue:</td>
          <td style="font-weight: 700; color: #FFFFFF;">Community Innovation Hub (CIH), Plot 104, 5th Avenue, Abesan Estate, Ipaja, Lagos</td>
        </tr>
      </table>
    </div>

    <p style="font-weight: 700; color: #0F172A;">Important On-Site Guidelines:</p>
    <ul style="padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.7;">
      <li><strong>Arrival:</strong> Please arrive by <strong>9:45 AM</strong> for security verification and seat assignment. Doors close promptly at 10:00 AM.</li>
      <li><strong>Preparation:</strong> Bring a notepad and an active mindset ready for intense peer debate and cross-examination.</li>
      <li><strong>Digital Pass:</strong> Please show this confirmation email or your issued ticket at the front desk upon entry.</li>
    </ul>

    <p style="margin-top: 24px;">We look forward to your active contribution to the discussion!<br><br>Warm regards,<br><strong>Coach Adewale, Coach Soji &amp; The CIH Facilitators</strong></p>
  `;

  const plainText = `Dear ${attendee.fullName},\n\nCongratulations! Your seat for the Wednesday Case Study session on "${sessionTopic}" at CIH is CONFIRMED. Date: ${sessionDate}, Time: 10:00 AM WAT. Venue: Plot 104 5th Avenue Abesan Estate, Ipaja Lagos. Please arrive by 9:45 AM.\n\nCIH Facilitators`;
  const htmlBody = buildHtmlWrapper(
    'Seat Confirmed!',
    'Official Admission Pass • Wednesday Case Study',
    'Seat Approved',
    '#D1FAE5',
    '#065F46',
    bodyContent
  );

  return dispatchEmail({
    recipientEmail: attendee.email,
    recipientName: attendee.fullName,
    category: 'session_accepted',
    subject,
    htmlBody,
    plainText,
    applicationId: attendee.id
  });
};

/**
 * C. Session Application DECLINED
 */
export const sendSessionDeclinedEmail = async (
  attendee: AttendeeRecord,
  session?: UpcomingSession
): Promise<SentEmailLog> => {
  const sessionTopic = session?.topicTitle || 'Ethics & Decision Science';
  const subject = `Update regarding your registration for Wednesday Case Study: "${sessionTopic}"`;

  const bodyContent = `
    <p style="font-size: 15px; margin-top: 0;">Dear <strong>${attendee.fullName}</strong>,</p>
    
    <p>Thank you for your interest and for submitting your application to attend this Wednesday's Case Study session on <strong>"${sessionTopic}"</strong>.</p>

    <div style="background-color: #FFF1F2; border: 1px solid #FECDD3; border-radius: 12px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0; color: #9F1239; font-size: 13px; line-height: 1.6;">
        Due to high demand and our strict <strong>20-seat physical room capacity</strong> to ensure quality debate, we were unable to accommodate your application for this week's on-site cohort.
      </p>
    </div>

    <p style="font-weight: 700; color: #0F172A;">You Are Strongly Encouraged to Reapply:</p>
    <p>Session registrations reopen every weekend for the following Wednesday's topic. We value your participation and look forward to having you with us in an upcoming session.</p>

    <p>In the meantime, feel free to explore our past case studies, video breakdowns, and audio podcasts on the platform to stay engaged with our analytical frameworks.</p>

    <p style="margin-top: 24px;">With best wishes,<br><strong>The CIH Case Study Review Committee</strong></p>
  `;

  const plainText = `Dear ${attendee.fullName},\n\nThank you for applying for this Wednesday's Case Study session on "${sessionTopic}". Due to our strict 20-seat physical capacity, we could not admit your application this week. Please re-apply for next week's session when registration re-opens.\n\nCIH Committee`;
  const htmlBody = buildHtmlWrapper(
    'Registration Update',
    'Wednesday Case Study Cohort • Capacity Notice',
    'Cohort Capacity Reached',
    '#FFE4E6',
    '#9F1239',
    bodyContent
  );

  return dispatchEmail({
    recipientEmail: attendee.email,
    recipientName: attendee.fullName,
    category: 'session_declined',
    subject,
    htmlBody,
    plainText,
    applicationId: attendee.id
  });
};

// =========================================================================
// 2. PERSONAL MENTORSHIP PROGRAM EMAILS (3-MONTH TERM)
// =========================================================================

/**
 * A. Mentee Application Received
 */
export const sendMenteeApplicationReceivedEmail = async (
  app: MentorshipApplication
): Promise<SentEmailLog> => {
  const subject = `Mentorship Application Received (3-Month Term) • Desired Coach: ${app.desiredMentor || 'Auto-Match'}`;

  const bodyContent = `
    <p style="font-size: 15px; margin-top: 0;">Dear <strong>${app.fullName}</strong>,</p>
    
    <p>Your application for the <strong>CIH Personal Mentorship Program</strong> has been successfully recorded.</p>

    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0 0 6px 0; font-weight: 700; color: #0F172A;">Your Application Summary:</p>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.7;">
        <li><strong>Full Name:</strong> ${app.fullName}</li>
        <li><strong>Gmail Address:</strong> ${app.email}</li>
        <li><strong>Phone / WhatsApp:</strong> ${app.phone}</li>
        <li><strong>Focus Area:</strong> ${app.focusArea}</li>
        <li><strong>Desired Coach:</strong> ${app.desiredMentor || 'Any Available CIH Coach'}</li>
        <li><strong>Term Cycle:</strong> Strictly 3 Months (90 Days)</li>
      </ul>
    </div>

    <p style="font-weight: 700; color: #0F172A;">Evaluation Process:</p>
    <p>Your selected coach and the CIH Mentorship Directorate evaluate statements of purpose on a rolling basis. You will receive an instant email notification once your coach reviews and renders a decision on your application.</p>

    <p style="margin-top: 24px;">Warm regards,<br><strong>CIH Mentorship Directorate</strong></p>
  `;

  const plainText = `Dear ${app.fullName},\n\nYour CIH Personal Mentorship Application has been received for the 3-Month Term under coach "${app.desiredMentor}". Your statement is under coach review. You will receive an instant notification once evaluated.\n\nCIH Mentorship Directorate`;
  const htmlBody = buildHtmlWrapper(
    'Mentorship Application Received',
    '3-Month Personal Coaching Cycle',
    'Under Coach Review',
    '#FEF3C7',
    '#92400E',
    bodyContent
  );

  return dispatchEmail({
    recipientEmail: app.email,
    recipientName: app.fullName,
    category: 'mentorship_submitted',
    subject,
    htmlBody,
    plainText,
    applicationId: app.id
  });
};

/**
 * B. Mentee Application ACCEPTED
 */
export const sendMenteeAcceptedEmail = async (
  app: MentorshipApplication,
  coachName?: string
): Promise<SentEmailLog> => {
  const finalCoach = coachName || app.desiredMentor || 'CIH Certified Coach';
  const subject = `🌟 Congratulations! Your 3-Month Mentorship with Coach ${finalCoach} is APPROVED!`;

  const bodyContent = `
    <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 12px; padding: 18px; margin-bottom: 24px; text-align: center;">
      <span style="font-size: 28px; display: block; margin-bottom: 6px;">🎯</span>
      <h2 style="color: #065F46; margin: 0 0 6px 0; font-size: 18px; font-weight: 800;">Mentorship Application Accepted</h2>
      <p style="color: #047857; margin: 0; font-size: 13px;">
        You have been officially accepted into the <strong>3-Month Personal Coaching Cohort</strong> under <strong>Coach ${finalCoach}</strong>!
      </p>
    </div>

    <p style="font-size: 15px; margin-top: 0;">Dear <strong>${app.fullName}</strong>,</p>
    
    <p>After reviewing your background and goals essay, <strong>Coach ${finalCoach}</strong> has accepted you as a personal mentee for the upcoming 90-day coaching term.</p>

    <div style="background-color: #0F172A; color: #FFFFFF; border-radius: 16px; padding: 22px; margin: 24px 0;">
      <p style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #FF6B00; font-weight: 800;">
        Your 3-Month Coaching Terms:
      </p>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #E2E8F0; line-height: 1.8;">
        <li><strong>Assigned Coach:</strong> Coach ${finalCoach}</li>
        <li><strong>Primary Focus Domain:</strong> ${app.focusArea}</li>
        <li><strong>Duration:</strong> Strictly 3 Months (90 Days Active Facilitation)</li>
        <li><strong>Sparring Cadence:</strong> Bi-weekly 1-on-1 alignment &amp; Wednesday Case Study Breakout sparring</li>
      </ul>
    </div>

    <p style="font-weight: 700; color: #0F172A;">Next Action Steps:</p>
    <ol style="padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.8;">
      <li><strong>Coach Outreach:</strong> Coach ${finalCoach} will reach out to you via your registered Gmail and WhatsApp number (<strong>${app.phone}</strong>) to schedule your initial diagnostic kickoff.</li>
      <li><strong>90-Day Blueprint:</strong> Prepare a draft list of the specific challenges, career bottlenecks, or startup dilemmas you want to deconstruct during your term.</li>
    </ol>

    <p style="margin-top: 24px;">Welcome aboard to an intensive period of growth and mental agility!<br><br>Warm regards,<br><strong>Coach ${finalCoach} &amp; The CIH Directorate</strong></p>
  `;

  const plainText = `Dear ${app.fullName},\n\nCongratulations! Your 3-Month Personal Mentorship application with Coach ${finalCoach} at CIH has been APPROVED. Your coach will contact you via WhatsApp and email to schedule your kickoff.\n\nCIH Mentorship Directorate`;
  const htmlBody = buildHtmlWrapper(
    'Mentorship Approved!',
    '3-Month Personal Coaching Term • Match Confirmed',
    'Application Approved',
    '#D1FAE5',
    '#065F46',
    bodyContent
  );

  return dispatchEmail({
    recipientEmail: app.email,
    recipientName: app.fullName,
    category: 'mentorship_accepted',
    subject,
    htmlBody,
    plainText,
    applicationId: app.id
  });
};

/**
 * C. Mentee Application DECLINED
 */
export const sendMenteeDeclinedEmail = async (
  app: MentorshipApplication,
  coachName?: string
): Promise<SentEmailLog> => {
  const subject = `Update regarding your CIH Personal Mentorship Application`;

  const bodyContent = `
    <p style="font-size: 15px; margin-top: 0;">Dear <strong>${app.fullName}</strong>,</p>
    
    <p>Thank you for submitting your application for the <strong>CIH Personal Mentorship Program</strong>.</p>

    <div style="background-color: #FFF1F2; border: 1px solid #FECDD3; border-radius: 12px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0; color: #9F1239; font-size: 13px; line-height: 1.6;">
        Due to coach availability and strict mentee-to-coach bandwidth limits for this quarter, we are unable to pair you with a personal coach for this 3-month cycle.
      </p>
    </div>

    <p style="font-weight: 700; color: #0F172A;">How to Continue Your Growth at CIH:</p>
    <ul style="padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.8;">
      <li><strong>Attend Wednesday Case Studies:</strong> Our weekly plenary sessions are open and provide immediate access to Coach Adewale, Coach Soji, and guest directors during live breakout pod sparring.</li>
      <li><strong>Reapply in Next Quarter:</strong> You are warmly invited to reapply for personal 1-on-1 coaching when the next quarterly cohort opens.</li>
    </ul>

    <p style="margin-top: 24px;">We appreciate your dedication and encourage you to stay actively involved in our weekly sessions.<br><br>With warm regards,<br><strong>The CIH Mentorship Directorate</strong></p>
  `;

  const plainText = `Dear ${app.fullName},\n\nThank you for applying for the CIH 3-Month Mentorship Program. Due to coach bandwidth limits, we cannot match you this cycle. Please participate in our weekly Wednesday case studies and reapply next quarter.\n\nCIH Mentorship Directorate`;
  const htmlBody = buildHtmlWrapper(
    'Mentorship Application Update',
    '3-Month Personal Coaching Cycle • Bandwidth Notice',
    'Cycle Capacity Reached',
    '#FFE4E6',
    '#9F1239',
    bodyContent
  );

  return dispatchEmail({
    recipientEmail: app.email,
    recipientName: app.fullName,
    category: 'mentorship_declined',
    subject,
    htmlBody,
    plainText,
    applicationId: app.id
  });
};

// =========================================================================
// 3. ALUMNI COACH / MENTOR VOLUNTEER EMAILS
// =========================================================================

/**
 * A. Coach Application Received
 */
export const sendCoachApplicationReceivedEmail = async (
  app: AlumniCoachApplication
): Promise<SentEmailLog> => {
  const subject = `Coach Application Received • Welcome Alumni ${app.fullName}`;

  const bodyContent = `
    <p style="font-size: 15px; margin-top: 0;">Dear <strong>${app.fullName}</strong>,</p>
    
    <p>Thank you for stepping up to give back to the Community Innovation Hub as a <strong>Case Study Coach &amp; Mentor</strong>.</p>

    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0 0 6px 0; font-weight: 700; color: #0F172A;">Your Volunteer Profile:</p>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.7;">
        <li><strong>Track:</strong> ${app.alumniTrack} (Class of ${app.graduationYear || 'N/A'})</li>
        <li><strong>Current Role:</strong> ${app.currentRole} ${app.organization ? `at ${app.organization}` : ''}</li>
        <li><strong>Coaching Domain:</strong> ${app.coachingDomain}</li>
        <li><strong>Availability:</strong> ${app.availability}</li>
      </ul>
    </div>

    <p style="font-weight: 700; color: #0F172A;">Next Steps:</p>
    <p>The Lead Coaching Board (Coach Adewale, Coach Soji, Coach Esther &amp; Coach Kehinde) reviews prospective coach profiles. You will receive an instant email confirmation once your coach status is approved.</p>

    <p style="margin-top: 24px;">With deep gratitude,<br><strong>CIH Executive Board</strong></p>
  `;

  const plainText = `Dear ${app.fullName},\n\nThank you for volunteering to coach at CIH. Your application has been received by the Executive Coaching Board. You will receive an instant update once your profile is approved.\n\nCIH Board`;
  const htmlBody = buildHtmlWrapper(
    'Coach Application Received',
    'CIH Alumni &amp; Fellows Coaching Board',
    'Board Review in Progress',
    '#FEF3C7',
    '#92400E',
    bodyContent
  );

  return dispatchEmail({
    recipientEmail: app.email,
    recipientName: app.fullName,
    category: 'coach_submitted',
    subject,
    htmlBody,
    plainText,
    applicationId: app.id
  });
};

/**
 * B. Coach Application APPROVED
 */
export const sendCoachApprovedEmail = async (
  app: AlumniCoachApplication
): Promise<SentEmailLog> => {
  const subject = `🏆 Congratulations! You are Approved as a CIH Certified Coach & Mentor`;

  const bodyContent = `
    <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 12px; padding: 18px; margin-bottom: 24px; text-align: center;">
      <span style="font-size: 28px; display: block; margin-bottom: 6px;">🎖️</span>
      <h2 style="color: #065F46; margin: 0 0 6px 0; font-size: 18px; font-weight: 800;">Welcome to the CIH Coaching Board</h2>
      <p style="color: #047857; margin: 0; font-size: 13px;">
        Your application has been officially <strong>Approved</strong> by CIH Management!
      </p>
    </div>

    <p style="font-size: 15px; margin-top: 0;">Dear <strong>Coach ${app.fullName}</strong>,</p>
    
    <p>On behalf of the founders and community, we are proud to welcome you as a <strong>Certified CIH Case Study Coach</strong> in <strong>${app.coachingDomain}</strong>.</p>

    <div style="background-color: #0F172A; color: #FFFFFF; border-radius: 16px; padding: 22px; margin: 24px 0;">
      <p style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #FF6B00; font-weight: 800;">
        Your Coach Privileges &amp; Platform Activation:
      </p>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #E2E8F0; line-height: 1.8;">
        <li><strong>Personal Coach Desk:</strong> Your account on <em>/mentorship</em> is now transformed into your personal Coach Mentorship Desk.</li>
        <li><strong>Mentee Evaluation:</strong> You can now view students applying under you, read their essays, and decide who to accept or decline.</li>
        <li><strong>Certified Coach Badge:</strong> Your official verified badge has been activated across the platform.</li>
      </ul>
    </div>

    <p style="font-weight: 700; color: #0F172A;">Orientation &amp; Session Shadowing:</p>
    <p>A member of our executive team will contact you via WhatsApp (<strong>${app.phone}</strong>) to schedule an orientation call and welcome you to shadow an upcoming Wednesday session at the Abesan Estate Hub.</p>

    <p style="margin-top: 24px;">Thank you for inspiring the next generation of problem solvers.<br><br>Warm regards,<br><strong>Coach Adewale, Coach Soji &amp; The CIH Executive Board</strong></p>
  `;

  const plainText = `Dear Coach ${app.fullName},\n\nCongratulations! Your application to become a Certified CIH Coach in ${app.coachingDomain} has been APPROVED! Your personal Coach Desk on /mentorship is now activated. Welcome to the board!\n\nCIH Executive Board`;
  const htmlBody = buildHtmlWrapper(
    'Welcome to the Coaching Board!',
    'CIH Certified Mentor &amp; Facilitator Appointment',
    'Coach Certified',
    '#D1FAE5',
    '#065F46',
    bodyContent
  );

  return dispatchEmail({
    recipientEmail: app.email,
    recipientName: app.fullName,
    category: 'coach_approved',
    subject,
    htmlBody,
    plainText,
    applicationId: app.id
  });
};

/**
 * C. Coach Application DECLINED
 */
export const sendCoachDeclinedEmail = async (
  app: AlumniCoachApplication
): Promise<SentEmailLog> => {
  const subject = `Update regarding your CIH Coach Application`;

  const bodyContent = `
    <p style="font-size: 15px; margin-top: 0;">Dear <strong>${app.fullName}</strong>,</p>
    
    <p>Thank you for offering your time and expertise to coach at the Community Innovation Hub.</p>

    <div style="background-color: #FFF1F2; border: 1px solid #FECDD3; border-radius: 12px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0; color: #9F1239; font-size: 13px; line-height: 1.6;">
        At this time, our active facilitator roster for your specified domain (<strong>${app.coachingDomain}</strong>) is currently full. We are therefore unable to onboard additional coaches for this immediate cohort.
      </p>
    </div>

    <p style="font-weight: 700; color: #0F172A;">Profile Kept on File:</p>
    <p>We have retained your credentials in our alumni expert directory and will reach out when panel openings or specialized hackathons emerge.</p>

    <p style="margin-top: 24px;">With heartfelt appreciation for your dedication,<br><strong>The CIH Executive Board</strong></p>
  `;

  const plainText = `Dear ${app.fullName},\n\nThank you for offering to coach at CIH. Our active coaching roster in ${app.coachingDomain} is currently full for this cohort. We have kept your profile on file for future opportunities.\n\nCIH Executive Board`;
  const htmlBody = buildHtmlWrapper(
    'Coach Application Update',
    'CIH Coaching Board • Cohort Roster Status',
    'Roster Full',
    '#FFE4E6',
    '#9F1239',
    bodyContent
  );

  return dispatchEmail({
    recipientEmail: app.email,
    recipientName: app.fullName,
    category: 'coach_declined',
    subject,
    htmlBody,
    plainText,
    applicationId: app.id
  });
};

/**
 * Helper to generate Gmail compose link
 */
export const getGmailDirectUrl = (recipientEmail: string, subject: string, bodyText: string): string => {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
};

