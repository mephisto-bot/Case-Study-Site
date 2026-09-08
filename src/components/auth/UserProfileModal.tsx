import React from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  HeartHandshake, 
  ShieldCheck, 
  Calendar, 
  LogOut, 
  ExternalLink,
  Award,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { getStoredRegistrations } from '../../services/storage';
import { getNextSessionTargetDate } from '../../utils/dateHelpers';

export const UserProfileModal: React.FC = () => {
  const { user, logout, profileModalOpen, closeProfileModal } = useAuth();

  if (!profileModalOpen || !user) return null;

  const allRegistrations = getStoredRegistrations();
  const userRegistration = allRegistrations.find(
    (r) => r.email.toLowerCase().trim() === user.email.toLowerCase().trim()
  );

  const nextSessionDate = getNextSessionTargetDate();
  const formattedNextDate = nextSessionDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-6 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full max-h-[88vh] shadow-2xl border border-slate-200/80 relative flex flex-col overflow-hidden my-auto transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={closeProfileModal}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-sm"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-brand-orange to-amber-500 text-white flex items-center justify-center font-extrabold text-xl shadow-lg border-2 border-white/20 shrink-0">
              {user.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">{user.fullName}</h3>
                <span title="Verified Member">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/10">
            {user.role === 'alumni' ? (
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-brand-orange" /> CIH Alumni Native
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                <User className="w-3 h-3 text-blue-400" /> Guest Scholar
              </span>
            )}

            {(user.isApprovedMentor || user.isMentorVolunteer) && (
              <span className="px-2.5 py-0.5 rounded-md bg-brand-orange text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <HeartHandshake className="w-3 h-3" /> ★ {user.isApprovedMentor ? 'Certified Coach' : 'Volunteer Coach'}
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-3.5 text-xs flex-1 overflow-y-auto">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Next Session</span>
              <span className="font-extrabold text-navy-900 text-xs block mt-0.5 truncate">
                {userRegistration ? 'Confirmed Seat' : 'Not Registered'}
              </span>
              <span className="text-[10px] text-slate-500 block truncate">{formattedNextDate}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Breakout Pod</span>
              <span className="font-extrabold text-brand-orange text-xs block mt-0.5">Pod A (In-Person)</span>
              <span className="text-[10px] text-slate-500 block">Abesan Estate, Ipaja</span>
            </div>
          </div>

          {/* Details Card */}
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5 font-semibold text-[11px]">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone:
              </span>
              <span className="font-bold text-navy-900 text-[11px]">{user.phone || 'Not provided'}</span>
            </div>

            {user.alumniCohort && (
              <div className="flex items-center justify-between text-slate-600 pt-1.5 border-t border-slate-200/60">
                <span className="flex items-center gap-1.5 font-semibold text-[11px]">
                  <Award className="w-3.5 h-3.5 text-slate-400" /> Cohort / Track:
                </span>
                <span className="font-bold text-navy-900 text-[11px]">{user.alumniCohort}</span>
              </div>
            )}

            {user.isMentorVolunteer && user.mentorFocusAreas && user.mentorFocusAreas.length > 0 && (
              <div className="pt-1.5 border-t border-slate-200/60">
                <span className="font-semibold text-slate-600 block mb-1 text-[10px]">Specialties:</span>
                <div className="flex flex-wrap gap-1">
                  {user.mentorFocusAreas.slice(0, 3).map((area) => (
                    <span key={area} className="px-1.5 py-0.5 rounded bg-orange-50 text-brand-orange font-bold text-[9px] border border-orange-200">
                      {area}
                    </span>
                  ))}
                  {user.mentorFocusAreas.length > 3 && (
                    <span className="text-[9px] text-slate-400 font-bold">+{user.mentorFocusAreas.length - 3} more</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Prominent Action: Open Full Profile Page */}
          <Link
            to="/profile"
            onClick={closeProfileModal}
            className="w-full py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 group"
          >
            <Sparkles className="w-4 h-4 text-brand-orange group-hover:rotate-12 transition-transform" />
            <span>Open Detailed Profile & Settings</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          {/* Quick Ticket Action */}
          <Link
            to="/register"
            onClick={closeProfileModal}
            className="w-full py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{userRegistration ? 'View Wednesday Ticket Pass' : 'Reserve Seat for Upcoming Wednesday'}</span>
          </Link>

          {/* Logout Button */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-slate-400 text-[10px]">Logged in securely</span>
            <button
              onClick={() => {
                closeProfileModal();
                logout();
              }}
              className="px-3 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-bold transition-colors flex items-center gap-1.5 text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
