import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Shield, Sparkles, User, HeartHandshake, GraduationCap } from 'lucide-react';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { useAuth } from '../../context/AuthContext';
import { fetchCloudAdminData } from '../../services/api';
import { UserProfileModal } from '../auth/UserProfileModal';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, isAlumni, isMentorVolunteer, authModalOpen, authModalMode, initialSignupRole, openAuthModal, closeAuthModal, openProfileModal } = useAuth();

  const [pendingCount, setPendingCount] = useState(0);
  // Check if user is any kind of coach / mentor
  const isMentor = Boolean(
    user && (user.isMentorVolunteer || user.isApprovedMentor || user.mentorRole === 'Coach')
  );

  useEffect(() => {
    if (isMentor && user) {
      fetchCloudAdminData()
        .then((data) => {
          const count = (data.mentorshipApplications ?? []).filter(
            (app) =>
              app.status === 'pending' &&
              (
                !app.assignedCoach ||
                app.assignedCoach.toLowerCase() === user.email.toLowerCase() ||
                app.assignedCoach === 'Any Available CIH Coach (Automatic Match)'
              )
          ).length;
          setPendingCount(count);
        })
        .catch((err) => console.warn('Failed to fetch admin data for badge', err));
    } else {
      setPendingCount(0);
    }
  }, [isMentor, user]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'What is Case Study', path: '/about' },
    { name: 'Syllabus & Themes', path: '/topics' },
    { name: 'Mentorship', path: '/mentorship' },
    { name: 'Past Studies', path: '/past-case-studies' },
    { name: 'FAQ', path: '/faq' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const userInitials = user?.fullName 
    ? user.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
            
            {/* Logo + Brand Container */}
            <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0 min-w-0">
              <img 
                src="/images/cih-logo.png" 
                alt="Community Innovation Hub Logo" 
                className="h-8 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform shrink-0" 
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-lg xl:text-xl font-extrabold text-navy-900 tracking-tight leading-none group-hover:text-brand-orange transition-colors truncate">
                    CIH Case Study
                  </span>
                  <span className="hidden md:inline-block px-1.5 py-0.5 rounded bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-[9px] sm:text-[10px] font-extrabold tracking-wider shrink-0">
                    14+
                  </span>
                </div>
                <span className="hidden sm:block text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5 truncate">
                  Mentorship & Life Skills
                </span>
              </div>
            </Link>

            {/* Desktop Navigation (>= 1024px) */}
            <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative text-xs xl:text-sm font-semibold transition-colors py-2 whitespace-nowrap ${
                      active ? 'text-navy-900 font-bold' : 'text-slate-600 hover:text-navy-900'
                    }`}
                  >
                    {link.name}
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange rounded-full animate-fade-in" />
                    )}
                  </Link>
                );
              })}
              {/* Mentor / Coach Desk link — only visible to coaches & mentors */}
              {isMentor && (
                <Link
                  to="/mentorship"
                  className={`relative text-xs xl:text-sm font-semibold transition-colors py-2 whitespace-nowrap flex items-center gap-1.5 ${
                    isActive('/mentorship') ? 'text-navy-900 font-bold' : 'text-brand-orange hover:text-brand-orange/80'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  Mentor Desk
                  {pendingCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                  {isActive('/mentorship') && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange rounded-full animate-fade-in" />
                  )}
                </Link>
              )}
            </nav>

            {/* Desktop Actions (>= 1024px) */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 shrink-0">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-slate-500 hover:text-navy-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Search Site (Ctrl+K)"
              >
                <Search className="w-4 h-4 text-brand-orange" />
                <span className="hidden 2xl:inline text-slate-400">Search</span>
              </button>

              <Link
                to="/admin"
                title="Organizer Portal"
                className="p-2 text-slate-400 hover:text-navy-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <Shield className="w-4 h-4" />
              </Link>

              {/* Authentication Actions */}
              {isAuthenticated && user ? (
                <Link
                  to="/profile"
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 xl:pl-2 xl:pr-3 xl:py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-left group"
                  title="View Detailed Profile"
                >
                  <div className="relative w-6 h-6 xl:w-7 xl:h-7 rounded-lg bg-navy-900 group-hover:bg-brand-orange text-white flex items-center justify-center font-bold text-[11px] xl:text-xs transition-colors shrink-0">
                    {userInitials}
                  </div>
                  {/* Notification badge on avatar (mobile fallback) */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-navy-900 leading-tight truncate max-w-[80px] xl:max-w-[100px]">
                      {user.fullName.split(' ')[0]}
                    </span>
                    <span className="text-[9px] xl:text-[10px] text-brand-orange font-semibold leading-tight">
                      {isMentorVolunteer ? 'Mentor' : (isAlumni ? 'Alumni' : 'Guest')}
                    </span>
                  </div>
                </Link>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-2 rounded-xl text-slate-700 hover:text-navy-900 text-xs font-semibold transition-colors"
                >
                  Sign In
                </button>
              )}

              {/* Main Register Button */}
              {isAuthenticated ? (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-3.5 xl:px-4 py-2 xl:py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold shadow-md hover:shadow-orange-glow transition-all active:scale-95 shrink-0 whitespace-nowrap"
                >
                  Register Seat
                </Link>
              ) : (
                <button
                  onClick={() => openAuthModal('signup', 'guest')}
                  className="inline-flex items-center justify-center px-3.5 xl:px-4 py-2 xl:py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold shadow-md hover:shadow-orange-glow transition-all active:scale-95 shrink-0 whitespace-nowrap"
                >
                  Register Seat
                </button>
              )}
            </div>

            {/* Mobile / Tablet Actions (< 1024px) */}
            <div className="flex lg:hidden items-center gap-1 sm:gap-2 shrink-0">
              {/* Quick Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1.5 sm:p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-brand-orange" />
              </button>

              {/* User Avatar Pill when logged in */}
              {isAuthenticated && user && (
                <Link
                  to="/profile"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center font-bold text-[11px] sm:text-xs shadow-xs hover:bg-brand-orange transition-colors shrink-0"
                  aria-label="View Profile"
                >
                  {userInitials}
                </Link>
              )}

              {/* Compact Register CTA */}
              {isAuthenticated ? (
                <Link
                  to="/register"
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-brand-orange text-white text-[11px] sm:text-xs font-bold shadow-xs active:scale-95 transition-transform shrink-0"
                >
                  Register
                </Link>
              ) : (
                <button
                  onClick={() => openAuthModal('signup', 'guest')}
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-brand-orange text-white text-[11px] sm:text-xs font-bold shadow-xs active:scale-95 transition-transform shrink-0"
                >
                  Register
                </button>
              )}

              {/* Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 sm:p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-brand-orange" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu (< 1024px) */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-slate-200 px-4 pt-3 pb-6 space-y-2.5 animate-fade-in shadow-xl">
            {/* Quick In-Drawer Search Input */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-100/90 text-slate-500 text-xs font-medium hover:bg-slate-200/70 transition-colors"
            >
              <Search className="w-4 h-4 text-brand-orange shrink-0" />
              <span>Search topics, mentors, or sessions...</span>
            </button>

            {/* Authenticated User Banner */}
            {isAuthenticated && user ? (
              <div className="p-3 rounded-xl bg-gradient-to-r from-navy-950 to-slate-900 text-white flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-brand-orange text-white flex items-center justify-center font-extrabold text-xs shrink-0">
                    {userInitials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{user.fullName}</h4>
                    <p className="text-[10px] text-slate-300 truncate">
                      {isMentorVolunteer ? 'CIH Alumni Mentor' : (isAlumni ? 'CIH Alumni Native' : 'Guest Scholar')}
                    </p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2.5 py-1 rounded-md bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold shrink-0 transition-colors"
                >
                  Profile →
                </Link>
              </div>
            ) : (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signup', 'guest');
                  }}
                  className="flex-1 py-2 rounded-xl bg-brand-orange text-white text-xs font-bold text-center"
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-0.5 pt-1">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-brand-orange/10 text-brand-orange border-l-4 border-brand-orange font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {/* Mentor Desk — visible to all coaches/mentors in mobile menu */}
              {isMentor && (
                <Link
                  to="/mentorship"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-brand-orange/10 text-brand-orange border-l-4 border-brand-orange"
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Mentor Desk
                  </span>
                  {pendingCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-red-600 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </Link>
              )}
            </div>

            {/* Drawer Footer Links */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between px-2">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-slate-500 hover:text-navy-900 flex items-center gap-1.5 py-1"
              >
                <Shield className="w-3.5 h-3.5" /> Organizer Portal
              </Link>
              <a
                href="https://cih.com.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-brand-orange hover:underline"
              >
                cih.com.ng ↗
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal Trigger */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={closeAuthModal}
        defaultMode={authModalMode}
        defaultRole={initialSignupRole}
      />

      {/* User Profile Modal */}
      <UserProfileModal />
    </>
  );
};
