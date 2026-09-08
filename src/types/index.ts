export interface CaseStudy {
  id: string;
  title: string;
  subtitle?: string;
  sector: string;
  tagColor?: string;
  date: string;
  weekNumber?: number;
  imageUrl: string;
  galleryImages?: string[];
  videoUrl?: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  videoTitle?: string;
  excerpt: string;
  fullContent?: string;
  keyTakeaways?: string[];
  discussionQuestions?: string[];
  featured?: boolean;
}

export interface TopicModule {
  id: string;
  title: string;
  theme: 'Tech & Artificial Intelligence' | 'Ethics & Leadership' | 'Cognitive Agility & Mindset' | 'Personal Growth & Life Skills';
  category: string;
  iconName: 'lightbulb' | 'briefcase' | 'shield' | 'handshake' | 'megaphone' | 'layers';
  shortDescription: string;
  fullOverview?: string;
  learningOutcomes?: string[];
  sampleCase?: string;
  duration?: string;
  imageUrl?: string;
}

export interface UpcomingSession {
  weekTitle: string;
  topicTitle: string;
  dateStr: string;
  badgeText: string;
  description: string;
  detailedOverview: string;
  facilitator?: string;
  time?: string;
  location?: string;
}

export interface FAQItem {
  id: string;
  category: 'What is Case Study?' | 'Logistics' | 'Who it\'s for' | 'Registration' | 'What to Expect' | 'Outcomes' | 'User Questions';
  question: string;
  answer: string;
  askedByName?: string;
  userEmail?: string;
  isUserQuestion?: boolean;
  status?: 'answered' | 'pending';
  createdAt?: string;
  lockedAfterAnswer?: boolean;
  emergencyUnlockCount?: number;
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  attendeeType: 'Alumni / Past Native' | 'GUEST' | 'Hub Member' | 'New Attendee';
  mediaConsent: boolean;
  interestAreas?: string;
  attendanceEssay?: string; // Minimum 300 words: why attend and why this topic
  timestamp?: string;
  ticketImageData?: string;
}

export interface AttendeeRecord extends RegistrationFormData {
  id: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined' | 'attended';
  selectionEmailDispatched?: boolean;
  selectedForSession?: boolean;
  selectionDate?: string;
  passDispatchedAt?: string;
  ticketIssued?: boolean;
  ticketImageData?: string;
  syncedToGoogleSheets?: boolean;
}

export interface TopicSuggestion {
  id: string;
  fullName: string;
  email?: string;
  suggestedTopic: string;
  whyNeeded?: string;
  createdAt: string;
  votes: number;
}

export interface CaseStudyFeedback {
  id: string;
  caseStudyId: string;
  userName: string;
  userEmail?: string;
  comment: string;
  createdAt: string;
  adminReply?: string;
  adminRepliedAt?: string;
}

export interface MentorshipApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  reasonNeeded: string;
  focusArea?: string;
  desiredMentor?: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'declined';
  cohortStartDate?: string;
  cohortEndDate?: string; // 3 months from cohortStartDate
}

export interface AlumniCoachApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  alumniTrack: 'CIH Graduate / Alumni' | 'Hub Intern / IT Graduate' | 'Senior Fellow' | 'Industry Professional';
  graduationYear?: string;
  currentRole: string; // e.g. Software Engineer, Product Designer, Founder
  organization?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  coachingDomain: string; // e.g. "Tech & AI", "Ethics & Leadership", "Career Growth & Job Search", "Cognitive Mindset & Life Skills"
  statementOfPurpose: string; // Why do you want to coach and give back at CIH Wednesday Case Studies?
  availability: 'On-site Wednesdays (Abesan Estate)' | 'Virtual 1-on-1 Breakouts' | 'Both On-site & Virtual';
  yearsOfExperience?: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'declined';
  adminNotes?: string;
}

export interface AdminConfig {
  appsScriptUrl: string;
  adminPasscode: string;
  registrationMode?: 'auto' | 'force_open' | 'force_closed';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  attendeeType: 'CIH Alumni' | 'GUEST' | 'Hub Native' | 'Youth Fellow';
  avatarUrl?: string;
  initials: string;
  quote: string;
  highlight: string;
  rating: number; // 1-5
  sessionTopic?: string;
  cohort?: string;
  createdAt: string;
  featured?: boolean;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'guest' | 'alumni';
  isAlumni: boolean;
  alumniCohort?: string;
  isMentorVolunteer?: boolean;
  isApprovedMentor?: boolean; // Certified Coach
  mentorRole?: 'Coach';
  mentorFocusAreas?: string[];
  mentorBio?: string;
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  skills?: string[];
  sessionsAttended?: number;
  organization?: string;
  createdAt: string;
}

export interface SignUpFormData {
  fullName: string;
  email: string;
  password?: string;
  phone: string;
  role: 'guest' | 'alumni';
  alumniCohort?: string;
  isMentorVolunteer?: boolean;
  linkedinUrl?: string;
  mentorFocusAreas?: string[];
  mentorBio?: string;
}

export interface RememberedAccount {
  email: string;
  fullName: string;
  role: 'guest' | 'alumni';
  alumniCohort?: string;
  lastUsedAt: string;
}

