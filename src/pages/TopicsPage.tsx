import React, { useState } from 'react';
import { 
  Lightbulb, 
  Briefcase, 
  ShieldCheck, 
  Users, 
  Megaphone, 
  Layers, 
  ArrowRight, 
  Calendar, 
  Sparkles,
  Info,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { topicModules } from '../data/initialData';
import { getStoredUpcomingSession } from '../services/storage';
import { TopicModule, UpcomingSession } from '../types';
import { TopicDetailModal } from '../components/common/TopicDetailModal';
import { WednesdayCountdown } from '../components/common/WednesdayCountdown';
import { Link } from 'react-router-dom';

export const TopicsPage: React.FC = () => {
  const [upcomingSession] = useState<UpcomingSession>(getStoredUpcomingSession());
  const [selectedTopic, setSelectedTopic] = useState<TopicModule | null>(null);
  const [upcomingModalOpen, setUpcomingModalOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<string>('ALL');
  const [mobileVisibleCount, setMobileVisibleCount] = useState<number>(4);

  const themes = [
    'ALL',
    'Tech & Artificial Intelligence',
    'Ethics & Leadership',
    'Cognitive Agility & Mindset',
    'Personal Growth & Life Skills'
  ];

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'lightbulb':
        return Lightbulb;
      case 'briefcase':
        return Briefcase;
      case 'shield':
        return ShieldCheck;
      case 'handshake':
        return Users;
      case 'megaphone':
        return Megaphone;
      default:
        return Layers;
    }
  };

  const filteredTopics = activeTheme === 'ALL' 
    ? topicModules 
    : topicModules.filter(m => m.theme === activeTheme);

  return (
    <div className="min-h-screen bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-xs font-bold text-brand-orange">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Structured Curriculum Themes</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-navy-900 tracking-tight">
            Themes & Topics Syllabus
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Explore the core themes of the CIH Case Study Mentorship Program. Each theme contains focused topics designed to build decision agility, technical awareness, and authentic leadership skills.
          </p>
        </div>

        {/* Highlight Banner for Next Wednesday */}
        <div className="relative rounded-3xl bg-navy-900 text-white p-8 sm:p-10 shadow-xl overflow-hidden border border-navy-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <WednesdayCountdown />
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Week 17 Session</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {upcomingSession.topicTitle}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {upcomingSession.description}
              </p>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-brand-orange" />
                  {upcomingSession.dateStr}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <button
                onClick={() => setUpcomingModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-navy-900 text-sm font-bold shadow-md transition-all active:scale-95 text-center"
              >
                View Details
              </button>
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold shadow-md transition-all active:scale-95 text-center"
              >
                Register Seat
              </Link>
            </div>
          </div>
        </div>

        {/* Core Curriculum Header & Theme Filters */}
        <div className="space-y-8 pt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-navy-900 tracking-tight">
                Curriculum Themes
              </h2>
              <p className="text-xs text-slate-500 font-medium">Filter topics by overarching program theme</p>
            </div>
            
            {/* Theme Tabs */}
            <div className="flex flex-wrap gap-2">
              {themes.map(t => (
                <button
                  key={t}
                  onClick={() => {
                    setActiveTheme(t);
                    setMobileVisibleCount(4);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                    activeTheme === t
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t === 'ALL' ? 'All Themes' : t}
                </button>
              ))}
            </div>
          </div>

          {/* Topics Grid with Photographs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTopics.map((module, idx) => {
              const Icon = getModuleIcon(module.iconName);
              const cardImg = module.imageUrl || '/images/cih-photo-1.jpg';
              return (
                <div
                  key={module.id}
                  onClick={() => setSelectedTopic(module)}
                  className={`card-hover-effect cursor-pointer rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-brand-orange/40 hover:shadow-xl justify-between overflow-hidden group transition-all duration-300 ${
                    idx >= mobileVisibleCount ? 'hidden md:flex' : 'flex'
                  } flex-col`}
                >
                  <div>
                    {/* Photograph Container */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-navy-900">
                      <img
                        src={cardImg}
                        alt={module.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/cih-photo-1.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/20 to-transparent" />
                      
                      {/* Theme Badge */}
                      <div className="absolute top-3 left-3 bg-brand-orange text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow">
                        {module.theme || module.category}
                      </div>

                      {/* Icon Floating Badge */}
                      <div className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-navy-900 text-white flex items-center justify-center shadow-lg border border-white/20">
                        <Icon className="w-5 h-5 text-brand-orange" />
                      </div>

                      {/* Duration Tag */}
                      {module.duration && (
                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-navy-900 text-[11px] font-extrabold px-2.5 py-0.5 rounded-md shadow-sm">
                          {module.duration}
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-3">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Topic: {module.category}
                      </div>
                      <h3 className="text-xl font-bold text-navy-900 group-hover:text-brand-orange transition-colors leading-snug">
                        {module.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {module.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-orange">
                    <span>Inspect Syllabus & Outcomes</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile "See More Topics" Button */}
          {filteredTopics.length > 4 && (
            <div className="flex md:hidden justify-center pt-2">
              {mobileVisibleCount < filteredTopics.length ? (
                <button
                  onClick={() => setMobileVisibleCount(filteredTopics.length)}
                  className="w-full py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm border border-slate-200"
                >
                  <span>See More Topics ({filteredTopics.length - mobileVisibleCount} more)</span>
                  <ChevronDown className="w-4 h-4 text-brand-orange" />
                </button>
              ) : (
                <button
                  onClick={() => setMobileVisibleCount(4)}
                  className="w-full py-3 px-5 rounded-2xl bg-white border border-slate-200 text-slate-600 text-xs font-semibold transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Show Fewer Topics</span>
                  <ChevronUp className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Topic Detail Modal */}
      <TopicDetailModal
        topic={selectedTopic}
        onClose={() => setSelectedTopic(null)}
      />

      {/* Upcoming Session Details Modal */}
      {upcomingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-orange text-white text-xs font-bold uppercase">
                {upcomingSession.badgeText}
              </div>
              <button
                onClick={() => setUpcomingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕ Close
              </button>
            </div>

            <h3 className="text-2xl font-bold text-navy-900 mb-3">{upcomingSession.topicTitle}</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {upcomingSession.detailedOverview}
            </p>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2.5 mb-6 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-orange" />
                <span className="font-bold">Schedule:</span> Every Wednesday at 10:00 AM – 4:00 PM (WAT)
              </div>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-brand-orange" />
                <span className="font-bold">Facilitators:</span> {upcomingSession.facilitator}
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-orange" />
                <span className="font-bold">Venue:</span> {upcomingSession.location}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setUpcomingModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-navy-900"
              >
                Dismiss
              </button>
              <Link
                to="/register"
                onClick={() => setUpcomingModalOpen(false)}
                className="px-6 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold rounded-xl shadow-md"
              >
                Register for this Session
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
