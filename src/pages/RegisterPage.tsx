import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  UserCheck, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  CalendarPlus, 
  Sparkles,
  Loader2,
  AlertCircle,
  Camera,
  ShieldCheck,
  Lock,
  Clock,
  Lightbulb,
  BookOpen,
  MailCheck,
  Download,
  MapPin
} from 'lucide-react';
import { submitRegistration, downloadCalendarInvite, getGoogleCalendarUrl } from '../services/api';
import { RegistrationFormData, AttendeeRecord } from '../types';
import { getRegistrationStatus, RegistrationStatus } from '../utils/registrationTiming';
import { getStoredUpcomingSession } from '../services/storage';
import { TopicSuggestionModal } from '../components/common/TopicSuggestionModal';
import { useAuth } from '../context/AuthContext';
import { isValidGmail, GMAIL_ERROR_MESSAGE, countWords } from '../utils/validation';

export const RegisterPage: React.FC = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    attendeeType: user?.role === 'alumni' ? 'Alumni / Past Native' : 'GUEST',
    mediaConsent: false,
    attendanceEssay: '',
  });

  const [loading, setLoading] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<AttendeeRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [regStatus, setRegStatus] = useState<RegistrationStatus>(getRegistrationStatus());
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);

  useEffect(() => {
    setRegStatus(getRegistrationStatus());
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        attendeeType: user.role === 'alumni' ? 'Alumni / Past Native' : prev.attendeeType,
      }));
    } else {
      // Automatically trigger auth modal if arriving unauthenticated
      openAuthModal('signup', 'guest');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Rule: Users are strictly prohibited from registering without logging in or signing up
    if (!isAuthenticated || !user) {
      setErrorMsg('You must sign up or log in before registering for a session.');
      openAuthModal('signup', 'guest');
      return;
    }

    // Re-verify status
    const currentStatus = getRegistrationStatus();
    if (!currentStatus.isOpen) {
      setErrorMsg(currentStatus.message || 'Registration is currently closed for the upcoming session.');
      return;
    }

    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!formData.email.trim() || !isValidGmail(formData.email)) {
      setErrorMsg(GMAIL_ERROR_MESSAGE);
      return;
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      setErrorMsg('Please enter a valid phone number (e.g. +234 801 234 5678).');
      return;
    }

    const words = countWords(formData.attendanceEssay || '');
    if (words < 300) {
      setErrorMsg(`Your essay explaining why you want to attend and why you want this specific topic must be at least 300 words. You have currently written ${words} words (${300 - words} more needed).`);
      return;
    }

    if (!formData.mediaConsent) {
      setErrorMsg('You must agree to the media and privacy consent to proceed.');
      return;
    }

    setLoading(true);
    try {
      // Submit to backend API - Status is initially pending review, ticket delivered upon selection on Tuesday
      const response = await submitRegistration({
        ...formData,
      });

      if (response.success && response.record) {
        setSubmittedRecord(response.record);
      } else {
        setErrorMsg(response.message || 'Unable to record registration. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      attendanceEssay: '',
      attendeeType: 'GUEST',
      mediaConsent: false,
    });
    setSubmittedRecord(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-slate-50 via-white to-slate-50 py-10 sm:py-14 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-lg w-full space-y-4">
        
        {/* Age 14+ Eligibility Banner & 20 Seat Limit */}
        <div className="space-y-2">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-brand-orange/15 to-amber-500/15 border border-brand-orange/30 text-center text-xs font-bold text-navy-900 flex flex-col sm:flex-row items-center justify-center gap-2 shadow-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-orange text-white text-[10px] font-extrabold uppercase tracking-wider">
              STRICT 20-PARTICIPANT CAPACITY
            </span>
            <span>Only 20 eligible participants per session • Admission is subject to essay review</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-center text-[11px] font-bold text-slate-700 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange shrink-0" />
            <span>Open to participants aged 14 and above • Registration closes every Saturday</span>
          </div>
        </div>

        {/* State 0: Strict Prohibition - Must Sign Up or Log In first */}
        {!isAuthenticated || !user ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-elevated border border-slate-200 text-center space-y-6 animate-fade-in">
            {/* Lock Icon */}
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-brand-orange border border-amber-200 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8 text-brand-orange" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" />
                <span>Authentication Required</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                Sign Up or Log In to Register
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                Users are prohibited from registering without first signing up or logging in to the website. This guarantees seat reservation, digital event pass delivery, and mentor tracking.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => openAuthModal('signup', 'guest')}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold shadow-lg hover:shadow-orange-glow transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Sign Up (Guest or CIH Alumni)</span>
              </button>

              <button
                onClick={() => openAuthModal('login')}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-sm font-bold transition-all active:scale-95"
              >
                <Lock className="w-4 h-4" />
                <span>Already Have an Account? Log In</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 text-slate-600">
              <div className="flex items-center gap-2 font-bold text-navy-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Guest Track: Free, instant access to weekly case study sessions</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-navy-900">
                <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                <span>CIH Alumni Track: Option to volunteer as a Case Study Mentor</span>
              </div>
            </div>
          </div>
        ) : !regStatus.isOpen && !submittedRecord ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-elevated border border-slate-200 text-center space-y-6 animate-fade-in">
            {/* Lock Icon */}
            <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-extrabold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>{regStatus.deadlineText}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                {regStatus.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                {regStatus.message}
              </p>
            </div>

            {/* Next Re-open Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 text-slate-700">
              <div className="flex items-center justify-between font-bold text-navy-900 text-xs">
                <span className="flex items-center gap-1.5 text-brand-orange">
                  <Calendar className="w-4 h-4" /> This Week's Session:
                </span>
                <span>{regStatus.nextSessionDate}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200 font-semibold text-slate-600">
                <span>Next Registration Window:</span>
                <span className="text-emerald-700 font-bold">{regStatus.reopenText}</span>
              </div>
            </div>

            {/* Alternative Actions when Registration is Closed */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setIsTopicModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Suggest a Topic for Upcoming Sessions</span>
              </button>

              <Link
                to="/case-studies"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs sm:text-sm font-bold transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Past Case Studies</span>
              </Link>
            </div>
          </div>
        ) : submittedRecord ? (
          /* Confirmation Success State - Under Review & Tuesday Morning Ticket Dispatch */
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-slate-100 text-center space-y-6 animate-fade-in">
            {/* Success Icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm animate-bounce-short">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-brand-orange" /> Application Under Review
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                Thank you for registering!
              </h2>
              <p className="text-sm font-semibold text-slate-700 max-w-md mx-auto">
                We will get back to you shortly.
              </p>
            </div>

            {/* Selection & Tuesday Morning Email Schedule Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-navy-950 to-navy-900 text-white text-left space-y-3.5 shadow-xl border border-navy-800 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-orange text-white flex items-center justify-center shrink-0 shadow-md">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-white">
                    Selection &amp; Ticket Delivery Notice
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-300">
                    Applicant: <strong className="text-white">{submittedRecord.fullName}</strong> ({submittedRecord.email})
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 leading-relaxed space-y-2.5">
                <p>
                  🎯 <strong>Strict 20-Participant Capacity:</strong> Because each weekly Wednesday session is strictly eligible to only <strong>20 participants</strong>, our mentorship board is evaluating all submitted essays and application responses.
                </p>
                <div className="p-2.5 rounded-lg bg-brand-orange/20 border border-brand-orange/40 text-brand-orange-light font-bold text-[11px]">
                  ✉️ Official confirmation emails and admission entry tickets will be dispatched to selected participants on <strong>Tuesday morning</strong>.
                </div>
                <p className="text-[11px] text-slate-400">
                  Registration closes every Saturday. Please check your inbox (including Spam/Promotions) on Tuesday morning for your attendance status.
                </p>
              </div>
            </div>

            {/* Dynamic 2x2 Session Overview Badges */}
            <div className="grid grid-cols-2 gap-2 text-left text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-brand-orange" /> Date
                </span>
                <p className="font-extrabold text-navy-900 text-xs truncate">{getStoredUpcomingSession().dateStr}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3 text-brand-orange" /> Time
                </span>
                <p className="font-extrabold text-navy-900 text-xs truncate">{getStoredUpcomingSession().time || '10:00 AM – 4:00 PM'}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-orange" /> Venue
                </span>
                <p className="font-extrabold text-navy-900 text-xs truncate">Plot 104, Abesan Estate, Ipaja</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-orange" /> Topic
                </span>
                <p className="font-extrabold text-navy-900 text-xs truncate">{getStoredUpcomingSession().topicTitle || getStoredUpcomingSession().weekTitle || 'Case Study Cohort'}</p>
              </div>
            </div>

            {/* Calendar Quick Sync Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold shadow transition-all active:scale-95"
              >
                <CalendarPlus className="w-4 h-4 text-brand-orange" />
                <span>Add to Google Calendar</span>
              </a>

              <button
                onClick={() => downloadCalendarInvite()}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-bold transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save .ics Calendar File</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors"
              >
                ← Register another attendee
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form Card */
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-elevated border border-slate-100 relative">
            {/* Header Icon */}
            <div className="w-14 h-14 rounded-2xl bg-brand-orange-light text-brand-orange flex items-center justify-center mx-auto mb-6 shadow-sm">
              <UserCheck className="w-7 h-7" />
            </div>

            {/* Headline & Subtitle */}
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                Register for Next Wednesday
              </h1>
              <p className="text-sm text-slate-600">
                Community Innovation Hub Case Study Mentorship Program
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs font-semibold text-rose-700 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Logged-In User Profile Banner */}
            <div className="mb-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-navy-900 text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
                  {user.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-navy-900 text-xs sm:text-sm">{user.fullName}</span>
                    <span className="px-2 py-0.5 rounded-md bg-brand-orange/15 text-brand-orange text-[10px] font-extrabold uppercase">
                      {user.role === 'alumni' ? (user.isMentorVolunteer ? 'Mentor' : 'Alumni') : 'Guest'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{user.email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="text-[11px] font-bold text-slate-500 hover:text-brand-orange transition-colors"
              >
                Switch Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-brand-orange">*</span>
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-all placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-brand-orange font-normal text-[10px]">(@gmail.com strictly required)</span> <span className="text-brand-orange">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-all placeholder:text-slate-400 font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 pl-1">
                  Selection notices and official entry tickets will be dispatched to this Gmail on Tuesday morning.
                </p>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number (WhatsApp Preferred) <span className="text-brand-orange">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="+234 801 234 5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-all placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>

              {/* Attendee Category Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Attendee Category <span className="text-brand-orange">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* GUEST Option */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attendeeType: 'GUEST' })}
                    className={`py-3.5 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      formData.attendeeType === 'GUEST'
                        ? 'border-brand-orange bg-brand-orange-light text-navy-900 shadow-sm ring-1 ring-brand-orange'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        formData.attendeeType === 'GUEST'
                          ? 'border-brand-orange bg-brand-orange'
                          : 'border-slate-300'
                      }`}
                    >
                      {formData.attendeeType === 'GUEST' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    <span>GUEST</span>
                  </button>

                  {/* Alumni / Past Native Option */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attendeeType: 'Alumni / Past Native' })}
                    className={`py-3.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      formData.attendeeType === 'Alumni / Past Native'
                        ? 'border-brand-orange bg-brand-orange-light text-navy-900 shadow-sm ring-1 ring-brand-orange'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        formData.attendeeType === 'Alumni / Past Native'
                          ? 'border-brand-orange bg-brand-orange'
                          : 'border-slate-300'
                      }`}
                    >
                      {formData.attendeeType === 'Alumni / Past Native' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    <span className="truncate">Alumni / Past Native</span>
                  </button>
                </div>
              </div>

              {/* Attendance & Topic Justification Essay (Minimum 300 Words) */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Why attend Case Study &amp; this topic? <span className="text-brand-orange">*</span>
                  </label>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    countWords(formData.attendanceEssay || '') < 300
                      ? 'bg-rose-100 text-rose-700 font-extrabold'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {countWords(formData.attendanceEssay || '')} / 300 words min
                  </span>
                </div>
                <textarea
                  required
                  rows={7}
                  placeholder="In not less than 300 words, tell us: (1) Why do you want to attend Case Study? and (2) Why do you want this particular topic? (Your essay will be reviewed for seat selection)..."
                  value={formData.attendanceEssay || ''}
                  onChange={(e) => setFormData({ ...formData, attendanceEssay: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-800 focus:outline-none transition-all leading-relaxed ${
                    countWords(formData.attendanceEssay || '') < 300 && (formData.attendanceEssay || '').length > 0
                      ? 'border-rose-300 focus:ring-2 focus:ring-rose-400/30'
                      : 'border-slate-200 focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange'
                  }`}
                />
                {countWords(formData.attendanceEssay || '') < 300 ? (
                  <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Minimum 300 words required ({300 - countWords(formData.attendanceEssay || '')} more words needed before you can submit).
                  </p>
                ) : (
                  <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Word requirement met ({countWords(formData.attendanceEssay || '')} words).
                  </p>
                )}
              </div>

              {/* Mandatory Media & Photo/Video Consent Box */}
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-left">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={formData.mediaConsent}
                    onChange={(e) => setFormData({ ...formData, mediaConsent: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-brand-orange focus:ring-brand-orange border-amber-300 shrink-0"
                  />
                  <span className="text-xs text-amber-900 leading-relaxed font-medium">
                    <strong className="font-bold flex items-center gap-1 text-amber-950 mb-0.5">
                      <Camera className="w-3.5 h-3.5 text-brand-orange inline" /> Media & Video Consent:
                    </strong>
                    I agree to the CIH Privacy Policy and consent to photographs and videos being recorded during the case study session for Community Innovation Hub documentation.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading || !formData.mediaConsent || countWords(formData.attendanceEssay || '') < 300}
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm sm:text-base font-bold shadow-lg hover:shadow-orange-glow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Application &amp; Essay...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application for Selection Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Helper text */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Your information is strictly protected by CIH privacy policy.</span>
              </div>
            </form>
          </div>
        )}
      </div>

      <TopicSuggestionModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
      />
    </div>
  );
};
