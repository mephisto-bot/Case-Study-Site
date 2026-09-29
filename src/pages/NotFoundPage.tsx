import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Home, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  UserCheck, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { getStoredCaseStudies, getStoredUpcomingSession } from '../services/storage';
import { CaseStudyModal } from '../components/common/CaseStudyModal';
import { CaseStudy } from '../types';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedStudy, setSelectedStudy] = React.useState<CaseStudy | null>(null);

  const caseStudies = React.useMemo(() => getStoredCaseStudies(), []);
  const upcomingSession = React.useMemo(() => getStoredUpcomingSession(), []);

  // Most recent session
  const latestStudy = caseStudies[0] || null;

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-navy-950 via-slate-900 to-navy-950 text-white flex flex-col justify-center py-12 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full relative z-10 space-y-8 sm:space-y-12 text-center">
        {/* Radar / Compass Navigation Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/20 border border-brand-orange/40 text-brand-orange text-xs font-extrabold uppercase tracking-wider shadow-sm animate-pulse">
          <Compass className="w-4 h-4 animate-spin-slow" />
          <span>Navigational Course Correction</span>
        </div>

        {/* 404 Headline */}
        <div className="space-y-3">
          <div className="text-7xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
            4<span className="text-brand-orange">0</span>4
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Off-Course Coordinates Detected
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            The page or case study you were seeking isn't here. But as we learned in Psycho-Cybernetics:
            <span className="text-slate-100 font-semibold block mt-1">
              "A ship is off-course 90% of the voyage. Course corrections are what lead to the destination."
            </span>
          </p>
        </div>

        {/* Quick Navigation Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-orange-glow transition-all active:scale-95 flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home Harbor</span>
          </Link>
          <Link
            to="/past-case-studies"
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/15 transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-brand-orange" />
            <span>Browse Case Archive</span>
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold border border-slate-700 transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Smart Spotlight: Latest Case Study Recommendation Card */}
        {latestStudy && (
          <div className="pt-4 max-w-2xl mx-auto text-left">
            <div className="text-center mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                <span>Recommended Recalibration: Latest Case Study</span>
              </span>
            </div>

            <div
              onClick={() => setSelectedStudy(latestStudy)}
              className="bg-navy-900/90 hover:bg-navy-850 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-700 hover:border-brand-orange/50 shadow-xl transition-all cursor-pointer group flex flex-col sm:flex-row gap-4 items-center"
            >
              <div className="w-full sm:w-36 h-28 sm:h-24 rounded-xl overflow-hidden bg-slate-800 shrink-0 relative">
                <img
                  src={latestStudy.imageUrl}
                  alt={latestStudy.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/cih-photo-1.jpg';
                  }}
                />
                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-brand-orange text-white text-[9px] font-extrabold uppercase shadow">
                  Week {latestStudy.weekNumber}
                </span>
              </div>

              <div className="flex-1 space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                    LATEST SESSION
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {latestStudy.date}
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-orange transition-colors line-clamp-1">
                  {latestStudy.title}
                </h2>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {latestStudy.excerpt}
                </p>
                <div className="pt-1 text-xs font-bold text-brand-orange flex items-center justify-center sm:justify-start gap-1">
                  <span>Open Case Study Modal</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Helpful Footnote Grid */}
        <div className="pt-4 border-t border-slate-800 max-w-xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
          <Link
            to="/register"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-brand-orange" />
            <span>Register Free Seat</span>
          </Link>
          <Link
            to="/about"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>About Program</span>
          </Link>
          <Link
            to="/faq"
            className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Visit FAQ</span>
          </Link>
        </div>
      </div>

      {/* Case Study Modal */}
      <CaseStudyModal
        study={selectedStudy}
        onClose={() => setSelectedStudy(null)}
      />
    </div>
  );
};
