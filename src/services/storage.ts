import { CaseStudy, UpcomingSession, AttendeeRecord, CaseStudyFeedback, MentorshipApplication, FAQItem, TopicSuggestion, AdminConfig, Testimonial, AuthUser, RememberedAccount } from '../types';
import { initialCaseStudies, initialUpcomingSession, initialTestimonials } from '../data/initialData';

const CASE_STUDIES_KEY = 'cih_case_studies_v2';
const UPCOMING_SESSION_KEY = 'cih_upcoming_session_v2';
const REGISTRATIONS_KEY = 'cih_registrations_v1';
const ADMIN_CONFIG_KEY = 'cih_admin_config_v1';
const FEEDBACK_KEY = 'cih_feedback_v2';
const MENTORSHIP_KEY = 'cih_mentorship_v1';
const USER_QUESTIONS_KEY = 'cih_user_questions_v1';
const TOPIC_SUGGESTIONS_KEY = 'cih_topic_suggestions_v1';
const TESTIMONIALS_KEY = 'cih_testimonials_v1';
const AUTH_USER_KEY = 'cih_auth_user_v1';
const USERS_STORE_KEY = 'cih_users_v1';
const REMEMBERED_ACCOUNTS_KEY = 'cih_remembered_accounts_v1';
const LAST_LOGIN_EMAIL_KEY = 'cih_last_login_email_v1';

export type { AdminConfig };

export const getStoredCaseStudies = (): CaseStudy[] => {
  try {
    const saved = localStorage.getItem(CASE_STUDIES_KEY);
    if (saved) {
      const parsed: CaseStudy[] = JSON.parse(saved);
      const initialMap = new Map(initialCaseStudies.map(s => [s.id, s]));
      const updated = parsed.map(study => {
        const init = initialMap.get(study.id);
        if (init) {
          return {
            ...study,
            date: init.date,
            weekNumber: init.weekNumber,
            imageUrl: init.imageUrl,
            galleryImages: init.galleryImages || study.galleryImages,
            videoUrl: init.videoUrl || study.videoUrl,
            youtubeUrl: init.youtubeUrl || study.youtubeUrl,
            youtubeVideoId: init.youtubeVideoId || study.youtubeVideoId,
            videoTitle: init.videoTitle || study.videoTitle,
          };
        }
        return study;
      });
      const existingIds = new Set(updated.map((s) => s.id));
      const newStudies = initialCaseStudies.filter((s) => !existingIds.has(s.id));
      const finalStudies = [...newStudies, ...updated];
      localStorage.setItem(CASE_STUDIES_KEY, JSON.stringify(finalStudies));
      return finalStudies;
    }
  } catch (err) {
    console.error('Error loading stored case studies', err);
  }
  return initialCaseStudies;
};

export const saveStoredCaseStudies = (studies: CaseStudy[]): void => {
  try {
    localStorage.setItem(CASE_STUDIES_KEY, JSON.stringify(studies));
  } catch (err) {
    console.error('Error saving case studies', err);
  }
};

export const getStoredUpcomingSession = (): UpcomingSession => {
  try {
    const saved = localStorage.getItem(UPCOMING_SESSION_KEY);
    if (saved) {
      const parsed: UpcomingSession = JSON.parse(saved);
      return { ...parsed, dateStr: initialUpcomingSession.dateStr, weekTitle: initialUpcomingSession.weekTitle };
    }
  } catch (err) {
    console.error('Error loading upcoming session', err);
  }
  return initialUpcomingSession;
};

export const saveStoredUpcomingSession = (session: UpcomingSession): void => {
  try {
    localStorage.setItem(UPCOMING_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Error saving upcoming session', err);
  }
};

export const getStoredRegistrations = (): AttendeeRecord[] => {
  try {
    const saved = localStorage.getItem(REGISTRATIONS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error loading registrations', err);
  }
  return [
    {
      id: 'reg-demo-1',
      fullName: 'Amina Yusuf',
      email: 'amina.yusuf@gmail.com',
      phone: '+234 802 345 6789',
      attendeeType: 'Alumni / Past Native',
      mediaConsent: true,
      attendanceEssay: 'I am applying to attend this upcoming Wednesday Case Study session because I believe structured peer analysis is vital for continuous professional growth. Having previously graduated from the hub, I have witnessed first-hand how the practical simulations and ethical debates push participants beyond rote textbook knowledge. This specific topic on Mindset & Problem Framing is deeply relevant to my day-to-day challenges as a junior software engineer navigating product trade-offs. Often in engineering, we rush to implement technical solutions before truly understanding the underlying user pain point or business constraint. Exploring the 5-Whys framework and Root Cause Analysis under the guidance of CIH coaches will sharpen my critical thinking and enable me to lead technical breakout pods with higher clarity. Furthermore, I want to actively mentor first-time attendees during the cohort discussions, sharing my journey and learning from their fresh perspectives. Being in the physical room with ambitious peers creates an accountability structure that remote learning simply cannot replicate. I am committed to arriving promptly at 10:00 AM, contributing constructively to all case study exercises, and applying the lessons directly to both community initiatives and my ongoing engineering career.',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: 'pending',
      syncedToGoogleSheets: true
    },
    {
      id: 'reg-demo-2',
      fullName: 'Emmanuel Okafor',
      email: 'emmanuel.okafor@gmail.com',
      phone: '+234 803 456 7890',
      attendeeType: 'GUEST',
      mediaConsent: true,
      attendanceEssay: 'Attending the Community Innovation Hub Case Study is an important step in my personal and career development this year. As a recent university graduate transitioning into technology and strategic consulting, I frequently encounter complex, ambiguous problems where traditional academic formulas fall short. I want to attend this session to immerse myself in high-intensity decision science and learn how seasoned coaches break down high-stakes corporate failures. The topic of Mindset & Problem Framing speaks directly to my current learning goals. I want to master first-principles reasoning so I can assess ambiguous business dilemmas without cognitive bias. Engaging with experienced directors like Coach Adewale and Coach Soji will provide me with actionable mentorship that accelerates my professional maturity. Additionally, the collaborative syndicate work in breakout pods will challenge me to defend my hypotheses under peer scrutiny while refining my communication skills. I value the strict 20-participant intimate setting and promise to be fully engaged from start to finish, absorbing every insight and giving my best to the collective discussion.',
      timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
      status: 'pending',
      syncedToGoogleSheets: true
    }
  ];
};

export const saveStoredRegistrations = (registrations: AttendeeRecord[]): void => {
  try {
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
  } catch (err) {
    console.error('Error saving registrations', err);
  }
};

// Case Study Feedback & Discussion
export const getStoredFeedback = (): CaseStudyFeedback[] => {
  try {
    const saved = localStorage.getItem(FEEDBACK_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error loading feedback', err);
  }
  return [
    {
      id: 'fb-0',
      caseStudyId: 'the-elevator-pitch',
      userName: 'Tobi Fashola',
      userEmail: 'tobi.f@example.com',
      comment: 'Pitching our intern project under 3 minutes was exhilarating! And seeing the new Case Study website live on the screen was inspiring.',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      adminReply: 'Incredible delivery by all the interns and ITs! The Case Study platform is now live for everyone to experience.',
      adminRepliedAt: new Date(Date.now() - 86400000 * 0.5).toISOString()
    },
    {
      id: 'fb-1',
      caseStudyId: 'the-beautiful-ones',
      userName: 'Chidi Nwosu',
      userEmail: 'chidi.n@example.com',
      comment: 'The session on moral fortitude deeply challenged my view on corporate shortcuts. Great presentation!',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      adminReply: 'Thank you Chidi! Sustaining ethical standards under pressure is at the heart of CIH leadership principles.',
      adminRepliedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'fb-2',
      caseStudyId: 'can-machines-think-turing',
      userName: 'Blessing Adebayo',
      userEmail: 'blessing.a@example.com',
      comment: 'Will we have a hands-on workshop on generative AI prompt engineering during the next session?',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ];
};

export const saveStoredFeedback = (feedback: CaseStudyFeedback[]): void => {
  try {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback));
  } catch (err) {
    console.error('Error saving feedback', err);
  }
};

// Mentorship Applications
export const getStoredMentorshipApplications = (): MentorshipApplication[] => {
  try {
    const saved = localStorage.getItem(MENTORSHIP_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error loading mentorship applications', err);
  }
  const now = Date.now();
  return [
    {
      id: 'ment-1',
      fullName: 'Kelechi Mark',
      email: 'kelechi.mark@gmail.com',
      phone: '+234 803 123 4567',
      reasonNeeded: 'Seeking guidance on transitioning from junior software developer to product management and tech leadership within the African startup ecosystem.',
      focusArea: 'Career Transition & Tech Leadership',
      desiredMentor: 'Coach Adewale Oseni',
      createdAt: new Date(now - 86400000 * 2).toISOString(),
      status: 'pending',
      cohortStartDate: new Date(now - 86400000 * 2).toISOString(),
      cohortEndDate: new Date(now + 86400000 * 88).toISOString()
    },
    {
      id: 'ment-2',
      fullName: 'Blessing Adeyemi',
      email: 'blessing.adeyemi@gmail.com',
      phone: '+234 802 987 6543',
      reasonNeeded: 'Need strategic mentorship on design systems, cross-functional stakeholder presentation, and ethical decision making.',
      focusArea: 'Personal Growth & Leadership Mindset',
      desiredMentor: 'Coach Soji Megbowon',
      createdAt: new Date(now - 86400000 * 1).toISOString(),
      status: 'pending',
      cohortStartDate: new Date(now - 86400000 * 1).toISOString(),
      cohortEndDate: new Date(now + 86400000 * 89).toISOString()
    }
  ];
};

export const saveStoredMentorshipApplications = (apps: MentorshipApplication[]): void => {
  try {
    localStorage.setItem(MENTORSHIP_KEY, JSON.stringify(apps));
  } catch (err) {
    console.error('Error saving mentorship applications', err);
  }
};

// User Submitted Questions for FAQ
export const getStoredUserQuestions = (): FAQItem[] => {
  try {
    const saved = localStorage.getItem(USER_QUESTIONS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error loading user questions', err);
  }
  return [
    {
      id: 'uq-1',
      category: 'User Questions',
      question: 'Is parking space available at Plot 104, Abesan Estate for Wednesday attendees?',
      answer: 'Yes! Secure parking is available directly at the Community Innovation Hub premises for all registered GUEST and Alumni participants.',
      askedByName: 'Tunde Bakare',
      isUserQuestion: true,
      status: 'answered',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    }
  ];
};

export const saveStoredUserQuestions = (questions: FAQItem[]): void => {
  try {
    localStorage.setItem(USER_QUESTIONS_KEY, JSON.stringify(questions));
  } catch (err) {
    console.error('Error saving user questions', err);
  }
};

// Topic Suggestions Pipeline ("What would you like us to teach?")
export const getStoredTopicSuggestions = (): TopicSuggestion[] => {
  try {
    const saved = localStorage.getItem(TOPIC_SUGGESTIONS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error loading topic suggestions', err);
  }
  return [
    {
      id: 'topic-sug-1',
      fullName: 'David Adeleke',
      email: 'david.a@example.com',
      suggestedTopic: 'Navigating AI Tools in Modern Software Development',
      whyNeeded: 'Understanding ethical AI usage and productive prompt engineering for beginners.',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      votes: 14
    },
    {
      id: 'topic-sug-2',
      fullName: 'Chidimma Nwosu',
      email: 'chidimma.n@example.com',
      suggestedTopic: 'Financial Literacy & Investment Risk Management for Youth',
      whyNeeded: 'How to manage personal budget, save wisely, and avoid online investment scams.',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      votes: 22
    }
  ];
};

export const saveStoredTopicSuggestions = (suggestions: TopicSuggestion[]): void => {
  try {
    localStorage.setItem(TOPIC_SUGGESTIONS_KEY, JSON.stringify(suggestions));
  } catch (err) {
    console.error('Error saving topic suggestions', err);
  }
};

const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbySAoLruOTVmPf2jAKgzdavaDhj7igaALEm9urptK9AdrWRKw8gf2NpIgzBae1MEfKK/exec';

export const getAdminConfig = (): AdminConfig => {
  try {
    const saved = localStorage.getItem(ADMIN_CONFIG_KEY);
    if (saved) {
      const parsed: AdminConfig = JSON.parse(saved);
      // Ensure we don't use the old deleted script URL
      if (parsed.appsScriptUrl && parsed.appsScriptUrl.includes('AKfycbwLaDsKM2WH0vcz68M0Gm8BYdR2h1720o5RQNPIVnfu0XVBQ-rVtXUHNmS-E7w3pMfu')) {
        parsed.appsScriptUrl = DEFAULT_APPS_SCRIPT_URL;
        localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(parsed));
      }
      if (parsed.appsScriptUrl && parsed.appsScriptUrl.trim().startsWith('http')) {
        return { registrationMode: 'auto', ...parsed };
      }
      return { registrationMode: 'auto', ...parsed, appsScriptUrl: DEFAULT_APPS_SCRIPT_URL };
    }
  } catch (err) {
    console.error('Error loading admin config', err);
  }
  return {
    appsScriptUrl: import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || DEFAULT_APPS_SCRIPT_URL,
    adminPasscode: 'cih2024',
    registrationMode: 'auto'
  };
};

export const saveAdminConfig = (config: AdminConfig): void => {
  try {
    localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving admin config', err);
  }
};

// ==========================================
// Testimonials Storage
// ==========================================
export const getStoredTestimonials = (): Testimonial[] => {
  try {
    const saved = localStorage.getItem(TESTIMONIALS_KEY);
    if (saved) {
      const parsed: Testimonial[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map(t => t.id));
      const missingInitial = initialTestimonials.filter(t => !existingIds.has(t.id));
      const combined = [...parsed, ...missingInitial];
      return combined;
    }
  } catch (err) {
    console.error('Error loading testimonials', err);
  }
  return initialTestimonials;
};

export const saveStoredTestimonials = (testimonials: Testimonial[]): void => {
  try {
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(testimonials));
  } catch (err) {
    console.error('Error saving testimonials', err);
  }
};

export const addStoredTestimonial = (testimonial: Testimonial): void => {
  const current = getStoredTestimonials();
  const updated = [testimonial, ...current];
  saveStoredTestimonials(updated);
};

// ==========================================
// Authentication & User Accounts Storage
// ==========================================
export const getStoredAuthUser = (): AuthUser | null => {
  try {
    const saved = localStorage.getItem(AUTH_USER_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error loading current auth user', err);
  }
  return null;
};

export const saveStoredAuthUser = (user: AuthUser | null): void => {
  try {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  } catch (err) {
    console.error('Error saving auth user', err);
  }
};

export const getStoredUsers = (): (AuthUser & { passwordHash?: string })[] => {
  try {
    const saved = localStorage.getItem(USERS_STORE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error loading registered users', err);
  }
  // Registered community users
  return [
    {
      id: 'usr-guest-1',
      fullName: 'Tunde Oladipo',
      email: 'tunde.oladipo@gmail.com',
      passwordHash: 'guest123',
      phone: '+234 803 111 2233',
      role: 'guest',
      isAlumni: false,
      createdAt: '2026-08-01T10:00:00.000Z'
    },
    {
      id: 'usr-alumni-1',
      fullName: 'Chisom Eze',
      email: 'chisom.eze@gmail.com',
      passwordHash: 'alumni123',
      phone: '+234 802 444 5566',
      role: 'alumni',
      isAlumni: true,
      alumniCohort: '2023 Cohort 12 Web Track',
      isMentorVolunteer: true,
      linkedinUrl: 'https://www.linkedin.com/in/chisom-eze',
      mentorFocusAreas: ['Tech & Artificial Intelligence', 'Cognitive Agility & Mindset', 'Ethics & Leadership'],
      mentorBio: 'Software Engineer and CIH graduate eager to guide breakout pods in technical problem solving.',
      createdAt: '2026-07-15T09:00:00.000Z'
    },
    {
      id: 'usr-coach-adewale',
      fullName: 'Adewale Oseni',
      email: 'adewale.oseni@gmail.com',
      passwordHash: 'coach123',
      phone: '+234 803 999 8877',
      role: 'alumni',
      isAlumni: true,
      isApprovedMentor: true,
      mentorRole: 'Coach',
      alumniCohort: 'Hub Co-Founder',
      linkedinUrl: 'https://www.linkedin.com/in/adewalepaul',
      mentorFocusAreas: ['Cognitive Decision Science', 'Youth Empowerment & Leadership IKIGAI'],
      mentorBio: 'Co-Founder and on-site coach leading youth empowerment and cognitive decision science.',
      createdAt: '2026-06-01T08:00:00.000Z'
    }
  ];
};

export const saveStoredUsers = (users: (AuthUser & { passwordHash?: string })[]): void => {
  try {
    localStorage.setItem(USERS_STORE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving users store', err);
  }
};

export const getStoredRememberedAccounts = (): RememberedAccount[] => {
  try {
    const saved = localStorage.getItem(REMEMBERED_ACCOUNTS_KEY);
    if (saved) {
      const parsed: RememberedAccount[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading remembered accounts', err);
  }

  // Fallback: seed from any registered users in local storage
  const users = getStoredUsers();
  const seeded: RememberedAccount[] = users.slice(0, 3).map((u) => ({
    email: u.email,
    fullName: u.fullName,
    role: u.role,
    alumniCohort: u.alumniCohort,
    lastUsedAt: u.createdAt || new Date().toISOString()
  }));
  return seeded;
};

export const saveRememberedAccount = (account: {
  email: string;
  fullName: string;
  role: 'guest' | 'alumni';
  alumniCohort?: string;
}): void => {
  try {
    const current = getStoredRememberedAccounts();
    const cleanEmail = account.email.trim().toLowerCase();
    const filtered = current.filter((a) => a.email.toLowerCase() !== cleanEmail);
    const updated: RememberedAccount[] = [
      {
        email: cleanEmail,
        fullName: account.fullName.trim(),
        role: account.role,
        alumniCohort: account.alumniCohort,
        lastUsedAt: new Date().toISOString()
      },
      ...filtered
    ].slice(0, 5);
    localStorage.setItem(REMEMBERED_ACCOUNTS_KEY, JSON.stringify(updated));
    localStorage.setItem(LAST_LOGIN_EMAIL_KEY, cleanEmail);
  } catch (err) {
    console.error('Error saving remembered account', err);
  }
};

export const removeRememberedAccount = (email: string): void => {
  try {
    const current = getStoredRememberedAccounts();
    const cleanEmail = email.trim().toLowerCase();
    const filtered = current.filter((a) => a.email.toLowerCase() !== cleanEmail);
    localStorage.setItem(REMEMBERED_ACCOUNTS_KEY, JSON.stringify(filtered));
    if (getLastLoginEmail() === cleanEmail) {
      localStorage.removeItem(LAST_LOGIN_EMAIL_KEY);
    }
  } catch (err) {
    console.error('Error removing remembered account', err);
  }
};

export const getLastLoginEmail = (): string => {
  try {
    return localStorage.getItem(LAST_LOGIN_EMAIL_KEY) || '';
  } catch {
    return '';
  }
};

export const setLastLoginEmail = (email: string): void => {
  try {
    localStorage.setItem(LAST_LOGIN_EMAIL_KEY, email.trim().toLowerCase());
  } catch {
    // Ignore error
  }
};

