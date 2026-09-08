import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getStoredRegistrations,
  getStoredMentorshipApplications,
  getStoredAlumniCoachApplications,
  getStoredSentEmails
} from '../services/storage';
import { getGmailDirectUrl } from '../services/emailService';
import { SentEmailLog, AttendeeRecord, MentorshipApplication, AlumniCoachApplication } from '../types';
import { getNextSessionTargetDate } from '../utils/dateHelpers';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  HeartHandshake,
  Calendar,
  MapPin,
  CheckCircle2,
  Edit3,
  Save,
  LogOut,
  Ticket,
  ArrowLeft,
  ArrowRight,
  X,
  Clock,
  XCircle,
  FileText,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, logout, updateProfile, openAuthModal } = useAuth();
  const navigate = useNavigate();

  // If not logged in, show prompt
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[70vh] bg-slate-50 pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-sm w-full bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-lg text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-brand-orange/15 text-brand-orange flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-navy-900">Member Profile</h2>
            <p className="text-xs text-slate-500 mt-1">
              Please sign in to view and manage your Case Study account.
            </p>
          </div>
          <div className="flex gap-2.5 pt-2">
            <button
              onClick={() => openAuthModal('login')}
              className="flex-1 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal('signup', 'guest')}
              className="flex-1 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs transition-colors"
            >
              Sign Up
            </button>
          </div>
          <Link to="/" className="inline-block text-xs font-semibold text-slate-400 hover:text-slate-600">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<SentEmailLog | null>(null);

  // Form states - Name and phone are permanent credentials and cannot be edited
  const [bio, setBio] = useState(user.bio || '');
  const [alumniCohort, setAlumniCohort] = useState(user.alumniCohort || '');
  const [isMentorVolunteer, setIsMentorVolunteer] = useState(user.isMentorVolunteer || false);

  // Check upcoming session registration and applications
  const userEmail = (user.email || '').toLowerCase().trim();
  const allRegistrations = getStoredRegistrations();
  const userRegistrations = allRegistrations.filter(
    (r) => (r.email || '').toLowerCase().trim() === userEmail
  );
  const userRegistration = userRegistrations[0];

  const allMentorshipApps = getStoredMentorshipApplications();
  const userMentorshipApps = allMentorshipApps.filter(
    (a) => (a.email || '').toLowerCase().trim() === userEmail
  );

  const allCoachApps = getStoredAlumniCoachApplications();
  const userCoachApps = allCoachApps.filter(
    (c) => (c.email || '').toLowerCase().trim() === userEmail
  );

  const allSentEmails = getStoredSentEmails();
  const userLetters = allSentEmails.filter(
    (e) => (e.recipientEmail || '').toLowerCase().trim() === userEmail
  );

  const nextSessionDate = getNextSessionTargetDate();
  const formattedDate = nextSessionDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Rule: Users cannot edit their name and phone number
    updateProfile({
      bio,
      alumniCohort,
      isMentorVolunteer
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50/60 pt-20 sm:pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto space-y-4">

        {/* Back Link & Actions */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-navy-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Case Study</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile saved successfully!</span>
          </div>
        )}

        {/* ================= MAIN PROFILE CARD ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-navy-950 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-brand-orange text-white flex items-center justify-center font-extrabold text-lg sm:text-xl shadow-md border-2 border-white/20 shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-extrabold text-white leading-tight truncate">
                  {user.fullName}
                </h1>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  {user.role === 'alumni' ? (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-brand-orange" /> CIH Alumni
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                      <User className="w-3 h-3 text-blue-400" /> Guest Attendee
                    </span>
                  )}
                  {(user.isApprovedMentor || user.isMentorVolunteer) && (
                    <span className="px-2 py-0.5 rounded bg-brand-orange text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                      <HeartHandshake className="w-3 h-3" /> {user.isApprovedMentor ? 'Certified Coach' : 'Volunteer Coach'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit Bio</span>
              </button>
            )}
          </div>

          {/* Card Body */}
          <div className="p-5 sm:p-6 space-y-4">
            {!isEditing ? (
              /* VIEW MODE */
              <div className="space-y-4">
                {/* Contact & Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-700 truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-700">{user.phone || 'No phone set'}</span>
                  </div>
                </div>

                {/* Bio / Statement */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    About / Bio
                  </span>
                  <p className="text-slate-700 leading-relaxed min-h-[20px]">
                    {user.bio || bio || <span className="text-slate-400 italic">No bio entered yet. Click "Edit Bio" above to add one.</span>}
                  </p>
                </div>

                {/* If Alumni: Cohort info */}
                {user.role === 'alumni' && user.alumniCohort && (
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                        CIH Graduating Cohort
                      </span>
                      <span className="font-semibold text-navy-900">{user.alumniCohort}</span>
                    </div>
                    {(user.isApprovedMentor || user.isMentorVolunteer) && (
                      <span className="px-2 py-0.5 rounded bg-brand-orange text-white text-[10px] font-bold">
                        {user.isApprovedMentor ? 'Certified Coach' : 'Active Coach Guide'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* EDIT MODE - Users cannot edit their name and phone number */
              <form onSubmit={handleSave} className="space-y-3">
                {/* Read-Only Identity Card */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-navy-900 block text-xs">{user.fullName}</span>
                    <span className="text-[11px] text-slate-500">{user.email} • {user.phone || 'No phone'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-navy-900 mb-1">
                    Bio / About Me
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder=""
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 text-slate-900"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Empty space for you to write your personal or professional bio.
                  </p>
                </div>

                {user.role === 'alumni' && (
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-navy-900 mb-1">
                        Graduating Cohort / Track
                      </label>
                      <input
                        type="text"
                        value={alumniCohort}
                        onChange={(e) => setAlumniCohort(e.target.value)}
                        placeholder="Cohort year and cohort track"
                        className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs focus:outline-none text-slate-900"
                      />
                    </div>
                    <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-navy-900 block">Interested in Coaching or Mentorship?</span>
                        <p className="text-[10px] text-slate-500">Join the official 1-on-1 coaching cohorts or spar with hub directors.</p>
                      </div>
                      <Link
                        to="/mentorship?tab=become-coach"
                        className="px-3 py-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange-hover text-white text-[11px] font-bold shrink-0 transition-all flex items-center gap-1 shadow-2xs"
                      >
                        <span>Apply to Coach</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ================= WEDNESDAY SESSION STATUS CARD ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                userRegistration ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-brand-orange'
              }`}>
                {userRegistration ? <Ticket className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-navy-900">
                    {userRegistration ? (userRegistration.status === 'accepted' ? 'Seat Accepted & Confirmed' : userRegistration.status === 'declined' ? 'Session Registration Declined' : 'Registration Pending Review') : 'Wednesday Case Study'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">• {formattedDate}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Wednesdays 10:00 AM – 1:00 PM • CIH Hub, Ipaja
                </p>
              </div>
            </div>

            {userRegistration ? (
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                  userRegistration.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                  userRegistration.status === 'declined' ? 'bg-rose-100 text-rose-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {userRegistration.status}
                </span>
                <Link
                  to="/register"
                  className="px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-colors shrink-0 shadow-xs"
                >
                  View Details
                </Link>
              </div>
            ) : (
              <Link
                to="/register"
                className="px-3.5 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold transition-colors shrink-0 shadow-xs"
              >
                Reserve Seat
              </Link>
            )}
          </div>
        </div>

        {/* ================= ALL APPLICATIONS & TRACKING ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-orange" />
              <h3 className="text-xs font-extrabold text-navy-900 uppercase tracking-wider">
                My Applications & Review Status
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {userRegistrations.length + userMentorshipApps.length + userCoachApps.length} active application(s)
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Wednesday Session Application */}
            {userRegistrations.map((reg) => (
              <div key={reg.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-navy-900">Wednesday Case Study Seat</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      reg.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                      reg.status === 'declined' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {reg.status === 'accepted' ? 'Accepted & Pass Granted' : reg.status === 'declined' ? 'Declined / Session Full' : 'Pending CIH Review'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    Attendee: {reg.attendeeType} • Applied on {new Date(reg.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}

            {/* Mentorship Applications */}
            {userMentorshipApps.map((app) => (
              <div key={app.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-navy-900">1-on-1 Mentorship</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      app.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'declined' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {app.status === 'accepted' ? 'Accepted by Coach' : app.status === 'declined' ? 'Application Declined' : 'Under Coach Review'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Coach: <span className="font-semibold text-navy-900">{app.desiredMentor}</span> • Focus: {app.focusArea}
                  </p>
                </div>
                <Link
                  to="/mentorship"
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-[11px] font-bold text-navy-900 shrink-0"
                >
                  View
                </Link>
              </div>
            ))}

            {/* Coach Applications */}
            {userCoachApps.map((app) => (
              <div key={app.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-navy-900">CIH Coach Volunteer</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      app.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'declined' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {app.status === 'accepted' ? 'Approved Coach' : app.status === 'declined' ? 'Declined by CIH' : 'Under Management Review'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Track: {app.alumniTrack} • Domain: {app.coachingDomain}
                  </p>
                </div>
                <Link
                  to="/mentorship"
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-[11px] font-bold text-navy-900 shrink-0"
                >
                  Dashboard
                </Link>
              </div>
            ))}

            {userRegistrations.length === 0 && userMentorshipApps.length === 0 && userCoachApps.length === 0 && (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">No active applications found</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Register for Wednesday Case Study or apply for 1-on-1 mentorship.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ================= OFFICIAL NOTIFICATION LETTERS & EMAILS ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-orange" />
              <h3 className="text-xs font-extrabold text-navy-900 uppercase tracking-wider">
                Official Review Letters & Email Notifications
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {userLetters.length} letter(s) received
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Official decision letters dispatched directly to your email inbox ({user.email}). You can view the full official letter below at any time.
          </p>

          <div className="space-y-2">
            {userLetters.length > 0 ? (
              userLetters.map((letter) => (
                <div
                  key={letter.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        letter.category.includes('accepted') || letter.category.includes('approved')
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : letter.category.includes('declined')
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {letter.category.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {new Date(letter.sentAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="font-bold text-navy-900 line-clamp-1">{letter.subject}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{letter.plainText}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedLetter(letter)}
                      className="px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Read Letter</span>
                    </button>
                    <a
                      href={getGmailDirectUrl(letter.recipientEmail, letter.subject, letter.plainText)}
                      target="_blank"
                      rel="noreferrer"
                      title="Open in Gmail"
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">No review emails recorded yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  When CIH Management or your mentor reviews your application, your instant decision email will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ================= LETTER VIEWER MODAL ================= */}
        {selectedLetter && (
          <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-scale-up">
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-navy-950 text-white flex items-center justify-between border-b border-navy-800">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-brand-orange text-white text-[10px] font-extrabold uppercase tracking-wider">
                      Official CIH Dispatch
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(selectedLetter.sentAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white mt-1 truncate">
                    {selectedLetter.subject}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedLetter(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Meta Bar */}
              <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-600">
                <div>
                  <span className="font-semibold text-slate-400">To: </span>
                  <span className="font-bold text-navy-900">{selectedLetter.recipientName}</span> ({selectedLetter.recipientEmail})
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                    Dispatched & Logged
                  </span>
                </div>
              </div>

              {/* Rendered HTML Letter Content */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100">
                <div
                  className="bg-white rounded-xl shadow-xs border border-slate-200 p-3 sm:p-4 overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: selectedLetter.htmlBody }}
                />
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
                <a
                  href={getGmailDirectUrl(selectedLetter.recipientEmail, selectedLetter.subject, selectedLetter.plainText)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Gmail</span>
                </a>
                <button
                  onClick={() => setSelectedLetter(null)}
                  className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-colors"
                >
                  Close Letter
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfilePage;
