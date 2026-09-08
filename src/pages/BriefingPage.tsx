import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Globe, 
  CheckCircle2, 
  Scale, 
  Target, 
  UserCheck, 
  ArrowRight, 
  Sparkles, 
  Award, 
  Quote, 
  Shield, 
  Briefcase, 
  Star,
  ChevronDown
} from 'lucide-react';
import { COACH_IMAGES } from '../data/coachImages';

export const BriefingPage: React.FC = () => {
  const [showAllTeam, setShowAllTeam] = useState(false);
  const [showAllPillars, setShowAllPillars] = useState(false);
  const pillars = [
    {
      title: 'Mentorship',
      icon: UserCheck,
      color: 'bg-blue-50 text-blue-700',
      description: 'Direct guidance from industry professionals who have navigated similar challenges.'
    },
    {
      title: 'Healthy Decision-making',
      icon: Scale,
      color: 'bg-indigo-50 text-indigo-700',
      description: 'Frameworks to analyze complex situations and make choices aligned with your values.'
    },
    {
      title: 'IKIGAI Discovery',
      icon: Target,
      color: 'bg-teal-50 text-teal-700',
      description: 'Structured exercises to find the intersection of passion, mission, vocation, and profession.'
    },
    {
      title: 'Networking',
      icon: Users,
      color: 'bg-amber-50 text-amber-700',
      description: 'Build meaningful connections with ambitious peers and established mentors.'
    }
  ];

  interface TeamMember {
    name: string;
    role: string;
    image: string;
    bio: string;
    linkedin?: string;
  }

  const teamMembers: TeamMember[] = [
    {
      name: 'Adewale Oseni',
      role: 'Co-Founder & On-Site Coach',
      image: COACH_IMAGES.adewale,
      bio: 'Co-Founder and on-site coach leading youth empowerment, cognitive decision science, and community mentorship frameworks at Community Innovation Hub.',
      linkedin: 'https://www.linkedin.com/in/adewalepaul'
    },
    {
      name: 'Soji Megbowon',
      role: 'Co-Founder & Lead Coach',
      image: COACH_IMAGES.soji,
      bio: 'Co-Founder and lead coach guiding interactive scenario analysis, strategic innovation, and personal growth cohorts for young leaders.',
      linkedin: 'https://www.linkedin.com/in/soji-megbowon-50a04269'
    },
    {
      name: 'Esther Ajayi',
      role: 'Coach',
      image: COACH_IMAGES.esther,
      bio: 'Guiding personal development, mindset transformation, and impactful coaching engagements for Community Innovation Hub fellows.',
      linkedin: 'https://www.linkedin.com/in/esther-ajayi-28600a143'
    },
    {
      name: 'Kehinde Ajasa',
      role: 'Vision Lead & Coach',
      image: COACH_IMAGES.kehinde,
      bio: 'Vision Lead and coach driving high-impact innovation, youth leadership transformation, and strategic direction at Community Innovation Hub.',
      linkedin: 'https://www.linkedin.com/in/kehinde-ajasa'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 0. Welcome Section (Hidden on mobile) */}
      <div className="hidden sm:block bg-slate-900 text-white py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <p className="text-sm sm:text-base font-semibold text-slate-100">
              Welcome to the Official CIH Case Study Mentorship Program
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Community Innovation Hub • Weekly Sessions
          </span>
        </div>
      </div>

      {/* 1. Hero Section */}
      <section className="relative bg-navy-950 text-white py-12 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-navy-800 overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/images/cih-photo-13.jpg"
            alt="Mentorship Hub Background"
            className="w-full h-full object-cover opacity-60 scale-105 transform filter"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 via-navy-950/50 to-navy-950/85" />
          <div className="hero-glow opacity-60" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange text-white text-[11px] sm:text-xs font-extrabold shadow-md">
              <Sparkles className="w-3 h-3" />
              <span>ABOUT THE PROGRAM</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight uppercase">
            Bridging Life Skills & Mentorship
          </h1>

          <p className="text-xs sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            <span className="sm:hidden">
              CIH Case Study is a weekly Wednesday forum for ages 14+ to analyze real-world challenges and gain 1-on-1 mentorship.
            </span>
            <span className="hidden sm:inline">
              The Community Innovation Hub (CIH) Case Study program is a weekly Wednesday interactive forum designed for individuals aged 14 and above to analyze real-world challenges, master decision science, and gain personal 1-on-1 mentorship.
            </span>
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/topics"
              className="inline-flex items-center gap-1.5 px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs sm:text-base font-bold shadow-lg hover:shadow-orange-glow transition-all active:scale-95"
            >
              <span>Explore Syllabus Themes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/mentorship"
              className="inline-flex items-center gap-1.5 px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-xl bg-white text-navy-950 hover:bg-slate-100 text-xs sm:text-base font-bold shadow-md transition-all active:scale-95"
            >
              <span>Personal Mentorship</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. WHAT IS CASE STUDY CORE SECTION */}
      <section className="py-10 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy-950 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 mb-10 sm:mb-16 shadow-2xl relative overflow-hidden border border-navy-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-orange/20 text-brand-orange text-[10px] sm:text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Program Core</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              WHAT IS CASE STUDY?
            </h2>
            <p className="text-slate-300 text-xs sm:text-lg leading-relaxed font-normal">
              A <strong>CIH Case Study</strong> is an immersive weekly scenario breakdown where participants step into the shoes of leaders, innovators, and decision-makers facing high-stakes real-world dilemmas.
            </p>
            <p className="hidden sm:block text-slate-300 text-sm sm:text-base leading-relaxed">
              Instead of passive lectures, attendees engage in peer breakout pods, debate ethical dilemmas, apply first-principles reasoning, and synthesize actionable growth frameworks.
            </p>
          </div>
        </div>

        {/* Participant Categories */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Participant Categories
          </h2>
          <p className="text-slate-600 text-xs sm:text-lg mt-1.5 sm:mt-3">
            Open to anyone aged 14 and above looking to elevate their leadership, ethics, and career trajectory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 mb-12 sm:mb-20">
          {/* Alumni / Past Natives Card */}
          <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-10 bg-white border border-slate-200/80 shadow-md flex flex-col justify-between relative overflow-hidden group hover:border-brand-orange/40 transition-colors">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-navy-900 text-white flex items-center justify-center shadow-md shrink-0">
                  <Users className="w-5 h-5 sm:w-7 sm:h-7 text-brand-orange" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-navy-900">Alumni / Past Natives</h3>
                  <span className="text-[11px] sm:text-xs text-slate-400 font-semibold uppercase">Returning Community Members</span>
                </div>
              </div>

              <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
                For past hub natives and returning alumni. Lead breakout pods, mentor first-time guests, and engage in advanced case deliberations.
              </p>

              <div className="space-y-2 sm:space-y-3.5 pt-1">
                {[
                  'Peer Pod Facilitation & Leadership',
                  'Priority 1-on-1 Mentorship Matching',
                  'Direct Collaboration on Community Projects'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Alumni Track</span>
              <Link to="/register" className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1">
                Register as Alumni <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* GUEST Card */}
          <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-10 bg-blue-50/50 border border-blue-100 shadow-md flex flex-col justify-between relative overflow-hidden group hover:border-blue-300 transition-colors">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center shadow-sm shrink-0">
                  <Globe className="w-5 h-5 sm:w-7 sm:h-7 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-navy-900">GUEST</h3>
                  <span className="text-[11px] sm:text-xs text-slate-500 font-semibold uppercase">New & First-Time Attendees</span>
                </div>
              </div>

              <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
                Perfect for first-time visitors, students, and early-career professionals. Experience live case study sessions and network with mentors.
              </p>

              <div className="space-y-2 sm:space-y-3.5 pt-1">
                {[
                  'Access to Weekly Plenary Sessions',
                  'Interactive Group Discussions',
                  'Apply for Personal 1-on-1 Mentorship'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-navy-700 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-blue-100 flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Open Community Track</span>
              <Link to="/register" className="text-xs font-bold text-navy-900 hover:underline flex items-center gap-1">
                Register as GUEST <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3. LETTER FROM THE FOUNDER (PRESERVED & BEAUTIFIED) */}
        <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-14 shadow-2xl relative overflow-hidden border border-navy-800 my-10 sm:my-16">
          <div className="absolute top-0 right-0 p-8 text-brand-orange/10 pointer-events-none hidden sm:block">
            <Quote className="w-48 h-48" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-orange/20 text-brand-orange text-[10px] sm:text-xs font-extrabold uppercase tracking-wider">
              <Star className="w-3 h-3 text-brand-orange" />
              <span>LEADERSHIP PERSPECTIVE</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              LETTER FROM THE FOUNDER
            </h2>

            <div className="space-y-3 sm:space-y-4 text-slate-300 text-xs sm:text-base leading-relaxed">
              <p>
                "At Community Innovation Hub (CIH), we believe that true leadership isn't taught in abstract textbooks—it is forged when young individuals analyze real dilemmas, articulate reasoned arguments, and take accountability for their decisions."
              </p>
              <p>
                "Our Wednesday Case Study sessions were birthed to bridge the gap between academic theory and practical life mastery. Every single week, young minds gather to debate ethics, build financial intelligence, and navigate real-world scenarios in an environment anchored on mentorship and excellence."
              </p>
              <p className="hidden sm:block">
                "Whether you are joining us as a returning native or stepping into the hub as a first-time guest, our promise to you is simple: you will leave every session with sharper cognitive frameworks, lifelong friendships, and actionable guidance for your journey."
              </p>
            </div>

            <div className="pt-4 sm:pt-6 border-t border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-sm sm:text-lg font-bold text-brand-orange">Community Innovation Hub Leadership</h4>
                <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">Abesan Estate, Ipaja, Lagos, Nigeria</p>
              </div>
              <img 
                src="/images/cih-logo.png" 
                alt="CIH Official Logo" 
                className="h-8 sm:h-10 w-auto object-contain opacity-90"
              />
            </div>
          </div>
        </div>

        {/* 4. TEAM & MANAGEMENT SECTION */}
        <div className="my-10 sm:my-16">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-brand-orange">
              PEOPLE BEHIND THE VISION
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-900 tracking-tight mt-1 sm:mt-2">
              Team & Management Behind CIH
            </h2>
            <p className="text-slate-600 text-xs sm:text-lg mt-1 sm:mt-2">
              Meet the dedicated facilitators, coordinators, and mentors driving Community Innovation Hub's weekly case study program.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {teamMembers.map((member, idx) => (
              <div 
                key={member.name}
                className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-md hover:shadow-xl hover:border-brand-orange/40 transition-all ${
                  !showAllTeam && idx >= 2 ? 'hidden sm:flex' : 'flex'
                } flex-col justify-between space-y-3 sm:space-y-4 group`}
              >
                <div className="space-y-3 sm:space-y-4">
                  <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-brand-orange text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  <div>
                    {member.linkedin ? (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base sm:text-lg font-extrabold text-navy-900 hover:text-brand-orange hover:underline transition-colors block"
                        title={`View ${member.name}'s LinkedIn Profile`}
                      >
                        {member.name}
                      </a>
                    ) : (
                      <h3 className="text-base sm:text-lg font-extrabold text-navy-900">{member.name}</h3>
                    )}
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-3 sm:line-clamp-none">{member.bio}</p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-400 font-semibold">
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-brand-orange" /> CIH Coach</span>
                  <span className="text-navy-900 font-bold">On-Site</span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile See More Team Members */}
          {teamMembers.length > 2 && (
            <div className="flex sm:hidden justify-center pt-3">
              <button
                onClick={() => setShowAllTeam(!showAllTeam)}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm border border-slate-200/80"
              >
                <span>{showAllTeam ? 'Show Fewer Members' : `See More Team Members (${teamMembers.length - 2} more)`}</span>
                <ChevronDown className={`w-4 h-4 text-brand-orange transition-transform duration-200 ${showAllTeam ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. What You'll Gain */}
      <section className="py-12 sm:py-20 bg-slate-50 border-y border-slate-200/60 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
              What You'll Gain
            </h2>
            <p className="text-slate-600 text-xs sm:text-lg mt-1.5 sm:mt-3">
              Four core pillars of development integrated into every case study.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className={`card-hover-effect rounded-2xl bg-white p-5 sm:p-7 border border-slate-200/80 shadow-sm ${
                    !showAllPillars && idx >= 2 ? 'hidden sm:flex' : 'flex'
                  } flex-col justify-between space-y-3 sm:space-y-4`}
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${pillar.color}`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-navy-900">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile See More Pillars */}
          {pillars.length > 2 && (
            <div className="flex sm:hidden justify-center pt-3">
              <button
                onClick={() => setShowAllPillars(!showAllPillars)}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-navy-900 text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm border border-slate-200"
              >
                <span>{showAllPillars ? 'Show Fewer Pillars' : `See More Core Pillars (${pillars.length - 2} more)`}</span>
                <ChevronDown className={`w-4 h-4 text-brand-orange transition-transform duration-200 ${showAllPillars ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 6. Bottom CTA Section */}
      <section className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mx-auto mb-2">
          <Award className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          Ready to take the next step?
        </h2>
        <p className="text-slate-600 text-xs sm:text-lg max-w-xl mx-auto">
          Join the upcoming cohort and start building the foundation for your future.
        </p>
        <div className="pt-2">
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm sm:text-base font-bold shadow-xl hover:shadow-orange-glow transition-all active:scale-95"
          >
            Register for Case Study
          </Link>
        </div>
      </section>
    </div>
  );
};
