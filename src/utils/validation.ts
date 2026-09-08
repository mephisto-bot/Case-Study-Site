/**
 * Form validation helpers for CIH Case Study platform
 */

/**
 * Validates that an email is non-empty and strictly belongs to the @gmail.com domain.
 * Requirement 18: If a gmail is required in an input, do not continue or accept until a gmail is added.
 */
export function isValidGmail(email: string): boolean {
  if (!email) return false;
  const trimmed = email.trim().toLowerCase();
  // Must match standard username + @gmail.com
  const gmailRegex = /^[a-z0-9](\.?[a-z0-9]){4,}@gmail\.com$/i;
  // A slightly more permissive fallback for general gmail formats:
  const generalGmailRegex = /^[^\s@]+@gmail\.com$/i;
  return generalGmailRegex.test(trimmed);
}

export const GMAIL_ERROR_MESSAGE = 'A valid Gmail address (@gmail.com) is strictly required to proceed.';

/**
 * Counts words separated by whitespace in a given string
 */
export function countWords(text: string): number {
  if (!text) return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

/**
 * Validates that a string is a valid LinkedIn profile URL
 * Requirement 10: LinkedIn is not optional for alumni applying/volunteering to be mentors
 */
export function isValidLinkedIn(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  return trimmed.includes('linkedin.com/') && trimmed.length > 'linkedin.com/'.length + 2;
}

export const LINKEDIN_ERROR_MESSAGE = 'A valid LinkedIn profile URL is required (e.g. linkedin.com/in/yourname).';
