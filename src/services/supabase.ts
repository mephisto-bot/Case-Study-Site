import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AttendeeRecord, AuthUser } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-ref')
  );
};

// Graceful client initialization (prevents crash if env vars are pending)
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-key'
);

/**
 * Inserts an on-site Wednesday Case Study registration into Supabase
 */
export const insertRegistrationToSupabase = async (
  record: AttendeeRecord,
  sessionDate?: string
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) {
    console.info('Supabase credentials not configured in .env; skipping cloud sync.');
    return { success: false, error: 'Supabase credentials not configured.' };
  }

  try {
    const { error } = await supabase
      .from('registrations')
      .insert([
        {
          id: record.id,
          full_name: record.fullName,
          email: record.email,
          phone: record.phone,
          attendee_type: record.attendeeType,
          media_consent: record.mediaConsent,
          session_date: sessionDate || new Date().toISOString().split('T')[0],
          status: record.status || 'confirmed',
          created_at: record.timestamp || new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Supabase registration insert error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Supabase registration exception:', err);
    return { success: false, error: err?.message || 'Network error connecting to Supabase.' };
  }
};

/**
 * Fetches all registered attendees from Supabase
 */
export const fetchRegistrationsFromSupabase = async (): Promise<AttendeeRecord[]> => {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Could not fetch registrations from Supabase:', error);
      return [];
    }

    return data.map((row: any) => ({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone,
      attendeeType: row.attendee_type,
      mediaConsent: row.media_consent,
      timestamp: row.created_at,
      status: row.status,
      syncedToGoogleSheets: true
    }));
  } catch (err) {
    console.warn('Supabase fetch exception:', err);
    return [];
  }
};

/**
 * Inserts or updates user signup profile into Supabase
 */
export const insertUserToSupabase = async (
  user: AuthUser
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase credentials not configured.' };
  }

  try {
    const { error } = await supabase
      .from('users')
      .upsert([
        {
          id: user.id,
          full_name: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          is_alumni: user.isAlumni,
          alumni_cohort: user.alumniCohort || null,
          is_mentor_volunteer: user.isMentorVolunteer,
          mentor_focus_areas: user.mentorFocusAreas || [],
          mentor_bio: user.mentorBio || null,
          created_at: user.createdAt || new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Supabase user upsert error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Supabase user exception:', err);
    return { success: false, error: err?.message };
  }
};
