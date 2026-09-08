import React, { useState, useEffect, useMemo } from 'react';
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
  Building2,
  Search,
  Filter,
  FileText,
  MessageCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import { 
  getStoredMentorshipApplications, 
  saveStoredMentorshipApplications, 
  getStoredAlumniCoachApplications, 
  saveStoredAlumniCoachApplications, 
  getAdminConfig,
  getStoredUsers
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

  // Load stored applications
  const [mentorshipList, setMentorshipList] = useState<MentorshipApplication[]>([]);
  const [storedAlumniCoaches, setStoredAlumniCoaches] = useState<AlumniCoachApplication[]>([]);

  useEffect(() => {
    setMentorshipList(getStoredMentorshipApplications());
    setStoredAlumniCoaches(getStoredAlumniCoachApplications().filter(a => a.status === 'accepted'));
  }, []);

  // Verification logic: Check if viewer is an accepted mentor / verified coach
  const isApprovedAlumniCoach = Boolean(
    user && storedAlumniCoaches.some(a => 
      (a.email && user.email && a.email.toLowerCase().trim() === user.email.toLowerCase().trim()) ||
      (a.fullName && user.fullName && a.fullName.toLowerCase().trim() === user.fullName.toLowerCase().trim())
    )
  );

  const isFoundationCoach = Boolean(
    user && AVAILABLE_MENTORS.some(m => m.name.toLowerCase() === user.fullName?.trim().toLowerCase())
  );

  const isUserCertifiedCoach = Boolean(
    user && (
      user.isApprovedMentor ||
      user.mentorRole === 'Coach' ||
      isFoundationCoach ||
      isApprovedAlumniCoach
    )
  );

  // Simulation mode for testing / demoing coach desk immediately
  const [simulatedCoachName, setSimulatedCoachName] = useState<string | null>(null);
  
  // Effective coach state
  const isCertifiedMentor = isUserCertifiedCoach || Boolean(simulatedCoachName);
  const activeCoachName = simulatedCoachName || user?.fullName || 'Certified CIH Coach';

  // Toggle between personalized Coach Desk and Previewing Public Mentee View
  const [coachViewMode, setCoachViewMode] = useState<'desk' | 'public-preview'>('desk');

  // Dynamic coach list including newly accepted alumni
  const allCoachesList: CoachProfile[] = useMemo(() => {
    const dynamicAlumni: CoachProfile[] = storedAlumniCoaches.map(a => ({
      id: `alumni-${a.id}`,
      name: a.fullName,
      role: a.currentRole ? `${a.currentRole} • CIH Coach` : 'CIH Certified Coach',
      specialty: a.coachingDomain || 'Strategy & Executive Execution',
      image: COACH_IMAGES.defaultLogo,
      linkedin: a.linkedinUrl || 'https://www.linkedin.com/company/community-innovation-hub'
    }));
    return [...AVAILABLE_MENTORS, ...dynamicAlumni];
  }, [storedAlumniCoaches]);

  // Coach Mentorship Desk Filters
  const [coachQueueTab, setCoachQueueTab] = useState<'direct' | 'auto-match' | 'all'>('direct');
  const [coachStatusFilter, setCoachStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('pending');
  const [menteeSearchQuery, setMenteeSearchQuery] = useState('');
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  // Student Application Form State (Public View)
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

  useEffect(() => {
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

  // Check URL query params for ?tab=become-coach or ?coach=
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'become-coach' || params.get('tab') === 'coach') {
        setApplicationMode('alumni-coach');
      }
      const coachParam = params.get('as');
      if (coachParam) {
        setSimulatedCoachName(coachParam);
      }
    }
  }, []);

  // Calculate current word count helper
  const getWordCount = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  };

  const currentWordCount = getWordCount(formData.reasonNeeded);
  const isWordCountExceeded = currentWordCount > 500;

  const alumniWordCount = getWordCount(alumniForm.statementOfPurpose);
  const isAlumniWordCountExceeded = alumniWordCount > 500;

  // Coach Decision Handler (Accept / Decline / Pending)
  const handleCoachDecision = (appId: string, newStatus: 'accepted' | 'declined' | 'pending') => {
    const now = Date.now();
    const updated = mentorshipList.map((app) => {
      if (app.id === appId) {
        return {
          ...app,
          status: newStatus,
          desiredMentor: newStatus === 'accepted' ? `Coach ${activeCoachName}` : app.desiredMentor,
          cohortStartDate: app.cohortStartDate || new Date(now).toISOString(),
          cohortEndDate: app.cohortEndDate || new Date(now + 90 * 86400000).toISOString()
        };
      }
      return app;
    });
    setMentorshipList(updated);
    saveStoredMentorshipApplications(updated);
    setStatusFeedback(
      newStatus === 'accepted' 
        ? `Mentee accepted! Assigned to Coach ${activeCoachName} for the 3-Month Term.`
        : newStatus === 'declined'
        ? `Application declined.`
        : `Application reset to pending review.`
    );
    setTimeout(() => setStatusFeedback(null), 4000);
  };

  // Student Application Submit
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
    const endDate = new Date(now + 90 * 86400000).toISOString();

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
      status: 'pending'
    };

    const existing = getStoredMentorshipApplications();
    const updated = [newApp, ...existing];
    saveStoredMentorshipApplications(updated);
    setMentorshipList(updated);

    const config = getAdminConfig();
    if (config.appsScriptUrl && config.appsScriptUrl.trim().startsWith('http')) {
      try {
        await fetch(config.appsScriptUrl.trim(), {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'submitMentorship',
            ...newApp
          })
        });
      } catch (err) {
        console.error('Google Sheets sync notice:', err);
      }
    }

    setLoading(false);
    setSubmitted(true);
  };

  // Alumni Coach Application Submit
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
      graduationYear: alumniForm.graduationYear,
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

    const config = getAdminConfig();
    if (config.appsScriptUrl && config.appsScriptUrl.trim().startsWith('http')) {
      try {
        await fetch(config.appsScriptUrl.trim(), {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'submitAlumniCoachApplication',
            ...newApp
          })
        });
      } catch (err) {
        console.error('Apps Script dispatch notice:', err);
      }
    }

    setAlumniLoading(false);
    setAlumniSubmitted(true);
  };

  const activeMentor = allCoachesList.find((m) => m.id === selectedMentorId) || allCoachesList[0];

  // Coach Queues Filtering
  const directApplicants = useMemo(() => {
    const coachLower = activeCoachName.toLowerCase();
    return mentorshipList.filter((a) => {
      const desired = (a.desiredMentor || '').toLowerCase();
      return (
        desired.includes(coachLower) ||
        (coachLower.includes('adewale') && desired.includes('adewale')) ||
        (coachLower.includes('soji') && desired.includes('soji')) ||
        (coachLower.includes('esther') && desired.includes('esther')) ||
        (coachLower.includes('kehinde') && desired.includes('kehinde')) ||
        (coachLower.includes('amina') && desired.includes('amina'))
      );
    });
  }, [mentorshipList, activeCoachName]);

  const autoMatchApplicants = useMemo(() => {
    return mentorshipList.filter((a) => {
      const desired = (a.desiredMentor || '').toLowerCase();
      return desired.includes('auto') || desired.includes('any') || !a.desiredMentor;
    });
  }, [mentorshipList]);

  // Active queue based on coach tab
  const currentQueue = useMemo(() => {
    if (coachQueueTab === 'direct') return directApplicants;
    if (coachQueueTab === 'auto-match') return autoMatchApplicants;
    return mentorshipList;
  }, [coachQueueTab, directApplicants, autoMatchApplicants, mentorshipList]);

  // Filtered coach applicant roster
  const filteredCoachApplicants = useMemo(() => {
    return currentQueue.filter((a) => {
      const matchesStatus = coachStatusFilter === 'all' || (a.status || 'pending') === coachStatusFilter;
      const q = menteeSearchQuery.trim().toLowerCase();
      const matchesSearch = !q || 
        a.fullName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.focusArea || '').toLowerCase().includes(q) ||
        a.reasonNeeded.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [currentQueue, coachStatusFilter, menteeSearchQuery]);

  // Coach avatar image
  const coachAvatarImg = getCoachImage(activeCoachName);

  // =========================================================================
  // VIEW A: PERSONALIZED COACH MENTORSHIP DESK (FOR ACCEPTED/VERIFIED COACHES)
  // (NO APPLICATION FORMS SHOWN - FULL APPLICANT ESSAYS & DECISION CONTROLS)
  // =========================================================================
  if (isCertifiedMentor && coachViewMode === 'desk') {
    return (
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Coach Dedicated Hero Header */}
        <section className="relative bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-navy-800 shadow-xl overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-brand-orange/30 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
              <div className="relative shrink-0">
                <img
                  src={coachAvatarImg}
                  alt={activeCoachName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover object-top border-3 border-brand-orange shadow-lg ring-4 ring-white/10"
                />
                <span className="absolute -bottom-2 -right-2 bg-brand-orange text-white p-1.5 rounded-xl shadow-md border-2 border-navy-950" title="Certified CIH Coach">
                  <Award className="w-4 h-4" />
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-orange/20 text-brand-orange border border-brand-orange/40 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Certified Coach Portal
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-[11px] font-semibold">
                    Strict 3-Month Cycle
                  </span>
                </div>
                
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Coach {activeCoachName} Mentorship Desk
                </h1>
                
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Review student candidates who have applied for 1-on-1 mentorship under you. Evaluate their background and essays to accept or decline applicants for the 3-Month Term.
                </p>
              </div>
            </div>

            {/* Quick Actions & Public Switcher */}
            <div className="flex flex-wrap items-center gap-3 pt-2 md:pt-0">
              <button
                type="button"
                onClick={() => setCoachViewMode('public-preview')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-2 shadow-sm"
                title="Preview what students and visitors see"
              >
                <Eye className="w-4 h-4 text-amber-300" />
                <span>Preview Student View</span>
              </button>
            </div>
          </div>
        </section>

        {/* Global Feedback Toast */}
        {statusFeedback && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="p-4 rounded-2xl bg-emerald-600 text-white text-sm font-bold shadow-lg flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{statusFeedback}</span>
            </div>
          </div>
        )}

        {/* Main Content Area: Coach Desk Roster */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
          {/* Metric KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Direct Requests</span>
                <span className="text-2xl font-extrabold text-navy-900">{directApplicants.length}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Pending Action</span>
                <span className="text-2xl font-extrabold text-amber-700">
                  {directApplicants.filter(a => !a.status || a.status === 'pending').length}
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Accepted Mentees</span>
                <span className="text-2xl font-extrabold text-emerald-700">
                  {directApplicants.filter(a => a.status === 'accepted').length}
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">Open Pool Available</span>
                <span className="text-2xl font-extrabold text-purple-700">{autoMatchApplicants.length}</span>
              </div>
            </div>
          </div>

          {/* Queue & Status Filter Controls */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Primary Queue Tabs */}
              <div className="flex p-1.5 bg-slate-100 rounded-2xl max-w-xl border border-slate-200 shadow-inner">
                <button
                  type="button"
                  onClick={() => setCoachQueueTab('direct')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    coachQueueTab === 'direct'
                      ? 'bg-white text-navy-900 shadow-md ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-brand-orange" />
                  <span>Assigned to You ({directApplicants.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCoachQueueTab('auto-match')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    coachQueueTab === 'auto-match'
                      ? 'bg-brand-orange text-white shadow-md'
                      : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Open Pool ({autoMatchApplicants.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCoachQueueTab('all')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                    coachQueueTab === 'all'
                      ? 'bg-navy-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  <span>All ({mentorshipList.length})</span>
                </button>
              </div>

              {/* Mentee Search Bar */}
              <div className="relative w-full lg:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search mentee name, essay..."
                  value={menteeSearchQuery}
                  onChange={(e) => setMenteeSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>
            </div>

            {/* Sub-Filters: Status Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Filter Status:</span>
              <button
                type="button"
                onClick={() => setCoachStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  coachStatusFilter === 'pending'
                    ? 'bg-amber-500 text-white shadow'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Pending Review ({currentQueue.filter(a => !a.status || a.status === 'pending').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setCoachStatusFilter('accepted')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  coachStatusFilter === 'accepted'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Accepted Mentees ({currentQueue.filter(a => a.status === 'accepted').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setCoachStatusFilter('declined')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  coachStatusFilter === 'declined'
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Declined ({currentQueue.filter(a => a.status === 'declined').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setCoachStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  coachStatusFilter === 'all'
                    ? 'bg-navy-900 text-white shadow'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>All ({currentQueue.length})</span>
              </button>
            </div>
          </div>

          {/* Mentee Applicant Cards Roster */}
          <div className="space-y-6">
            {filteredCoachApplicants.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-navy-900">No Applications Found in this Filter</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {coachQueueTab === 'direct'
                      ? `No student applications have directly selected Coach ${activeCoachName} with this status. Check the "Open Pool" tab to review candidates seeking an available coach!`
                      : `No candidate applications currently match your selected status filter.`}
                  </p>
                </div>
                {coachQueueTab === 'direct' && autoMatchApplicants.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCoachQueueTab('auto-match')}
                    className="px-5 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold shadow hover:bg-brand-orange-hover transition-all inline-flex items-center gap-2"
                  >
                    <Target className="w-4 h-4" />
                    <span>View Open Mentee Pool ({autoMatchApplicants.length})</span>
                  </button>
                )}
              </div>
            ) : (
              filteredCoachApplicants.map((app) => {
                const isAccepted = app.status === 'accepted';
                const isDeclined = app.status === 'declined';
                const isPending = !app.status || app.status === 'pending';
                const cleanPhone = app.phone.replace(/[^0-9]/g, '');
                const waText = encodeURIComponent(
                  `Hello ${app.fullName}, this is Coach ${activeCoachName} from the Community Innovation Hub (CIH). I reviewed your mentorship application and statement of purpose for the 3-Month Term. Let's schedule our introductory alignment call!`
                );

                return (
                  <div
                    key={app.id}
                    className={`bg-white rounded-3xl border transition-all p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md ${
                      isAccepted
                        ? 'border-emerald-300 ring-1 ring-emerald-200'
                        : isDeclined
                        ? 'border-rose-200 bg-slate-50/50'
                        : 'border-slate-200 hover:border-brand-orange/40'
                    }`}
                  >
                    {/* Header Row: Candidate Identity & Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy-900 to-slate-800 text-white flex items-center justify-center font-extrabold text-xl shadow shrink-0">
                          {app.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="text-xl font-extrabold text-navy-900">{app.fullName}</h3>
                            <span
                              className={`px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                                isAccepted
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : isDeclined
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                              }`}
                            >
                              {isAccepted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                              {isDeclined && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                              {isPending && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                              <span>{isAccepted ? 'Accepted (3-Month Term)' : isDeclined ? 'Declined' : 'Pending Coach Decision'}</span>
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                            <span className="font-semibold text-brand-orange">
                              Focus: {app.focusArea || 'General Mentorship'}
                            </span>
                            <span>•</span>
                            <span className="text-slate-600 font-medium">
                              Desired: <strong className="text-navy-900">{app.desiredMentor || 'Open Auto-Match'}</strong>
                            </span>
                            <span>•</span>
                            <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Term Badge */}
                      <div className="text-left sm:text-right shrink-0">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                          <Clock className="w-3.5 h-3.5 text-brand-orange" />
                          Strict 3-Month Term
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {app.cohortStartDate ? new Date(app.cohortStartDate).toLocaleDateString() : 'Active'} - {app.cohortEndDate ? new Date(app.cohortEndDate).toLocaleDateString() : '90 Days'}
                        </p>
                      </div>
                    </div>

                    {/* Contact Badges Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                        <span className="text-slate-400 font-semibold">Gmail:</span>
                        <a href={`mailto:${app.email}`} className="text-navy-900 font-bold hover:text-brand-orange hover:underline truncate">
                          {app.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-slate-400 font-semibold">Phone / WhatsApp:</span>
                        <a href={`tel:${app.phone}`} className="text-navy-900 font-bold hover:text-brand-orange hover:underline">
                          {app.phone}
                        </a>
                      </div>
                    </div>

                    {/* PROMINENT APPLICATION ESSAY & REASON CARD */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-slate-50 border border-amber-200/80 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-950 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-brand-orange" />
                          Mentee's Background &amp; 3-Month Goals Essay
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                          {getWordCount(app.reasonNeeded)} words
                        </span>
                      </div>
                      <p className="text-sm sm:text-base leading-relaxed text-slate-800 italic whitespace-pre-wrap pt-1 font-medium">
                        "{app.reasonNeeded}"
                      </p>
                    </div>

                    {/* COACH ACTION CONTROLS & OUTREACH */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                      {/* Outreach Quick Links */}
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${waText}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors flex items-center gap-1.5 border border-emerald-200"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp Mentee</span>
                        </a>
                        <a
                          href={`mailto:${app.email}`}
                          className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-colors flex items-center gap-1.5 border border-blue-200"
                        >
                          <Mail className="w-3.5 h-3.5 text-blue-600" />
                          <span>Email Mentee</span>
                        </a>
                      </div>

                      {/* Decision Buttons */}
                      <div className="flex items-center gap-2.5">
                        {!isPending && (
                          <button
                            type="button"
                            onClick={() => handleCoachDecision(app.id, 'pending')}
                            className="px-3 py-2 rounded-xl text-slate-500 hover:text-navy-900 text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-1"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Reset to Pending</span>
                          </button>
                        )}

                        {!isDeclined && (
                          <button
                            type="button"
                            onClick={() => handleCoachDecision(app.id, 'declined')}
                            className="px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Decline Application</span>
                          </button>
                        )}

                        {!isAccepted ? (
                          <button
                            type="button"
                            onClick={() => handleCoachDecision(app.id, 'accepted')}
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>✓ Accept Mentee (3-Month Term)</span>
                          </button>
                        ) : (
                          <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            <span>Accepted under Coach {activeCoachName}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Simulation & Testing Footer Toolbar */}
          <div className="p-4 rounded-2xl bg-navy-900 text-white text-xs flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-orange" />
              <span className="font-semibold">
                Viewing active portal as: <strong>Coach {activeCoachName}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Quick Coach Simulation:</span>
              <button
                onClick={() => setSimulatedCoachName('Adewale Oseni')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  activeCoachName === 'Adewale Oseni' ? 'bg-brand-orange text-white' : 'bg-navy-800 text-slate-300 hover:text-white'
                }`}
              >
                Coach Adewale
              </button>
              <button
                onClick={() => setSimulatedCoachName('Soji Megbowon')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  activeCoachName === 'Soji Megbowon' ? 'bg-brand-orange text-white' : 'bg-navy-800 text-slate-300 hover:text-white'
                }`}
              >
                Coach Soji
              </button>
              <button
                onClick={() => setSimulatedCoachName('Amina Yusuf')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  activeCoachName === 'Amina Yusuf' ? 'bg-brand-orange text-white' : 'bg-navy-800 text-slate-300 hover:text-white'
                }`}
              >
                Coach Amina (Alumni)
              </button>
              {simulatedCoachName && (
                <button
                  onClick={() => setSimulatedCoachName(null)}
                  className="px-2 py-1 rounded-lg bg-rose-600/30 text-rose-300 hover:bg-rose-600 hover:text-white text-[10px] font-bold ml-1"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // =========================================================================
  // VIEW B: PUBLIC STUDENT & ALUMNI APPLICATION VIEW
  // (SHOWN TO VISITORS, MENTEES, OR WHEN COACH CLICKS PREVIEW)
  // =========================================================================
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Floating Return Button if a Coach is previewing public view */}
      {isCertifiedMentor && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <button
            type="button"
            onClick={() => setCoachViewMode('desk')}
            className="px-5 py-3 rounded-2xl bg-navy-950 hover:bg-navy-900 text-white text-xs sm:text-sm font-extrabold shadow-2xl border-2 border-brand-orange flex items-center gap-2"
          >
            <Award className="w-4 h-4 text-brand-orange" />
            <span>Return to Coach {activeCoachName} Desk</span>
          </button>
        </div>
      )}

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
                  {allCoachesList.filter((m) => m.id !== 'auto-match').map((mentor) => (
                    <div
                      key={mentor.id}
                      className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-3 hover:border-brand-orange/40 hover:bg-brand-orange/5 transition-all cursor-pointer group"
                      onClick={() => handleSelectMentor(mentor)}
                      title={`Select ${mentor.name} as your preferred coach`}
                    >
                      <img
                        src={mentor.image}
                        alt={mentor.name}
                        className="w-10 h-10 rounded-xl object-cover object-top border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
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

          {/* Right Column: Dual Pathway Application Forms */}
          <div className="lg:col-span-7">
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
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setIsMentorPickerOpen(!isMentorPickerOpen)}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-white flex items-center justify-between text-left hover:border-brand-orange transition-all focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={activeMentor.image}
                                alt={activeMentor.name}
                                className="w-10 h-10 rounded-xl object-cover object-top border border-slate-200"
                              />
                              <div>
                                <div className="text-sm font-bold text-navy-900">{activeMentor.name}</div>
                                <div className="text-xs text-brand-orange font-semibold">{activeMentor.role}</div>
                              </div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          </button>

                          {isMentorPickerOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 max-h-72 overflow-y-auto space-y-1">
                              {allCoachesList.map((mentor) => (
                                <button
                                  key={mentor.id}
                                  type="button"
                                  onClick={() => handleSelectMentor(mentor)}
                                  className={`w-full p-2.5 rounded-xl flex items-center gap-3 transition-colors text-left ${
                                    selectedMentorId === mentor.id ? 'bg-brand-orange/10 text-navy-900' : 'hover:bg-slate-50'
                                  }`}
                                >
                                  <img
                                    src={mentor.image}
                                    alt={mentor.name}
                                    className="w-9 h-9 rounded-lg object-cover object-top border border-slate-200"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-navy-900 truncate">{mentor.name}</div>
                                    <div className="text-[11px] text-slate-500 truncate">{mentor.role}</div>
                                  </div>
                                  {selectedMentorId === mentor.id && (
                                    <Check className="w-4 h-4 text-brand-orange shrink-0" />
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Mentorship Term Duration Notice */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-brand-orange" />
                          <span>Mentorship Cohort Duration:</span>
                        </div>
                        <span className="font-bold text-navy-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          Strictly 3 Months (90 Days)
                        </span>
                      </div>

                      {/* Mentorship Essay */}
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
                          Submit Another Coach Application
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleAlumniSubmit} className="space-y-6">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-brand-orange text-xs font-bold uppercase tracking-wider mb-2">
                          <Award className="w-3.5 h-3.5" />
                          CIH Alumni &amp; Industry Fellows • Coach Pathway
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                          Volunteer as a CIH Case Study Coach
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                          Share your professional expertise, facilitate Wednesday breakout pods, and mentor ambitious students across Tech, Leadership, and Ethics.
                        </p>
                      </div>

                      {/* Full Name & Gmail */}
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
                            Gmail Address <span className="text-brand-orange font-normal text-[10px]">(@gmail.com required)</span> <span className="text-rose-500">*</span>
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
                            CIH Background / Alumni Track <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={alumniForm.alumniTrack}
                            onChange={(e) => setAlumniForm({ ...alumniForm, alumniTrack: e.target.value as any })}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-900 text-sm font-medium bg-white"
                          >
                            <option value="CIH Graduate / Alumni">CIH Graduate / Past Native</option>
                            <option value="Hub Intern / IT Graduate">Hub Intern / IT Graduate</option>
                            <option value="Senior Fellow">Senior Fellow</option>
                            <option value="Industry Professional">Industry Partner / Guest Coach</option>
                          </select>
                        </div>
                      </div>

                      {/* Graduation Year & Current Role */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                            Cohort / Graduation Year
                          </label>
                          <select
                            value={alumniForm.graduationYear}
                            onChange={(e) => setAlumniForm({ ...alumniForm, graduationYear: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-900 text-sm font-medium bg-white"
                          >
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021 or Earlier</option>
                            <option value="Guest Expert">External Partner</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                            Current Role &amp; Organization <span className="text-rose-500">*</span>
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

                      {/* LinkedIn Profile & Coaching Domain */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                            LinkedIn Profile URL <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="url"
                            required
                            placeholder="https://linkedin.com/in/yourname"
                            value={alumniForm.linkedinUrl}
                            onChange={(e) => setAlumniForm({ ...alumniForm, linkedinUrl: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-900 text-sm font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                            Coaching Focus Domain <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={alumniForm.coachingDomain}
                            onChange={(e) => setAlumniForm({ ...alumniForm, coachingDomain: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-900 text-sm font-medium bg-white"
                          >
                            <option value="Tech & AI / Technical Problem Solving">Tech &amp; AI / Technical Problem Solving</option>
                            <option value="Career Strategy & High-Performance Execution">Career Strategy &amp; High-Performance Execution</option>
                            <option value="Public Speaking & Executive Presence">Public Speaking &amp; Executive Presence</option>
                            <option value="Product, Pitching & Startup Growth">Product, Pitching &amp; Startup Growth</option>
                            <option value="Financial Intelligence & Ethics">Financial Intelligence &amp; Ethics</option>
                          </select>
                        </div>
                      </div>

                      {/* Availability Selection */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                          Availability &amp; Coaching Format
                        </label>
                        <select
                          value={alumniForm.availability}
                          onChange={(e) => setAlumniForm({ ...alumniForm, availability: e.target.value as any })}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-900 text-sm font-medium bg-white"
                        >
                          <option value="Both On-site & Virtual">Both On-site Wednesdays &amp; Virtual 1-on-1 Sessions</option>
                          <option value="On-site Wednesdays (Abesan Estate)">On-site Wednesdays (Abesan Estate Hub Plenary &amp; Pods)</option>
                          <option value="Virtual 1-on-1 Breakouts">Virtual 1-on-1 Mentorship Breakouts (Evenings / Weekends)</option>
                        </select>
                      </div>

                      {/* Statement of Purpose */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider">
                            Why do you want to coach at CIH? (Statement of Purpose) <span className="text-rose-500">*</span>
                          </label>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                              isAlumniWordCountExceeded
                                ? 'bg-rose-100 text-rose-700 font-extrabold'
                                : alumniWordCount >= 450
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {alumniWordCount} / 500 words
                          </span>
                        </div>
                        <textarea
                          required
                          rows={5}
                          placeholder="Tell us about your background, what motivated you to coach at CIH, and how you plan to impact participants during the 3-month cohort (max 500 words)..."
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default MentorshipPage;
