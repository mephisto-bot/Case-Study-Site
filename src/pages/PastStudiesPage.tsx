import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Search, 
  ChevronDown, 
  Tag, 
  Sparkles,
  Award,
  Clock,
  TrendingUp,
  Brain,
  Mic,
  BadgeCheck,
  Lightbulb,
  Cpu,
  Coins,
  Globe,
  MessageSquare,
  Leaf,
  ShieldAlert,
  Heart,
  Play
} from 'lucide-react';
import { getStoredCaseStudies } from '../services/storage';
import { CaseStudy } from '../types';
import { CaseStudyModal } from '../components/common/CaseStudyModal';

export const PastStudiesPage: React.FC = () => {
  const [caseStudies] = useState<CaseStudy[]>(getStoredCaseStudies());
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [activeStudy, setActiveStudy] = useState<CaseStudy | null>(null);
  const [showAllTags, setShowAllTags] = useState<boolean>(false);

  // Auto-open study if shared via link with ?study=id
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const studyId = params.get('study');
    if (studyId) {
      const match = caseStudies.find(
        (s) => s.id.toLowerCase() === studyId.toLowerCase()
      );
      if (match) {
        setActiveStudy(match);
      }
    }
  }, [caseStudies]);

  const sectors = [
    'All',
    'Ethics & Leadership',
    'Personal Growth & EQ',
    'Tech & Artificial Intelligence',
    'Communication & Media',
    'Finance & Life Skills',
    'Social Impact & SDGs',
    'Mental Health & Wellbeing',
    'Career & Personal Growth'
  ];

  const topicsList = [
    { title: 'Leadership & Adaptive Governance', tag: 'Leadership', icon: Award, desc: 'Decentralized leadership, accountability, and decision-making under uncertainty.' },
    { title: 'Time Management & Prioritization', tag: 'Productivity', icon: Clock, desc: 'Eisenhower Matrix, Deep Work principles, and time-blocking for high achievers.' },
    { title: 'Capacity Building & Institutional Growth', tag: 'Growth', icon: TrendingUp, desc: 'Empowering community organizations, mentorship pipelines, and sustainable scaling.' },
    { title: 'Emotional Intelligence & IQ vs EQ', tag: 'EQ vs IQ', icon: Brain, desc: 'Self-awareness, empathy, and social regulation outperforming technical intellect.' },
    { title: 'Public Speaking & Rhetoric', tag: 'Public Speaking', icon: Mic, desc: 'Vocal projection, Ethos-Pathos-Logos narrative curves, and stage confidence.' },
    { title: 'Personal Branding & Career Visibility', tag: 'Branding', icon: BadgeCheck, desc: 'Crafting a unique value proposition, digital portfolios, and authentic self-promotion.' },
    { title: 'Structured Ideation & Design Thinking', tag: 'Ideation', icon: Lightbulb, desc: 'SCAMPER methodology, mind mapping, and turning concepts into actionable plans.' },
    { title: 'Can Machines Think? (Alan Turing)', tag: 'Turing & AI', icon: Cpu, desc: 'Alan Turing’s biography, the Imitation Game, machine consciousness, and AI ethics.' },
    { title: 'Financial Literacy & Capital Independence', tag: 'Finance', icon: Coins, desc: '50/30/20 budgeting, inflation hedges, asset allocation, and avoiding financial traps.' },
    { title: 'Accessing Global Opportunities & Networking', tag: 'Opportunities', icon: Globe, desc: 'Unlocking international fellowships, scholarships, venture grants, and remote roles.' },
    { title: 'Effective Communication & Conflict Resolution', tag: 'Communication', icon: MessageSquare, desc: 'Radical candor, SBI feedback models, and resolving high-pressure team stalemates.' },
    { title: 'Sustainable Development Goals (SDGs)', tag: 'SDGs', icon: Leaf, desc: 'Youth-led action for UN SDG 4 (Education), SDG 8 (Decent Work), and SDG 13 (Climate).' },
    { title: 'Overcoming Bullying & Toxic Dynamics', tag: 'Anti-Bullying', icon: ShieldAlert, desc: 'Addressing relational aggression, workplace harassment, and zero-tolerance policies.' },
    { title: 'Mental Health Resilience & Self-Care', tag: 'Mental Health', icon: Heart, desc: 'De-stigmatizing mental health, burnout prevention, and psychological safety.' },
  ];

  const filteredStudies = caseStudies.filter((study) => {
    const matchesSector = selectedSector === 'All' || study.sector.toLowerCase().includes(selectedSector.toLowerCase());
    const matchesSearch = 
      study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.sector.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  const displayedStudies = filteredStudies.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-navy-900">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            <span>Comprehensive Curriculum Archive</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-navy-900 tracking-tight">
            Past Case Studies
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Explore our archive of real-world case studies and life skills modules. Dissect real scenarios, learn proven frameworks, and build core leadership competencies.
          </p>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-b border-slate-100 pb-6">
          {/* Sector Pill Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {sectors.map((sector) => (
              <button
                key={sector}
                onClick={() => {
                  setSelectedSector(sector);
                  setVisibleCount(6);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedSector === sector
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sector}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search case archives & topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange"
            />
          </div>
        </div>

        {/* Case Studies Grid */}
        {displayedStudies.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200/80">
            <p className="text-base font-semibold text-slate-600">No case studies found matching your criteria.</p>
            <button
              onClick={() => { setSelectedSector('All'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 text-xs font-bold text-brand-orange bg-brand-orange-light rounded-lg hover:bg-brand-orange hover:text-white transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedStudies.map((study) => (
              <div
                key={study.id}
                onClick={() => setActiveStudy(study)}
                className="card-hover-effect cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:border-brand-orange/30 flex flex-col group justify-between"
              >
                {/* Photo & Date Badge */}
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-navy-900">
                    <img
                      src={study.imageUrl}
                      alt={study.title}
                      className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/cih-photo-1.jpg';
                      }}
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {(study.videoUrl || study.youtubeUrl || study.youtubeVideoId) && (
                        <span className="px-2 py-0.5 rounded-md bg-brand-orange text-white text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                          <Play className="w-2.5 h-2.5 fill-white" />
                          <span>VIDEO</span>
                        </span>
                      )}
                      <div className="px-3 py-1 rounded-md bg-navy-900/90 backdrop-blur-sm text-white text-xs font-bold">
                        {study.date}
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                      {study.sector}
                    </span>

                    <h3 className="text-xl font-bold text-navy-900 leading-snug group-hover:text-brand-orange transition-colors">
                      {study.title}
                    </h3>

                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {study.excerpt}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Link */}
                <div className="px-6 pb-6 pt-2">
                  <div className="text-sm font-bold text-brand-orange flex items-center gap-1.5 group-hover:underline">
                    <span>Read Case Study</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < filteredStudies.length && (
          <div className="text-center pt-8">
            <button
              onClick={() => setVisibleCount((prev) => prev + 3)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white border border-slate-300 hover:border-navy-900 text-navy-900 text-sm font-bold shadow-sm transition-all active:scale-95"
            >
              <span>Load More Studies</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 5. Detailed Covered Topics Section */}
        <section className="pt-10 sm:pt-16 border-t border-slate-200/80 space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-orange">
                Curriculum Overview
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight mt-1">
                Topics Covered in Case Studies
              </h2>
              <p className="text-slate-600 text-xs sm:text-base mt-1 sm:mt-2 max-w-2xl">
                Our Wednesday sessions dive into essential personal growth, ethical leadership, and professional life skills:
              </p>
            </div>
            <div className="shrink-0 hidden sm:block">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 text-brand-orange font-bold text-xs border border-orange-200">
                <Sparkles className="w-3.5 h-3.5" />
                + More Topics Announced Weekly
              </span>
            </div>
          </div>

          {/* Mobile View: Clean, sleek Tag Cloud with See More */}
          <div className="flex sm:hidden flex-wrap gap-2">
            {(showAllTags ? topicsList : topicsList.slice(0, 6)).map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(item.tag)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-colors flex items-center gap-1.5"
              >
                <span>{item.tag}</span>
                <span className="text-[10px] text-slate-400 font-normal">→</span>
              </button>
            ))}
          </div>

          {topicsList.length > 6 && (
            <div className="flex sm:hidden justify-center pt-1">
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 border border-slate-200"
              >
                <span>{showAllTags ? 'Show Fewer Topics' : `See More Topics (${topicsList.length - 6} more)`}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-brand-orange transition-transform duration-200 ${showAllTags ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}

          {/* Desktop Topics Grid */}
          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topicsList.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSearchQuery(item.tag)}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-brand-orange/40 hover:shadow-md transition-all cursor-pointer group space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-navy-900 text-[11px] font-extrabold border border-slate-200 uppercase tracking-wider group-hover:bg-brand-orange group-hover:text-white group-hover:border-brand-orange transition-colors">
                    {item.tag}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-orange group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-base font-bold text-navy-900 group-hover:text-brand-orange transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Case Study Full Writeup Modal */}
      <CaseStudyModal
        study={activeStudy}
        onClose={() => setActiveStudy(null)}
      />
    </div>
  );
};
