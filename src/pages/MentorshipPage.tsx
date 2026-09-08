import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  ArrowRight, 
  UserCheck, 
  Lightbulb, 
  Users, 
  Target, 
  Check, 
  ChevronDown, 
  User, 
  Clock, 
  Mail, 
  Phone, 
  ExternalLink, 
  Award,
  XCircle,
  FileSpreadsheet,
  Briefcase,
  GraduationCap,
  Building2
} from 'lucide-react';
import { 
  getStoredMentorshipApplications, 
  saveStoredMentorshipApplications, 
  getStoredAlumniCoachApplications, 
  saveStoredAlumniCoachApplications, 
  getAdminConfig 
} from '../services/storage';
import { MentorshipApplication, AlumniCoachApplication } from '../types';
import { useAuth } from '../context/AuthContext';
import { isValidGmail, GMAIL_ERROR_MESSAGE } from '../utils/validation';
import { COACH_IMAGES, getCoachImage } from '../data/coachImages';

export interface CoachProfile {
  id: string;
  name: string;
  role: string;
  specialty: string;
  image: string;
  linkedin: string;
}

export const AVAILABLE_MENTORS: CoachProfile[] = [
  {
    id: 'auto-match',
    name: 'Any Available CIH Coach',
    role: 'Automatic Match',
    specialty: 'CIH will match you with the certified coach best suited to your focus area',
    image: COACH_IMAGES.defaultLogo,
    linkedin: 'https://www.linkedin.com/company/community-innovation-hub'
  },
  {
    id: 'adewale-oseni',
    name: 'Adewale Oseni',
    role: 'Co-Founder & On-Site Coach',
    specialty: 'Cognitive Decision Science, Youth Empowerment & Leadership IKIGAI',
    image: COACH_IMAGES.adewale,
    linkedin: 'https://www.linkedin.com/in/adewalepaul'
  },
  {
    id: 'soji-megbowon',
    name: 'Soji Megbowon',
    role: 'Co-Founder & Lead Facilitator / Coach',
    specialty: 'Interactive Scenario Analysis, Strategic Innovation & Growth',
    image: COACH_IMAGES.soji,
    linkedin: 'https://www.linkedin.com/in/soji-megbowon-50a04269'
  },
  {
    id: 'esther-ajayi',
    name: 'Esther Ajayi',
    role: 'Coach',
    specialty: 'Personal Development, Career Alignment & Purpose Coaching',
    image: COACH_IMAGES.esther,
    linkedin: 'https://www.linkedin.com/in/esther-ajayi-28600a143'
  },
  {
    id: 'kehinde-ajasa',
    name: 'Kehinde Ajasa',
    role: 'Vision Lead & Coach',
    specialty: 'Visionary Leadership, Executive Strategy & Innovation Architecture',
    image: COACH_IMAGES.kehinde,
    linkedin: 'https://www.linkedin.com/in/kehinde-ajasa'
  }
];

export const MentorshipPage: React.FC = () => {
  const { user } = useAuth();

  // Determine if current user is an approved/certified mentor/coach
  const isCertifiedMentor = Boolean(
    user && (
      user.isApprovedMentor ||
      user.mentorRole === 'Coach' ||
      AVAILABLE_MENTORS.some(m => m.name.toLowerCase() === user.fullName?.trim().toLowerCase())
    )
  );

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    focusArea: 'Career Growth & Tech Leadership',
    desiredMentor: 'Any Available CIH Coach (Automatic Match)',
    reasonNeeded: ''
  });

  const [selectedMentorId, setSelectedMentorId] = useState<string>('auto-match');
  const [isMentorPickerOpen, setIsMentorPickerOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mentorshipList, setMentorshipList] = useState<MentorshipApplication[]>([]);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  useEffect(() => {
    setMentorshipList(getStoredMentorshipApplications());
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
      setAlumniForm((prev) => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  // Mode: 'mentee' (seeking guidance) vs 'alumni-coach' (volunteering to coach)
  const [applicationMode, setApplicationMode] = useState<'mentee' | 'alumni-coach'>('mentee');

  // Alumni Coach Application State
  const [alumniForm, setAlumniForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    alumniTrack: 'CIH Graduate / Alumni' as 'CIH Graduate / Alumni' | 'Hub Intern / IT Graduate' | 'Senior Fellow' | 'Industry Professional',
    graduationYear: '2023',
    currentRole: '',
    organization: '',
    linkedinUrl: '',
    coachingDomain: 'Tech & AI / Technical Problem Solving',
    availability: 'Both On-site & Virtual' as 'On-site Wednesdays (Abesan Estate)' | 'Virtual 1-on-1 Breakouts' | 'Both On-site & Virtual',
    statementOfPurpose: ''
  });
  const [alumniSubmitted, setAlumniSubmitted] = useState(false);
  const [alumniLoading, setAlumniLoading] = useState(false);

  // Check URL query params for ?tab=become-coach or ?tab=coach
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'become-coach' || params.get('tab') === 'coach') {
        setApplicationMode('alumni-coach');
      }
    }
  }, []);

  // Calculate current word count
  const getWordCount = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  };

  const currentWordCount = getWordCount(formData.reasonNeeded);
  const isWordCountExceeded = currentWordCount > 500;

  const alumniWordCount = getWordCount(alumniForm.statementOfPurpose);
  const isAlumniWordCountExceeded = alumniWordCount > 500;

  const handleAlumniSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alumniForm.fullName.trim() || !alumniForm.email.trim() || !alumniForm.phone.trim() || !alumniForm.currentRole.trim() || !alumniForm.statementOfPurpose.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    if (!isValidGmail(alumniForm.email)) {
      alert(GMAIL_ERROR_MESSAGE);
      return;
    }

    if (isAlumniWordCountExceeded) {
      alert('Please keep your response within the 500 word limit.');
      return;
    }

    setAlumniLoading(true);

    const newApp: AlumniCoachApplication = {
      id: `alumni-coach-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fullName: alumniForm.fullName.trim(),
      email: alumniForm.email.trim().toLowerCase(),
      phone: alumniForm.phone.trim(),
      alumniTrack: alumniForm.alumniTrack,
      graduationYear: alumniForm.graduationYear.trim(),
      currentRole: alumniForm.currentRole.trim(),
      organization: alumniForm.organization.trim(),
      linkedinUrl: alumniForm.linkedinUrl.trim(),
      coachingDomain: alumniForm.coachingDomain,
      availability: alumniForm.availability,
      statementOfPurpose: alumniForm.statementOfPurpose.trim(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    const existing = getStoredAlumniCoachApplications();
    const updated = [newApp, ...existing];
    saveStoredAlumniCoachApplications(updated);

    // Sync to Google Apps Script if URL configured
    const config = getAdminConfig();
    if (config.appsScriptUrl && config.appsScriptUrl.trim().startsWith('http')) {
      try {
        await fetch(config.appsScriptUrl.trim(), {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            source: 'CIH Alumni Coach Application',
            type: 'alumni_coach_application',
            ...newApp
          })
        });
      } catch (err) {
        console.error('Error syncing alumni application to webhook', err);
      }
    }

    setAlumniLoading(false);
    setAlumniSubmitted(true);
  };

  const handleSelectMentor = (mentor: CoachProfile) => {
    setSelectedMentorId(mentor.id);
    setFormData((prev) => ({
      ...prev,
      desiredMentor: mentor.id === 'auto-match' ? 'Any Available CIH Coach (Automatic Match)' : `${mentor.name} (${mentor.role})`
    }));
    setIsMentorPickerOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.reasonNeeded.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    if (!isValidGmail(formData.email)) {
      alert(GMAIL_ERROR_MESSAGE);
      return;
    }

    if (isWordCountExceeded) {
      alert('Please keep your response within the 500 word limit.');
      return;
    }

    setLoading(true);

    const now = Date.now();
    const startDate = new Date(now).toISOString();
    const endDate = new Date(now + 90 * 86400000).toISOString(); // Strictly 3-Month Term

    const newApp: MentorshipApplication = {
      id: `ment-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      focusArea: formData.focusArea,
      desiredMentor: formData.desiredMentor,
      reasonNeeded: formData.reasonNeeded.trim(),
      createdAt: startDate,
      cohortStartDate: startDate,
      cohortEndDate: endDate,
      status: 'pending' // Rule 23: All status starts as pending
    };

    // Save locally
    const existing = getStoredMentorshipApplications();
    const updated = [newApp, ...existing];
    saveStoredMentorshipApplications(updated);
    setMentorshipList(updated);

    // Send to Google Apps Script if URL is configured
    const config = getAdminConfig();
    if (config.appsScriptUrl && config.appsScriptUrl.trim().startsWith('http')) {
      try {
        await fetch(config.appsScriptUrl.trim(), {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            fullName: newApp.fullName,
            email: newApp.email,
            phone: newApp.phone,
            attendeeType: `Mentorship: ${newApp.focusArea}`,
            desiredMentor: newApp.desiredMentor,
            timestamp: newApp.createdAt,
            notes: `[Desired Coach: ${newApp.desiredMentor}] ${newApp.reasonNeeded}`,
            source: 'Mentorship Application'
          }),
          mode: 'no-cors'
        });
      } catch (err) {
        console.warn('Could not post mentorship app to Apps Script:', err);
      }
    }

    setLoading(false);
    setSubmitted(true);
  };

  // Handlers for certified coach accepting/declining students
  const handleCoachDecision = (appId: string, newStatus: 'accepted' | 'declined') => {
    const updated = mentorshipList.map((app) => {
      if (app.id === appId) {
        const now = Date.now();
        return {
          ...app,
          status: newStatus,
          cohortStartDate: app.cohortStartDate || new Date(now).toISOString(),
          cohortEndDate: app.cohortEndDate || new Date(now + 90 * 86400000).toISOString()
        };
      }
      return app;
    });
    setMentorshipList(updated);
    saveStoredMentorshipApplications(updated);
    setStatusFeedback(`Mentee application marked as ${newStatus}.`);
    setTimeout(() => setStatusFeedback(null), 3500);
  };

  const activeMentor = AVAILABLE_MENTORS.find((m) => m.id === selectedMentorId) || AVAILABLE_MENTORS[0];

  // For certified mentor, filter applications for them (or general if co-founder)
  const coachApplicantList = isCertifiedMentor
    ? mentorshipList.filter((a) => {
        if (!user) return true;
        const coachNameLower = user.fullName.toLowerCase();
        const desiredLower = (a.desiredMentor || '').toLowerCase();
        return (
          desiredLower.includes(coachNameLower) ||
          desiredLower.includes('auto') ||
          desiredLower.includes('any') ||
          user.fullName.includes('Adewale') ||
          user.fullName.includes('Soji')
        );
      })
    : [];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Header */}
      <section className="relative bg-navy-950 text-white py-20 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-navy-800">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/images/cih-photo-9.jpg"
            alt="CIH Personal Mentorship"
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-950/60 to-navy-950/90" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/20 border border-brand-orange/40 text-xs font-extrabold text-brand-orange uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-on-1 Personal Coaching &amp; Mentorship</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase leading-tight">
            Personal Mentorship Program
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Get matched with certified CIH coaches and industry veterans for tailored 1-on-1 guidance, career clarity, and executive development.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-slate-200 border border-white/10">
              <span>Target Audience: Age 14 and Above</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold">
              <Clock className="w-3.5 h-3.5" />
              <span>3-Month Cohort Term Cycle</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Month Cohort Deadline Notice Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-30">
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-300 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-brand-orange flex items-center justify-center shrink-0 shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold uppercase tracking-wider text-amber-900 text-xs sm:text-sm">
                  Mentorship Form Deadline &amp; 3-Month Term Policy
                </span>
                <span className="px-2 py-0.5 rounded bg-brand-orange text-white text-[10px] font-bold">Strict 3 Months</span>
              </div>
              <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                Each mentorship cohort officially lasts <strong>strictly 3 months</strong> from the match start date. CIH oversight and facilitation conclude at 90 days. Applications for the upcoming quarter are accepted on a rolling basis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Benefits & Available Coaches */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6">
              <h2 className="text-2xl font-extrabold text-navy-900 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-brand-orange" />
                <span>Why Personal Coaching?</span>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Wednesday plenary case studies build foundational analytical skills, while 1-on-1 personal coaching addresses your specific career roadblocks, personal goals, and 90-day execution milestones.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  {
                    icon: Target,
                    title: '90-Day Personal Blueprint',
                    desc: 'A structured 3-month cycle designed around concrete milestones and personal accountability.'
                  },
                  {
                    icon: Lightbulb,
                    title: 'Decision Science Frameworks',
                    desc: 'Evaluate high-stakes career pivots, project architecture, and leadership challenges with your coach.'
                  },
                  {
                    icon: Users,
                    title: 'Direct Coach Access',
                    desc: 'Regular 1-on-1 sparring sessions with experienced directors across Tech, Entrepreneurship, and Leadership.'
                  }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-navy-900 text-white flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-brand-orange" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-navy-900">{item.title}</h4>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coach Roster Preview with LinkedIn Hyperlinks */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Certified CIH Coaches
                  </h4>
                  <span className="text-[10px] font-semibold text-slate-400">Click name for LinkedIn profile</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AVAILABLE_MENTORS.filter((m) => m.id !== 'auto-match').map((mentor) => (
                    <div
                      key={mentor.id}
                      onClick={() => handleSelectMentor(mentor)}
                      className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                        selectedMentorId === mentor.id
                          ? 'border-brand-orange bg-brand-orange/5 shadow-sm ring-1 ring-brand-orange'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <img
                        src={mentor.image}
                        alt={mentor.name}
                        className="w-12 h-12 rounded-xl object-cover object-top shrink-0 border border-slate-200 shadow-xs"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getCoachImage(mentor.name);
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <a
                          href={mentor.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-bold text-navy-900 hover:text-brand-orange hover:underline transition-colors truncate flex items-center gap-1"
                          title={`Open ${mentor.name}'s LinkedIn profile`}
                        >
                          <span className="truncate">{mentor.name}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                        </a>
                        <p className="text-[10px] text-brand-orange font-semibold truncate">{mentor.role}</p>
                        <p className="text-[10px] text-slate-500 truncate">{mentor.specialty}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-brand-orange uppercase">Eligibility &amp; Term Note:</span>
                <p>Open to all committed individuals aged <strong>14 and above</strong>. Each mentorship cohort concludes 3 months after commencement.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Form OR Certified Coach Mentorship Desk */}
          <div className="lg:col-span-7">
            {isCertifiedMentor ? (
              /* ============================================================ */
              /* ITEM 13: CERTIFIED COACH DASHBOARD (NO APPLY FORM FOR COACHES) */
              /* ============================================================ */
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6 animate-fade-in">
                {/* Header Ribbon */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-orange text-white flex items-center justify-center font-extrabold text-lg shadow-md border-2 border-white/20 shrink-0">
                      {user?.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-brand-orange/20 text-brand-orange border border-brand-orange/30 text-[10px] font-extrabold uppercase tracking-wider">
                          Certified Coach
                        </span>
                        <Award className="w-4 h-4 text-brand-orange" />
                      </div>
                      <h2 className="text-xl font-extrabold text-white">
                        Coach {user?.fullName} Mentorship Desk
                      </h2>
                      <p className="text-xs text-slate-300">
                        Review, accept, or decline student applicants requesting your 1-on-1 mentorship.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feedback Toast */}
                {statusFeedback && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{statusFeedback}</span>
                  </div>
                )}

                {/* Metric Badges */}
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Applicants</span>
                    <span className="text-xl font-extrabold text-navy-900">{coachApplicantList.length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Pending Review</span>
                    <span className="text-xl font-extrabold text-amber-700">
                      {coachApplicantList.filter((a) => a.status === 'pending').length}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Accepted Mentees</span>
                    <span className="text-xl font-extrabold text-emerald-700">
                      {coachApplicantList.filter((a) => a.status === 'accepted').length}
                    </span>
                  </div>
                </div>

                {/* Student Applicants Roster */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-extrabold text-navy-900 uppercase tracking-wider">
                      Student Applications ({coachApplicantList.length})
                    </h3>
                    <span className="text-xs text-slate-400">3-Month Term Cohort</span>
                  </div>

                  {coachApplicantList.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-500">
                      No student applications submitted for your mentorship yet. New applications will appear here automatically.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {coachApplicantList.map((app) => (
                        <div
                          key={app.id}
                          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3.5 hover:border-slate-300 transition-colors"
                        >
                          {/* Student Info Bar */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-extrabold text-navy-900">{app.fullName}</h4>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  app.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                                  app.status === 'declined' ? 'bg-rose-100 text-rose-800' :
                                  'bg-amber-100 text-amber-800'
                                }`}>
                                  {app.status === 'pending' ? 'Pending Review' : app.status}
                                </span>
                              </div>
                              <p className="text-xs text-brand-orange font-semibold mt-0.5">
                                Focus: {app.focusArea || 'General Mentorship'}
                              </p>
                            </div>
                            <div className="text-[11px] text-slate-400 text-left sm:text-right">
                              <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                              <p className="text-[10px] text-slate-500 font-semibold">Cohort: 3 Months Cycle</p>
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <a href={`mailto:${app.email}`} className="text-brand-orange hover:underline truncate">
                                {app.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <a href={`tel:${app.phone}`} className="text-slate-800 font-semibold hover:underline">
                                {app.phone}
                              </a>
                            </div>
                          </div>

                          {/* Essay / Statement */}
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800 space-y-1">
                            <span className="font-bold text-navy-900 block text-[11px]">
                              Mentee's Goals &amp; Needs Essay:
                            </span>
                            <p className="leading-relaxed italic text-slate-700">
                              "{app.reasonNeeded}"
                            </p>
                          </div>

                          {/* Action Buttons for Coach */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="text-[11px] text-slate-400 font-semibold">
                              Desired: <strong className="text-navy-900">{app.desiredMentor || 'Any Available Coach'}</strong>
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleCoachDecision(app.id, 'declined')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                                  app.status === 'declined'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700'
                                }`}
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Decline</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCoachDecision(app.id, 'accepted')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 ${
                                  app.status === 'accepted'
                                    ? 'bg-emerald-700 text-white'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{app.status === 'accepted' ? 'Accepted (3-Mo Term)' : 'Accept Mentee'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* ============================================================ */
              /* DUAL APPLICATION PATHWAY: MENTEE vs ALUMNI COACH */
              /* ============================================================ */
              <div className="space-y-6">
                {/* Pathway Switcher Tabs */}
                <div className="flex p-1.5 bg-slate-100/90 rounded-2xl max-w-xl mx-auto border border-slate-200 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setApplicationMode('mentee')}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      applicationMode === 'mentee'
                        ? 'bg-white text-navy-900 shadow-md ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-navy-900'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-brand-orange" />
                    <span>Apply for Mentorship (Mentee)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setApplicationMode('alumni-coach')}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      applicationMode === 'alumni-coach'
                        ? 'bg-brand-orange text-white shadow-md'
                        : 'text-slate-600 hover:text-navy-900'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Volunteer as Coach (Alumni)</span>
                  </button>
                </div>

                {/* 1. MENTEE APPLICATION FORM */}
                {applicationMode === 'mentee' && (
                  <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl">
                    {submitted ? (
                      <div className="text-center py-12 space-y-6 animate-fade-in">
                        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                          <CheckCircle2 className="w-10 h-10" />
                        </div>

                        <div className="space-y-2">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold uppercase tracking-wider">
                            <Clock className="w-3.5 h-3.5 text-brand-orange" /> Application Under Review
                          </span>
                          <h2 className="text-3xl font-extrabold text-navy-900">Application Submitted!</h2>
                        </div>
                        
                        <p className="text-slate-600 text-base max-w-md mx-auto leading-relaxed">
                          Thank you, <strong>{formData.fullName}</strong>. Your mentorship request with preferred coach (<strong>{formData.desiredMentor}</strong>) has been recorded for the upcoming <strong>3-Month Cohort</strong>. A CIH coach coordinator will review your profile and contact you via your Gmail (<strong>{formData.email}</strong>).
                        </p>

                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-1 text-slate-600">
                          <p className="font-bold text-navy-900">What Happens Next?</p>
                          <p>• Coaches evaluate applications on a rolling basis against our 3-month curriculum.</p>
                          <p>• Shortlisted candidates receive an onboarding calendar invite.</p>
                        </div>

                        <div className="pt-4 flex justify-center">
                          <button
                            onClick={() => {
                              setSubmitted(false);
                              setFormData({
                                fullName: '',
                                email: '',
                                phone: '',
                                focusArea: 'Career Growth & Tech Leadership',
                                desiredMentor: 'Any Available CIH Coach (Automatic Match)',
                                reasonNeeded: ''
                              });
                              setSelectedMentorId('auto-match');
                            }}
                            className="px-6 py-3 rounded-xl bg-navy-900 text-white text-sm font-bold hover:bg-navy-800 transition-colors"
                          >
                            Submit Another Application
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-50 text-navy-900 text-xs font-bold uppercase tracking-wider mb-2">
                        <UserCheck className="w-3.5 h-3.5 text-brand-orange" />
                        Mentorship Form • 3-Month Term
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                        Apply for Personal Mentorship
                      </h2>
                      <p className="text-slate-500 text-sm mt-1">
                        Tell us about yourself and what you hope to achieve during the 3-month coaching cycle.
                      </p>
                    </div>

                    {/* Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Samuel Okafor"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-900 text-sm font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                          Gmail Address <span className="text-brand-orange font-normal text-[10px]">(@gmail.com strictly required)</span> <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. samuel@gmail.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-900 text-sm font-medium"
                        />
                      </div>
                    </div>

                    {/* Phone & Primary Focus Area */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                          Phone / WhatsApp Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+234 800 000 0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-900 text-sm font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                          Primary Focus Area
                        </label>
                        <select
                          value={formData.focusArea}
                          onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-900 text-sm font-medium bg-white"
                        >
                          <option value="Career Growth & Tech Leadership">Career Growth & Tech Leadership</option>
                          <option value="Personal Growth, EQ & Mindset">Personal Growth, EQ & Mindset</option>
                          <option value="Financial Literacy & Wealth Building">Financial Literacy & Wealth Building</option>
                          <option value="Public Speaking & Executive Presence">Public Speaking & Executive Presence</option>
                          <option value="Ethics & Decision Architecture">Ethics & Decision Architecture</option>
                        </select>
                      </div>
                    </div>

                    {/* DESIRED COACH Selector */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                        Desired Coach
                      </label>
                      <div className="space-y-3">
                        {/* Active Coach Trigger Button */}
                        <div className="w-full p-3.5 rounded-xl border border-slate-300 hover:border-brand-orange bg-slate-50/70 hover:bg-slate-50 transition-all flex items-center justify-between gap-3 text-left">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={activeMentor.image}
                              alt={activeMentor.name}
                              className="w-12 h-12 rounded-xl object-cover object-top shrink-0 border border-slate-200 bg-white shadow-xs"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = getCoachImage(activeMentor.name);
                              }}
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                {activeMentor.linkedin ? (
                                  <a
                                    href={activeMentor.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-sm font-bold text-navy-900 hover:text-brand-orange hover:underline transition-colors flex items-center gap-1 truncate"
                                    title={`Open ${activeMentor.name}'s LinkedIn profile`}
                                  >
                                    <span className="truncate">{activeMentor.name}</span>
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  </a>
                                ) : (
                                  <p className="text-sm font-bold text-navy-900 truncate">{activeMentor.name}</p>
                                )}
                              </div>
                              <p className="text-xs text-brand-orange font-semibold truncate">
                                {activeMentor.role}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsMentorPickerOpen(!isMentorPickerOpen)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-brand-orange text-xs font-bold text-brand-orange shrink-0 shadow-2xs"
                          >
                            <span>{isMentorPickerOpen ? 'Close Roster' : 'Change Coach'}</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isMentorPickerOpen ? 'rotate-180' : ''}`} />
                          </button>
                        </div>

                        {/* Expandable Coach Selection Roster */}
                        {isMentorPickerOpen && (
                          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 animate-fade-in">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
                              Select an available coach or choose Auto-Match:
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                              {AVAILABLE_MENTORS.map((mentor) => {
                                const isSelected = selectedMentorId === mentor.id;
                                return (
                                  <div
                                    key={mentor.id}
                                    onClick={() => handleSelectMentor(mentor)}
                                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                                      isSelected
                                        ? 'border-brand-orange bg-white shadow-sm ring-2 ring-brand-orange/40'
                                        : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
                                    }`}
                                  >
                                    <img
                                      src={mentor.image}
                                      alt={mentor.name}
                                      className="w-12 h-12 rounded-xl object-cover object-top shrink-0 border border-slate-200 mt-0.5 shadow-xs"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = getCoachImage(mentor.name);
                                      }}
                                    />
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center justify-between gap-1">
                                        <a
                                          href={mentor.linkedin}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="text-xs font-bold text-navy-900 hover:text-brand-orange hover:underline truncate block"
                                        >
                                          {mentor.name} ↗
                                        </a>
                                        {isSelected && <Check className="w-3.5 h-3.5 text-brand-orange shrink-0" />}
                                      </div>
                                      <p className="text-[11px] font-semibold text-brand-orange truncate">{mentor.role}</p>
                                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{mentor.specialty}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Why & What do you need mentorship for? (With 500 word limit) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider">
                          Why &amp; What do you need mentorship for? <span className="text-rose-500">*</span>
                        </label>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                            isWordCountExceeded
                              ? 'bg-rose-100 text-rose-700 font-extrabold'
                              : currentWordCount >= 450
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {currentWordCount} / 500 words
                        </span>
                      </div>
                      <textarea
                        required
                        rows={5}
                        placeholder="Share your current challenges, career goals, or what specific guidance you are seeking from your coach during this 3-month cohort (max 500 words)..."
                        value={formData.reasonNeeded}
                        onChange={(e) => setFormData({ ...formData, reasonNeeded: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-xl border text-slate-900 text-sm font-medium resize-none transition-all ${
                          isWordCountExceeded
                            ? 'border-rose-400 focus:ring-2 focus:ring-rose-400 focus:outline-none bg-rose-50/20'
                            : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange'
                        }`}
                      />
                      {isWordCountExceeded ? (
                        <p className="text-xs font-bold text-rose-600 mt-1">
                          ⚠️ Your statement exceeds the 500 word limit ({currentWordCount} words). Please condense your response to submit.
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400 mt-1">
                          Maximum 500 words. Please be specific about your expectations for the 3-month period.
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading || isWordCountExceeded}
                      className="w-full py-4 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-base font-bold shadow-lg hover:shadow-orange-glow transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span>Submitting Application...</span>
                      ) : (
                        <>
                          <span>Submit Mentorship Application (3-Month Term)</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* 2. ALUMNI COACH APPLICATION FORM */}
            {applicationMode === 'alumni-coach' && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl">
                {alumniSubmitted ? (
                  <div className="text-center py-12 space-y-6 animate-fade-in">
                    <div className="w-20 h-20 rounded-full bg-orange-100 text-brand-orange flex items-center justify-center mx-auto shadow-inner">
                      <Award className="w-10 h-10" />
                    </div>

                    <div className="space-y-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Application Received by CIH Management
                      </span>
                      <h2 className="text-3xl font-extrabold text-navy-900">Thank You for Stepping Up to Coach!</h2>
                    </div>

                    <p className="text-slate-600 text-base max-w-md mx-auto leading-relaxed">
                      We appreciate your commitment to give back to the Community Innovation Hub, <strong>{alumniForm.fullName}</strong>. Your coach application has been queued for executive board review. CIH Management will review your background in <strong>{alumniForm.coachingDomain}</strong> and reach out to you via your Gmail (<strong>{alumniForm.email}</strong>) and WhatsApp (<strong>{alumniForm.phone}</strong>) for coach orientation.
                    </p>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-1 text-slate-600">
                      <p className="font-bold text-navy-900">Next Steps for Prospective Coaches:</p>
                      <p>• Lead Coaching Board (Coach Adewale, Coach Soji, Coach Esther &amp; Coach Kehinde) review your profile and experience.</p>
                      <p>• You will be invited to shadow an upcoming Wednesday Case Study session.</p>
                      <p>• Upon approval, your coach profile and certified badge will be activated on the platform.</p>
                    </div>

                    <div className="pt-4 flex justify-center">
                      <button
                        onClick={() => {
                          setAlumniSubmitted(false);
                          setAlumniForm({
                            fullName: user?.fullName || '',
                            email: user?.email || '',
                            phone: user?.phone || '',
                            alumniTrack: 'CIH Graduate / Alumni',
                            graduationYear: '2023',
                            currentRole: '',
                            organization: '',
                            linkedinUrl: '',
                            coachingDomain: 'Tech & AI / Technical Problem Solving',
                            availability: 'Both On-site & Virtual',
                            statementOfPurpose: ''
                          });
                        }}
                        className="px-6 py-3 rounded-xl bg-navy-900 text-white text-sm font-bold hover:bg-navy-800 transition-colors"
                      >
                        Submit Another Application
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAlumniSubmit} className="space-y-6">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-brand-orange text-xs font-bold uppercase tracking-wider mb-2 border border-orange-200">
                        <Award className="w-3.5 h-3.5" />
                        CIH Alumni &amp; Leaders • Volunteer as a Case Study Coach
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                        Apply to Become a Certified Coach / Mentor
                      </h2>
                      <p className="text-slate-500 text-sm mt-1">
                        Empower the next generation at Community Innovation Hub. Facilitate syndicate breakout pods, challenge scenario presentations, and share authentic career frameworks during weekly Wednesday Case Studies.
                      </p>
                    </div>

                    {/* Name & Gmail */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Oluwaseun Balogun"
                          value={alumniForm.fullName}
                          onChange={(e) => setAlumniForm({ ...alumniForm, fullName: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-900 text-sm font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                          Gmail Address <span className="text-brand-orange font-normal text-[10px]">(@gmail.com strictly required)</span> <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. seun.tech@gmail.com"
                          value={alumniForm.email}
                          onChange={(e) => setAlumniForm({ ...alumniForm, email: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-900 text-sm font-medium"
                        />
                      </div>
                    </div>

                    {/* Phone & Alumni Track */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                          Phone / WhatsApp Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+234 800 000 0000"
                          value={alumniForm.phone}
                          onChange={(e) => setAlumniForm({ ...alumniForm, phone: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-900 text-sm font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                          CIH Relationship / Track <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={alumniForm.alumniTrack}
                          onChange={(e) => setAlumniForm({ ...alumniForm, alumniTrack: e.target.value as any })}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-900 text-sm font-medium bg-white"
                        >
                          <option value="CIH Graduate / Alumni">CIH Graduate / Alumni</option>
                          <option value="Hub Intern / IT Graduate">Hub Intern / IT Graduate</option>
                          <option value="Senior Fellow">Senior Fellow</option>
                          <option value="Industry Professional">Industry Professional / External Partner</option>
                        </select>
                      </div>
                    </div>

                    {/* Graduation Year & Current Professional Role */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                          Cohort / Graduation Year
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 2023 or 2024"
                          value={alumniForm.graduationYear}
                          onChange={(e) => setAlumniForm({ ...alumniForm, graduationYear: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-900 text-sm font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                          Current Professional Role &amp; Company <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Senior Frontend Engineer at Flutterwave"
                          value={alumniForm.currentRole}
                          onChange={(e) => setAlumniForm({ ...alumniForm, currentRole: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-900 text-sm font-medium"
                        />
                      </div>
                    </div>

                    {/* LinkedIn & Coaching Domain */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                          LinkedIn Profile or Portfolio URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/your-profile"
                          value={alumniForm.linkedinUrl}
                          onChange={(e) => setAlumniForm({ ...alumniForm, linkedinUrl: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-900 text-sm font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                          Primary Coaching Domain Focus <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={alumniForm.coachingDomain}
                          onChange={(e) => setAlumniForm({ ...alumniForm, coachingDomain: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-900 text-sm font-medium bg-white"
                        >
                          <option value="Tech &amp; AI / Technical Problem Solving">Tech &amp; AI / Technical Problem Solving</option>
                          <option value="Ethics &amp; Adaptive Governance">Ethics &amp; Adaptive Governance</option>
                          <option value="Career Transition &amp; Job Search">Career Transition &amp; Job Search</option>
                          <option value="Cognitive Mindset, EQ &amp; Life Skills">Cognitive Mindset, EQ &amp; Life Skills</option>
                          <option value="Public Speaking, Pitching &amp; Elevator Hook">Public Speaking, Pitching &amp; Elevator Hook</option>
                        </select>
                      </div>
                    </div>

                    {/* Coaching Format Availability */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                        Coaching Availability <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={alumniForm.availability}
                        onChange={(e) => setAlumniForm({ ...alumniForm, availability: e.target.value as any })}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-900 text-sm font-medium bg-white"
                      >
                        <option value="Both On-site &amp; Virtual">Both On-site Wednesdays &amp; Virtual 1-on-1s</option>
                        <option value="On-site Wednesdays (Abesan Estate)">On-site Wednesdays (Plot 104, 5th Avenue Abesan Estate)</option>
                        <option value="Virtual 1-on-1 Breakouts">Virtual 1-on-1 Breakout Pods</option>
                      </select>
                    </div>

                    {/* Statement of Purpose */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider">
                          Statement of Purpose &amp; Coaching Philosophy <span className="text-rose-500">*</span>
                        </label>
                        <span className={`text-xs font-bold ${
                          isAlumniWordCountExceeded ? 'text-rose-600' : alumniWordCount > 450 ? 'text-amber-600' : 'text-slate-400'
                        }`}>
                          {alumniWordCount} / 500 words
                        </span>
                      </div>
                      <textarea
                        required
                        rows={5}
                        placeholder="Why do you want to coach during Wednesday Case Studies? What industry experience, frameworks, or leadership lessons do you want to impart to young innovators and IT interns?"
                        value={alumniForm.statementOfPurpose}
                        onChange={(e) => setAlumniForm({ ...alumniForm, statementOfPurpose: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-xl border text-slate-900 text-sm font-medium resize-none transition-all ${
                          isAlumniWordCountExceeded
                            ? 'border-rose-400 focus:ring-2 focus:ring-rose-400 focus:outline-none bg-rose-50/20'
                            : 'border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange'
                        }`}
                      />
                      {isAlumniWordCountExceeded ? (
                        <p className="text-xs font-bold text-rose-600 mt-1">
                          ⚠️ Your statement exceeds the 500 word limit ({alumniWordCount} words). Please condense your response to submit.
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400 mt-1">
                          Maximum 500 words. Describe the specific impact and guidance you hope to deliver as a coach.
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={alumniLoading || isAlumniWordCountExceeded}
                      className="w-full py-4 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-base font-bold shadow-lg hover:shadow-orange-glow transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {alumniLoading ? (
                        <span>Submitting Coach Application...</span>
                      ) : (
                        <>
                          <span>Submit Coach Application to CIH Management</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </section>
  </div>
);
};

export default MentorshipPage;
