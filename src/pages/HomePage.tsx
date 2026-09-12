import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Info, 
  Layers, 
  BookOpen, 
  UserCheck, 
  HelpCircle, 
  ArrowRight, 
  Lightbulb, 
  Calendar, 
  Sparkles, 
  Clock,
  ChevronDown,
  Play,
  Video
} from 'lucide-react';
import { getStoredCaseStudies, getStoredUpcomingSession } from '../services/storage';
import { CaseStudy, UpcomingSession } from '../types';
import { CaseStudyModal } from '../components/common/CaseStudyModal';
import { WednesdayCountdown } from '../components/common/WednesdayCountdown';
import { TopicSuggestionModal } from '../components/common/TopicSuggestionModal';
import { TestimonialsSection } from '../components/common/TestimonialsSection';
import { SessionVideoPlayer } from '../components/common/SessionVideoPlayer';

export const HomePage: React.FC = () => {
  const [caseStudies] = useState<CaseStudy[]>(getStoredCaseStudies());
  const [upcomingSession] = useState<UpcomingSession>(getStoredUpcomingSession());
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [upcomingModalOpen, setUpcomingModalOpen] = useState(false);
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [showAllResources, setShowAllResources] = useState(false);
  const [showAllHighlights, setShowAllHighlights] = useState(false);

  const sortedStudies = React.useMemo(() => {
    return [...caseStudies].sort((a, b) => (b.weekNumber || 0) - (a.weekNumber || 0));
  }, [caseStudies]);

  const recentStudy = sortedStudies[0] || null;
  const videoStudy = sortedStudies.find(c => c.videoUrl || c.youtubeUrl || c.youtubeVideoId) || recentStudy;

  // Highlights cards for home page
  const highlights = [
    caseStudies.find(c => c.id === 'can-machines-think-turing') || caseStudies[0],
    caseStudies.find(c => c.id === 'iq-vs-eq-leadership') || caseStudies[1],
    caseStudies.find(c => c.id === 'financial-literacy-youth') || caseStudies[2],
  ].filter(Boolean);

  const resourceCards = [
    {
      title: 'What is Case Study',
      icon: Info,
      path: '/about',
      highlighted: false,
    },
    {
      title: 'Syllabus & Themes',
      icon: Layers,
      path: '/topics',
      highlighted: false,
    },
    {
      title: 'Past Studies',
      icon: BookOpen,
      path: '/past-case-studies',
      highlighted: false,
    },
    {
      title: 'Register',
      icon: UserCheck,
      path: '/register',
      highlighted: true,
    },
    {
      title: 'FAQ',
      icon: HelpCircle,
      path: '/faq',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 0. Welcome Section (Hidden on mobile) */}
      <div className="hidden sm:block bg-slate-900 text-white py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-sm sm:text-base font-semibold text-slate-100">
            Welcome to Community Innovation Hub — Empowering young minds through weekly case study mentorship!
          </p>
          <span className="text-xs font-semibold text-slate-400 shrink-0">
            Community Innovation Hub • Weekly Sessions
          </span>
        </div>
      </div>

      {/* 1. Hero Section (Streamlined on mobile, rich on desktop) */}
      <section className="relative bg-navy-950 text-white py-12 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-navy-800">
        {/* Background Image with Clear Lighter Blue Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/images/cih-photo-11.jpg"
            alt="CIH Case Study Participants"
            className="w-full h-full object-cover opacity-60 scale-105 transform filter"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/50 via-navy-950/40 to-navy-950/75" />
          <div className="hero-glow opacity-60" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          {/* Pill Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange text-white text-[11px] sm:text-xs font-extrabold shadow-md">
              <span>AGE 14+ ONLY</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight uppercase leading-tight sm:leading-[1.15]">
            CIH Case Study Mentorship
          </h1>

          {/* Subheadline (Concise on mobile, detailed on desktop) */}
          <p className="text-xs sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            <span className="sm:hidden">
              A weekly Wednesday program for life lessons, cognitive decision science, and personal mentorship for young minds.
            </span>
            <span className="hidden sm:inline">
              A weekly Wednesday program for life lessons, mentorship, and healthy decisions. Engage with real-world scenarios designed to build critical thinking and leadership skills.
            </span>
          </p>

          {/* Hero CTAs */}
          <div className="pt-2 sm:pt-4">
            {/* Mobile CTAs: Sleek 2-column grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:hidden">
              <Link
                to="/register"
                className="py-3 px-4 rounded-xl bg-brand-orange text-white text-xs font-bold text-center shadow-md active:scale-95 transition-transform"
              >
                Register Seat
              </Link>
              <Link
                to="/mentorship"
                className="py-3 px-4 rounded-xl bg-white text-navy-950 text-xs font-bold text-center shadow-md active:scale-95 transition-transform"
              >
                Mentorship
              </Link>
            </div>

            {/* Desktop CTAs: Spacious flex buttons */}
            <div className="hidden sm:flex flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-base font-bold shadow-lg hover:shadow-orange-glow transition-all active:scale-95"
              >
                Register Now
              </Link>
              <Link
                to="/mentorship"
                className="px-8 py-3.5 rounded-xl bg-white text-navy-950 hover:bg-slate-100 text-base font-bold shadow-md transition-all active:scale-95"
              >
                Personal Mentorship
              </Link>
              <Link
                to="/about"
                className="px-8 py-3.5 rounded-xl bg-navy-900/80 hover:bg-navy-800 text-white text-base font-semibold border border-slate-600 hover:border-slate-400 transition-all backdrop-blur-sm"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 Live Session Spotlight (De-cluttered on mobile, full dual-grid on desktop) */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] sm:text-xs font-bold text-navy-900">
                <Sparkles className="w-3 h-3 text-brand-orange" />
                <span>Live Session Spotlight</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-navy-900 tracking-tight mt-1">
                Upcoming Case Study
              </h2>
            </div>
            <p className="hidden sm:block text-xs sm:text-sm text-slate-500 font-semibold">
              Weekly Wednesday Program Status
            </p>
          </div>

          {/* Mobile View: Single Compact Highlight Card (No Noise) */}
          <div className="block lg:hidden">
            <div className="rounded-2xl bg-navy-900 text-white p-5 shadow-lg border border-navy-800 relative space-y-3.5 overflow-hidden">
              <div className="flex items-center justify-between gap-2">
                <WednesdayCountdown />
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  {upcomingSession.weekTitle ? upcomingSession.weekTitle.split('•')[0].trim() : 'Week 19'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {upcomingSession.topicTitle}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  {upcomingSession.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <span className="text-[11px] text-slate-300 flex items-center gap-1 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                  Wednesdays 10am
                </span>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-brand-orange text-white text-xs font-bold shadow active:scale-95"
                >
                  Register Free Seat
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop Dual Grid: Card 1 (Upcoming Wednesday) & Card 2 (Most Recent Study) */}
          <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 1. UPCOMING CASE STUDY CARD WITH LIVE COUNTDOWN TIMER */}
            <div className="relative rounded-3xl bg-navy-900 text-white p-7 sm:p-8 shadow-xl overflow-hidden border border-navy-800 flex flex-col justify-between group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-4 relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <WednesdayCountdown />
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    {upcomingSession.weekTitle ? upcomingSession.weekTitle.split('•')[0].trim() : 'Week 19'}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                    {upcomingSession.topicTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    {upcomingSession.description}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs space-y-1.5 text-slate-200">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <Calendar className="w-4 h-4 text-brand-orange" />
                    {upcomingSession.dateStr || "Every Wednesday • 10:00 AM – 4:00 PM (WAT)"}
                  </div>
                  <p className="text-slate-300">
                    <strong>Venue:</strong> Plot 104, 5th Avenue Abesan Estate, Ipaja, Lagos, Nigeria (Strictly On-Site)
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 relative z-10">
                <button
                  onClick={() => setUpcomingModalOpen(true)}
                  className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>View Full Details</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-orange" />
                </button>
                <Link
                  to="/register"
                  className="px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  Register Free Seat
                </Link>
              </div>
            </div>

            {/* 2. MOST RECENT CASE STUDY CARD */}
            {recentStudy && (
              <div
                onClick={() => setSelectedStudy(recentStudy)}
                className="relative rounded-3xl bg-white p-7 sm:p-8 shadow-md border border-slate-200/80 hover:border-brand-orange/40 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 w-fit shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>MOST RECENT CASE STUDY</span>
                      </span>
                      {(recentStudy.videoUrl || recentStudy.youtubeUrl || recentStudy.youtubeVideoId) && (
                        <span className="px-2.5 py-1 rounded-md bg-brand-orange text-white text-[10px] font-extrabold flex items-center gap-1 shadow-sm shrink-0">
                          <Play className="w-2.5 h-2.5 fill-white" />
                          <span>VIDEO</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-400">
                      {recentStudy.date}
                    </span>
                  </div>

                  <div className="relative h-44 sm:h-48 rounded-2xl overflow-hidden bg-navy-900">
                    <img
                      src={recentStudy.imageUrl}
                      alt={recentStudy.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-navy-900/90 backdrop-blur-sm text-white text-xs font-bold">
                      {recentStudy.sector}
                    </div>
                    {(recentStudy.videoUrl || recentStudy.youtubeUrl || recentStudy.youtubeVideoId) && (
                      <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5">
                        <Play className="w-3 h-3 text-brand-orange fill-brand-orange" />
                        <span>Watch Video</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-navy-900 leading-snug group-hover:text-brand-orange transition-colors">
                      {recentStudy.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {recentStudy.excerpt}
                    </p>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-orange">
                  <span>Read Full Case Breakdown</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 1.8 Featured Session Video Showcase */}
      {videoStudy && (videoStudy.videoUrl || videoStudy.youtubeUrl || videoStudy.youtubeVideoId) && (
        <section className="py-10 sm:py-16 bg-navy-950 text-white border-b border-navy-800 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/20 border border-brand-orange/40 text-brand-orange text-xs font-extrabold uppercase">
                <Play className="w-3 h-3 fill-brand-orange" />
                <span>SESSION VIDEO HIGHLIGHT</span>
              </div>
              
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {videoStudy.videoTitle || `Watch "${videoStudy.title}" Session`}
              </h2>
              
              <p className="text-xs sm:text-base text-slate-300 leading-relaxed">
                {videoStudy.subtitle || videoStudy.excerpt}
              </p>

              <div className="space-y-2 text-xs sm:text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                  <span>High-definition video playback — direct streaming</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                  <span>Live session presentation + peer Q&amp;A deliberations</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setSelectedStudy(videoStudy)}
                  className="px-6 py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-orange-glow transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>Explore Case Details &amp; Photos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/past-case-studies"
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/15 transition-all"
                >
                  Browse Archive
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <SessionVideoPlayer
                videoUrl={videoStudy.videoUrl}
                youtubeUrl={videoStudy.youtubeUrl}
                youtubeVideoId={videoStudy.youtubeVideoId}
                title={videoStudy.videoTitle || videoStudy.title}
                posterUrl={videoStudy.imageUrl}
              />
            </div>
          </div>
        </section>
      )}

      {/* 2. What is Case Study? Section */}
      <section className="py-10 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-navy-900 flex items-center justify-center border border-blue-100/80 shadow-sm">
              <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-navy-900 fill-navy-900/10" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
                What is Case Study?
              </h2>
              <div className="w-10 h-1 bg-brand-orange rounded-full mt-2 sm:mt-3" />
            </div>

            <div className="space-y-3 sm:space-y-4 text-slate-600 text-xs sm:text-lg leading-relaxed">
              <p>
                Case Study is an immersive, scenario-based learning environment. Each Wednesday, participants analyze real-world situations that challenge their decision-making, ethical reasoning, and leadership capabilities.
              </p>
              <p className="hidden sm:block">
                Through guided mentorship and peer collaboration, attendees dissect these scenarios, identifying key life lessons and developing strategies for making healthy, productive decisions in their own lives.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-100 group">
              <img
                src="/images/cih-photo-12.jpg"
                alt="Case Study Participants at CIH Hall"
                className="w-full h-56 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 bg-navy-900/90 backdrop-blur-md text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 border border-white/10">
                <Calendar className="w-3 h-3 text-brand-orange" />
                Every Wednesday • 10:00 AM – 4:00 PM WAT
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Navigate Program Resources (Concise grid on mobile) */}
      <section className="bg-brand-blue-light py-10 sm:py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              Program Resources
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
            {resourceCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  to={card.path}
                  className={`card-hover-effect rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center text-center transition-all ${
                    !showAllResources && idx >= 4 ? 'hidden sm:flex' : 'flex'
                  } ${
                    card.highlighted
                      ? 'bg-brand-orange-light border-2 border-brand-orange/30 shadow-md'
                      : 'bg-white border border-slate-200/80 shadow-sm hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-2.5 sm:mb-4 transition-transform group-hover:scale-110 ${
                      card.highlighted
                        ? 'bg-brand-orange text-white'
                        : 'bg-navy-50 text-navy-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span
                    className={`text-xs sm:text-base font-bold ${
                      card.highlighted ? 'text-brand-orange' : 'text-navy-900'
                    }`}
                  >
                    {card.title}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Mobile See More Resources */}
          {resourceCards.length > 4 && (
            <div className="flex sm:hidden justify-center pt-3">
              <button
                onClick={() => setShowAllResources(!showAllResources)}
                className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
              >
                <span>{showAllResources ? 'Show Fewer Resources' : `See More Resources (${resourceCards.length - 4} more)`}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-brand-orange transition-transform duration-200 ${showAllResources ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. ATTENDEE TESTIMONIALS SECTION (Requirement 2) */}
      <TestimonialsSection />

      {/* 5. Topic Suggestion CTA Banner */}
      <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-xl border border-navy-800 text-white flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
          <div className="space-y-1.5 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-orange/20 text-brand-orange text-[10px] sm:text-xs font-extrabold uppercase">
              <Lightbulb className="w-3 h-3" />
              <span>WHAT WOULD YOU LIKE US TO TEACH?</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              Have a Case Study Topic in Mind?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Write out topics or skillsets you want treated in upcoming Wednesday sessions. CIH mentors review attendee requests every week!
            </p>
          </div>
          <button
            onClick={() => setTopicModalOpen(true)}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-orange-glow transition-all active:scale-95 shrink-0 z-10 flex items-center justify-center gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Suggest a Topic</span>
          </button>
        </div>
      </section>

      {/* 6. Session Highlights Section */}
      <section className="py-10 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-12 gap-2 sm:gap-4">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
              Session Highlights
            </h2>
            <p className="text-slate-500 text-xs sm:text-base mt-1">
              Insights from recent case studies
            </p>
          </div>
          <Link
            to="/past-case-studies"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-orange hover:text-brand-orange-hover group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
          {highlights.map((study, idx) => {
            const weekNum = study.weekNumber || (12 - idx);
            const tags = idx === 0 
              ? ['ETHICS', 'LEADERSHIP'] 
              : idx === 1 
              ? ['TECH', 'PRIVACY'] 
              : ['MENTORSHIP', 'COMMUNICATION'];

            return (
              <div
                key={study.id}
                onClick={() => setSelectedStudy(study)}
                className={`card-hover-effect cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg flex flex-col group ${
                  !showAllHighlights && idx > 1 ? 'hidden md:flex' : 'flex'
                }`}
              >
                {/* Image */}
                <div className="relative h-40 sm:h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={study.imageUrl}
                    alt={study.title}
                    className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/cih-photo-1.jpg';
                    }}
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-navy-900/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider">
                    Week {weekNum}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider border border-blue-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-navy-900 leading-snug group-hover:text-brand-orange transition-colors">
                      {study.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                      {study.excerpt}
                    </p>
                  </div>

                  <div className="pt-1 text-xs font-bold text-brand-orange flex items-center gap-1">
                    Read Case Study <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile See More Highlights Button */}
        {highlights.length > 2 && (
          <div className="flex md:hidden justify-center pt-4">
            <button
              onClick={() => setShowAllHighlights(!showAllHighlights)}
              className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm border border-slate-200/80"
            >
              <span>{showAllHighlights ? 'Show Fewer Highlights' : `See More Highlights (${highlights.length - 2} more)`}</span>
              <ChevronDown className={`w-4 h-4 text-brand-orange transition-transform duration-200 ${showAllHighlights ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </section>

      {/* Case Study Deep-dive Modal */}
      <CaseStudyModal
        study={selectedStudy}
        onClose={() => setSelectedStudy(null)}
      />

      {/* Upcoming Session Details Modal */}
      {upcomingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-orange text-white text-xs font-bold uppercase">
                <Clock className="w-3.5 h-3.5" />
                <span>{upcomingSession.badgeText || "NEXT WEDNESDAY"}</span>
              </div>
              <button
                onClick={() => setUpcomingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕ Close
              </button>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-navy-900 mb-2">{upcomingSession.topicTitle}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {upcomingSession.detailedOverview || upcomingSession.description}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-orange" />
                <span className="font-bold">Schedule:</span> {upcomingSession.dateStr || "Every Wednesday at 10:00 AM (WAT)"}
              </div>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-brand-orange" />
                <span className="font-bold">Facilitators:</span> {upcomingSession.facilitator || "CIH Mentorship Board & Guest Speaker"}
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-orange" />
                <span className="font-bold">Venue:</span> {upcomingSession.location || "Plot 104, 5th Avenue Abesan Estate, Ipaja, Lagos, Nigeria (Strictly On-Site)"}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
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
                Register Free Seat
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Topic Suggestion Modal */}
      <TopicSuggestionModal
        isOpen={topicModalOpen}
        onClose={() => setTopicModalOpen(false)}
      />
    </div>
  );
};
