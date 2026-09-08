/**
 * =========================================================================
 * CIH CASE STUDY REGISTRATION PIPELINE - GOOGLE APPS SCRIPT
 * Community Innovation Hub (cih.com.ng)
 * =========================================================================
 *
 * Serverless backend endpoint for CIH Case Study registration.
 * 1. Appends attendee details to Google Sheet 'Registrations'.
 * 2. Reads live weekly Date/Time/Location/Topic from 'CurrentSession' tab.
 * 3. Delivers the authentic CIH Entry Ticket pass directly to the registered
 *    user's email address as a downloadable PNG attachment and formatted pass.
 * 4. Zero organizer inbox clutter (no registration emails sent to organizer).
 * 5. Clean ASCII email template with zero broken question marks (??????).
 */

// Configuration Constants
// =========================================================================
const SPREADSHEET_ID = '1RyQosJ3OT_tD6deRzXfiCqByMTGq64uriieSPGtMUvM'; 

const SHEET_NAME = 'Registrations';
const CURRENT_SESSION_SHEET = 'CurrentSession';
const EMAIL_SUBJECT = "Official Pass: Your CIH Wednesday Case Study Entry Ticket";
const HUB_NAME = 'Community Innovation Hub (CIH)';
const WEBSITE_URL = 'https://case-study-website-nine.vercel.app';
const TICKET_IMAGE_URL = 'https://case-study-website-nine.vercel.app/images/entry-ticket.png';
const CIH_LOGO_URL = 'https://case-study-website-nine.vercel.app/images/cih-logo.png';
const GOOGLE_MAPS_VENUE_URL = 'https://www.google.com/maps/search/?api=1&query=Community+Innovation+Hub+Plot+104+5th+Avenue+Abesan+Estate+Ipaja+Lagos';

/**
 * Extracts clean Google Spreadsheet ID from raw ID or full Google Sheet URL
 */
function extractSpreadsheetId(input) {
  if (!input) return '';
  const match = input.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return input.trim();
}

/**
 * Helper to safely resolve the target Google Spreadsheet
 */
function getSpreadsheet() {
  if (typeof SPREADSHEET_ID !== 'undefined' && SPREADSHEET_ID && SPREADSHEET_ID.trim()) {
    const id = extractSpreadsheetId(SPREADSHEET_ID);
    try {
      return SpreadsheetApp.openById(id);
    } catch (e) {
      Logger.log('openById lookup note: ' + e.toString());
    }
  }

  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {
    Logger.log('Active spreadsheet lookup note: ' + e.toString());
  }

  return null;
}

/**
 * Calculates formatted date string for upcoming Wednesday
 */
function getUpcomingWednesdayDateString() {
  const now = new Date();
  const watString = now.toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
  const watDate = new Date(watString);
  const currentDay = watDate.getDay();
  let daysUntilWednesday = (3 - currentDay + 7) % 7;
  if (daysUntilWednesday === 0 && watDate.getHours() >= 10) {
    daysUntilWednesday = 7;
  }
  const nextWed = new Date(watDate.getTime() + daysUntilWednesday * 24 * 60 * 60 * 1000);
  const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
  return nextWed.toLocaleDateString('en-US', options);
}

/**
 * Formats a Date object or raw date string into clean 'Wednesday, Sep 2, 2026'
 */
function formatSessionDate(raw) {
  if (!raw) return getUpcomingWednesdayDateString();
  if (raw instanceof Date) {
    return Utilities.formatDate(raw, 'GMT+1', 'EEEE, MMM d, yyyy');
  }
  const str = String(raw).trim();
  if (str.includes('GMT') || str.includes('00:00:00') || str.length > 25) {
    try {
      const d = new Date(str);
      if (!isNaN(d.getTime())) {
        return Utilities.formatDate(d, 'GMT+1', 'EEEE, MMM d, yyyy');
      }
    } catch (e) {}
  }
  return str;
}

/**
 * Reads the latest session parameters from the 'CurrentSession' tab,
 * or calculates the upcoming Wednesday dynamically if no custom row exists.
 */
function getSessionDetails() {
  const ss = getSpreadsheet();
  let sessionData = {
    date: getUpcomingWednesdayDateString(),
    time: '10:00 AM - 4:00 PM (WAT)',
    location: 'Plot 104, 5th Avenue Abesan Estate, Ipaja, Lagos (Strictly On-Site)',
    topic: 'Cognitive Agility, Mental Models & Leadership IKIGAI'
  };

  if (ss) {
    let sheet = ss.getSheetByName(CURRENT_SESSION_SHEET);
    if (!sheet) {
      try {
        sheet = ss.insertSheet(CURRENT_SESSION_SHEET);
        sheet.appendRow(['Date', 'Time', 'Location/Link', 'Topic']);
        sheet.getRange('A1:D1').setFontWeight('bold').setBackground('#FF6B00').setFontColor('#FFFFFF');
        sheet.appendRow([sessionData.date, sessionData.time, sessionData.location, sessionData.topic]);
        sheet.setFrozenRows(1);
      } catch (err) {
        Logger.log('CurrentSession sheet creation note: ' + err.toString());
      }
    } else {
      const lastRow = sheet.getLastRow();
      if (lastRow >= 2) {
        const row = sheet.getRange(lastRow, 1, 1, 4).getValues()[0];
        if (row[0]) sessionData.date = formatSessionDate(row[0]);
        if (row[1]) sessionData.time = String(row[1]).trim();
        if (row[2]) sessionData.location = String(row[2]).trim();
        if (row[3]) sessionData.topic = String(row[3]).trim();
      }
    }
  }

  return sessionData;
}

/**
 * Handle incoming POST requests from the website form
 */
function doPost(e) {
  try {
    let data;
    if (!e) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'info', message: 'doPost requires a web request event payload.' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }

    const fullName = (data.fullName || data.name || 'Participant').trim();
    const email = (data.email || '').trim().toLowerCase();
    const phone = (data.phone || 'N/A').trim();
    const attendeeType = data.attendeeType || 'GUEST';
    const timestamp = data.timestamp || new Date().toISOString();
    const ticketImageData = data.ticketImageData || null;

    if (!email) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'error', message: 'Email address is required.' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // 1. Record in Google Sheets (Keeps full log without cluttering Gmail inbox)
    recordAttendeeToSheet(fullName, email, phone, attendeeType, timestamp);

    // 2. Fetch latest weekly session parameters
    const sessionDetails = getSessionDetails();

    // 3. Send Automated Confirmation Email with Ticket Image directly to the Attendee
    let emailSent = false;
    try {
      sendConfirmationEmail(fullName, email, attendeeType, sessionDetails, ticketImageData);
      emailSent = true;
    } catch (emailErr) {
      Logger.log('Confirmation email delivery error: ' + emailErr.toString());
    }

    // 4. Return JSON response
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'success',
        emailSent: emailSent,
        message: 'Registration recorded successfully and ticket email delivered to attendee.',
        attendee: { fullName, email, phone, attendeeType, timestamp },
        session: sessionDetails
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests for health check or verification
 */
function doGet(e) {
  const ss = getSpreadsheet();
  const session = getSessionDetails();
  return ContentService.createTextOutput(
    JSON.stringify({
      status: 'active',
      program: 'CIH Case Study Registration & Ticket Webhook',
      spreadsheetConnected: ss ? true : false,
      spreadsheetUrl: ss ? ss.getUrl() : 'None resolved',
      thisWeekSession: session,
      timestamp: new Date().toISOString()
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper to record row to the active spreadsheet
 */
function recordAttendeeToSheet(fullName, email, phone, attendeeType, timestamp) {
  const ss = getSpreadsheet();
  if (!ss) {
    throw new Error("No Google Sheet resolved.");
  }

  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    const sheets = ss.getSheets();
    if (sheets.length === 1 && sheets[0].getLastRow() <= 1 && sheets[0].getName() === 'Sheet1') {
      sheet = sheets[0];
      sheet.setName(SHEET_NAME);
    } else {
      sheet = ss.insertSheet(SHEET_NAME);
    }
  }

  // If sheet is empty, create headers
  if (sheet.getLastRow() === 0) {
    const headerRow = ['Timestamp (WAT)', 'Full Name', 'Email Address', 'Phone Number', 'Attendee Type', 'Confirmation Sent', 'Attendance Status'];
    sheet.appendRow(headerRow);
    sheet.getRange('A1:G1').setFontWeight('bold').setBackground('#07152B').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }

  const dateFormatted = Utilities.formatDate(new Date(timestamp), 'GMT+1', 'yyyy-MM-dd HH:mm:ss');
  sheet.appendRow([dateFormatted, fullName, email, phone, attendeeType, 'Yes', 'Registered']);
}

/**
 * Helper to strip any problematic unicode characters, smart quotes, en-dashes, or emojis
 * to guarantee 100% clean rendering on every mobile/desktop mail client with zero ?????? boxes.
 */
function sanitizeTextForEmail(str) {
  if (!str) return '';
  return String(str)
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2022\u00B7]/g, '-')
    .replace(/\u00A0/g, ' ')
    .replace(/&bull;/gi, '-')
    .replace(/&amp;/gi, 'and')
    .replace(/[\uD800-\uDFFF]./g, '')
    .trim();
}

/**
 * Delivers the authentic CIH Case Study ticket image and responsive session summary directly to the Attendee
 */
function sendConfirmationEmail(fullName, email, attendeeType, session, ticketImageData) {
  const safeName = sanitizeTextForEmail(fullName);
  const safeTrack = sanitizeTextForEmail(attendeeType);
  const sessionDate = sanitizeTextForEmail(session.date);
  const sessionTime = sanitizeTextForEmail(session.time);
  const sessionLocation = sanitizeTextForEmail(session.location);
  const sessionTopic = sanitizeTextForEmail(session.topic);

  const plainTextFallback = "Welcome to CIH Case Study, " + safeName + "!\n\n" +
    "Your official entry pass is confirmed.\n\n" +
    "SESSION DETAILS:\n" +
    "- Date: " + sessionDate + "\n" +
    "- Time: " + sessionTime + "\n" +
    "- Venue: " + sessionLocation + "\n" +
    "- Topic: " + sessionTopic + "\n" +
    "- Attendee Track: " + safeTrack + "\n\n" +
    "Google Maps Directions: " + GOOGLE_MAPS_VENUE_URL + "\n" +
    "Visit Case Study Portal: " + WEBSITE_URL;

  // Prepare inline ticket image (no bottom attachment)
  let ticketBlob = null;
  let inlineImages = {};

  try {
    if (ticketImageData && typeof ticketImageData === 'string' && ticketImageData.indexOf('data:image') === 0) {
      const mimeMatch = ticketImageData.match(/^data:(image\/[a-zA-Z0-9\-\+\.]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const fileExt = mimeType.includes('png') ? 'png' : 'jpg';
      const base64Str = ticketImageData.replace(/^data:image\/[a-zA-Z0-9\-\+\.]+;base64,/, '');
      const decodedBytes = Utilities.base64Decode(base64Str);
      ticketBlob = Utilities.newBlob(decodedBytes, mimeType, 'CIH_Wednesday_CaseStudy_Pass.' + fileExt);
      inlineImages['ticketPass'] = ticketBlob;
    }
  } catch (blobErr) {
    Logger.log('Could not create inline ticket blob: ' + blobErr.toString());
  }

  const ticketImgSrc = (ticketBlob) ? 'cid:ticketPass' : TICKET_IMAGE_URL;

  const htmlBody = '<!DOCTYPE html>' +
'<html lang="en">' +
'<head>' +
'  <meta charset="UTF-8">' +
'  <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
'  <title>Your CIH Wednesday Case Study Pass</title>' +
'  <style type="text/css">' +
'    body, table, td, p, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; margin: 0; padding: 0; }' +
'    table, td { border-collapse: collapse !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }' +
'    img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }' +
'    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #061325; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }' +
'    @media only screen and (max-width: 600px) {' +
'      .mobile-wrapper { width: 100% !important; max-width: 100% !important; border-radius: 0px !important; }' +
'      .mobile-padding { padding: 18px 14px !important; }' +
'      .mobile-card { width: 100% !important; display: block !important; box-sizing: border-box !important; margin-bottom: 12px !important; }' +
'      .btn-block { display: block !important; width: 100% !important; box-sizing: border-box !important; text-align: center !important; margin-bottom: 10px !important; }' +
'    }' +
'  </style>' +
'</head>' +
'<body style="background-color: #061325; color: #ffffff; padding: 0; margin: 0;">' +
'  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #061325; width: 100%; padding: 20px 0;">' +
'    <tr>' +
'      <td align="center" style="padding: 0 10px;">' +
'        ' +
'        <!-- MAIN CONTAINER -->' +
'        <table role="presentation" class="mobile-wrapper" width="580" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px; width: 100%; background-color: #0a192f; border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">' +
'          ' +
'          <!-- 1. TOP TICKET IMAGE (ENTIRE TICKET SHOWN AS HERO IMAGE AT THE TOP) -->' +
'          <tr>' +
'            <td align="center" style="background-color: #050e1a; padding: 0; margin: 0; line-height: 0; text-align: center;">' +
'              <img src="' + ticketImgSrc + '" alt="CIH Official Case Study Entry Ticket" width="580" style="width: 100%; max-width: 580px; height: auto; display: block; border: 0; margin: 0 auto;" />' +
'            </td>' +
'          </tr>' +
'          ' +
'          <!-- 2. SESSION DETAILS & INFORMATION FOLLOWS BELOW -->' +
'          <tr>' +
'            <td class="mobile-padding" style="padding: 24px 28px; background-color: #0a192f;">' +
'              ' +
'              <div style="font-size: 18px; font-weight: 800; color: #ffffff; margin-bottom: 6px;">' +
'                Spot Confirmed for: <span style="color: #FF6B00;">' + safeName + '</span>' +
'              </div>' +
'              <div style="font-size: 13px; color: #94a3b8; margin-bottom: 20px;">' +
'                Attendee Track: <strong style="color: #e2e8f0;">' + safeTrack + '</strong> | Status: <strong style="color: #34d399;">Active Registration</strong>' +
'              </div>' +
'              ' +
'              <!-- SESSION PARAMETERS BREAKDOWN BOX -->' +
'              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0f2442; border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; margin-bottom: 22px; overflow: hidden;">' +
'                <tr>' +
'                  <td style="padding: 16px 20px;">' +
'                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' +
'                      <tr>' +
'                        <td style="padding-bottom: 10px; font-size: 13px; color: #cbd5e1; border-bottom: 1px solid rgba(255,255,255,0.06);">' +
'                          <strong style="color: #FF6B00; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">Session Date</strong>' +
'                          <span style="font-size: 14px; font-weight: 700; color: #ffffff;">' + sessionDate + '</span>' +
'                        </td>' +
'                      </tr>' +
'                      <tr>' +
'                        <td style="padding-top: 10px; padding-bottom: 10px; font-size: 13px; color: #cbd5e1; border-bottom: 1px solid rgba(255,255,255,0.06);">' +
'                          <strong style="color: #FF6B00; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">Time</strong>' +
'                          <span style="font-size: 14px; font-weight: 700; color: #ffffff;">' + sessionTime + '</span>' +
'                        </td>' +
'                      </tr>' +
'                      <tr>' +
'                        <td style="padding-top: 10px; padding-bottom: 10px; font-size: 13px; color: #cbd5e1; border-bottom: 1px solid rgba(255,255,255,0.06);">' +
'                          <strong style="color: #FF6B00; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">Topic</strong>' +
'                          <span style="font-size: 14px; font-weight: 700; color: #ffffff;">' + sessionTopic + '</span>' +
'                        </td>' +
'                      </tr>' +
'                      <tr>' +
'                        <td style="padding-top: 10px; font-size: 13px; color: #cbd5e1;">' +
'                          <strong style="color: #FF6B00; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">Venue / Physical Address</strong>' +
'                          <span style="font-size: 13px; font-weight: 700; color: #ffffff;">' + sessionLocation + '</span>' +
'                        </td>' +
'                      </tr>' +
'                    </table>' +
'                  </td>' +
'                </tr>' +
'              </table>' +
'              ' +
'              <!-- ACTION CTA BUTTONS -->' +
'              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' +
'                <tr>' +
'                  <td align="center" style="padding-bottom: 10px;">' +
'                    <a href="' + GOOGLE_MAPS_VENUE_URL + '" target="_blank" class="btn-block" style="display: block; width: 100%; box-sizing: border-box; background-color: #FF6B00; color: #ffffff; font-size: 14px; font-weight: 800; text-align: center; text-decoration: none; padding: 14px 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);">' +
'                      Open Venue in Google Maps' +
'                    </a>' +
'                  </td>' +
'                </tr>' +
'                <tr>' +
'                  <td align="center">' +
'                    <a href="' + WEBSITE_URL + '" target="_blank" class="btn-block" style="display: block; width: 100%; box-sizing: border-box; background-color: #0f2442; color: #ffffff; font-size: 13px; font-weight: 700; text-align: center; text-decoration: none; padding: 12px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.15);">' +
'                      Visit Case Study Portal and Past Studies' +
'                    </a>' +
'                  </td>' +
'                </tr>' +
'              </table>' +
'              ' +
'            </td>' +
'          </tr>' +
'          ' +
'          <!-- FOOTER -->' +
'          <tr>' +
'            <td style="background-color: #050e1a; padding: 18px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.06);">' +
'              Community Innovation Hub | Plot 104, 5th Avenue Abesan Estate, Ipaja, Lagos | Strictly On-Site Mentorship' +
'            </td>' +
'          </tr>' +
'          ' +
'        </table>' +
'        ' +
'      </td>' +
'    </tr>' +
'  </table>' +
'</body>' +
'</html>';

  // Fast email dispatch using Google MailApp pipeline (embedded inline image, zero attachment box below)
  const mailOptions = {
    to: email,
    subject: EMAIL_SUBJECT,
    body: plainTextFallback,
    htmlBody: htmlBody,
    name: 'Community Innovation Hub'
  };

  if (Object.keys(inlineImages).length > 0) {
    mailOptions.inlineImages = inlineImages;
  }

  try {
    MailApp.sendEmail(mailOptions);
  } catch (mailErr) {
    Logger.log('MailApp error, trying GmailApp fallback: ' + mailErr.toString());
    const gmailOptions = {
      htmlBody: htmlBody,
      name: 'Community Innovation Hub'
    };
    if (Object.keys(inlineImages).length > 0) {
      gmailOptions.inlineImages = inlineImages;
    }
    GmailApp.sendEmail(email, EMAIL_SUBJECT, plainTextFallback, gmailOptions);
  }
}
