import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  GraduationCap, 
  Globe, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  HeartHandshake, 
  Check,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SignUpFormData, RememberedAccount } from '../../types';
import { isValidGmail, GMAIL_ERROR_MESSAGE, isValidLinkedIn, LINKEDIN_ERROR_MESSAGE } from '../../utils/validation';
import { 
  getStoredRememberedAccounts, 
  removeRememberedAccount, 
  getLastLoginEmail,
  saveRememberedAccount
} from '../../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
  defaultRole?: 'guest' | 'alumni';
}

const MENTOR_FOCUS_OPTIONS = [
  'Tech & Artificial Intelligence',
  'Ethics & Leadership',
  'Cognitive Agility & Mindset',
  'Personal Growth & Life Skills',
  'Career Transition & Resumes',
  'Product, UI/UX & Design'
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  defaultRole = 'guest'
}) => {
  const { login, signup } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [selectedRole, setSelectedRole] = useState<'guest' | 'alumni'>(defaultRole);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [alumniCohort, setAlumniCohort] = useState('');
  const [isMentorVolunteer, setIsMentorVolunteer] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>(['Tech & Artificial Intelligence']);
  const [mentorBio, setMentorBio] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fast login / Remembered accounts state
  const [rememberedAccounts, setRememberedAccounts] = useState<RememberedAccount[]>([]);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setSelectedRole(defaultRole);
      setErrorMsg(null);
      setSuccessMsg(null);

      // Load remembered accounts on this device
      const accounts = getStoredRememberedAccounts();
      setRememberedAccounts(accounts);
      const lastEmail = getLastLoginEmail();
      if (lastEmail) {
        setEmail(lastEmail);
      } else if (accounts.length > 0) {
        setEmail(accounts[0].email);
      }
    }
  }, [isOpen, defaultMode, defaultRole]);

  if (!isOpen) return null;

  const handleSelectRememberedAccount = async (acc: RememberedAccount, autoSubmit: boolean = false) => {
    setEmail(acc.email);
    setErrorMsg(null);
    if (autoSubmit) {
      setLoading(true);
      try {
        const res = await login(acc.email);
        if (!res.success) {
          setErrorMsg(res.message || 'Please enter your password to sign in.');
        } else {
          setSuccessMsg(res.message || `Welcome back, ${acc.fullName}!`);
          setTimeout(() => onClose(), 700);
        }
      } catch {
        setErrorMsg('An error occurred during quick sign in. Please enter password.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveAccount = (e: React.MouseEvent, accEmail: string) => {
    e.stopPropagation();
    removeRememberedAccount(accEmail);
    const updated = getStoredRememberedAccounts();
    setRememberedAccounts(updated);
    if (email.toLowerCase() === accEmail.toLowerCase()) {
      setEmail(updated.length > 0 ? updated[0].email : '');
    }
  };

  const toggleFocusArea = (area: string) => {
    if (selectedFocusAreas.includes(area)) {
      setSelectedFocusAreas(selectedFocusAreas.filter((a) => a !== area));
    } else {
      setSelectedFocusAreas([...selectedFocusAreas, area]);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!isValidGmail(email)) {
      setErrorMsg(GMAIL_ERROR_MESSAGE);
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.message || 'Login failed. Please check credentials.');
      } else {
        setSuccessMsg(res.message || 'Logged in successfully!');
        setTimeout(() => onClose(), 800);
      }
    } catch (err) {
      setErrorMsg('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !isValidGmail(email)) {
      setErrorMsg(GMAIL_ERROR_MESSAGE);
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter your phone number.');
      return;
    }
    if (selectedRole === 'alumni' && !alumniCohort.trim()) {
      setErrorMsg('Please specify your graduating CIH cohort year and track.');
      return;
    }
    if (selectedRole === 'alumni' && isMentorVolunteer) {
      if (!linkedinUrl.trim() || !isValidLinkedIn(linkedinUrl)) {
        setErrorMsg(LINKEDIN_ERROR_MESSAGE);
        return;
      }
    }

    setLoading(true);
    try {
      const payload: SignUpFormData = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim() || undefined,
        phone: phone.trim(),
        role: selectedRole,
        alumniCohort: selectedRole === 'alumni' ? alumniCohort.trim() : undefined,
        isMentorVolunteer: selectedRole === 'alumni' ? isMentorVolunteer : false,
        linkedinUrl: selectedRole === 'alumni' && isMentorVolunteer ? linkedinUrl.trim() : undefined,
        mentorFocusAreas: selectedRole === 'alumni' && isMentorVolunteer ? selectedFocusAreas : undefined,
        mentorBio: selectedRole === 'alumni' && isMentorVolunteer ? mentorBio.trim() : undefined
      };

      const res = await signup(payload);
      if (!res.success) {
        setErrorMsg(res.message || 'Sign up failed.');
      } else {
        setSuccessMsg(res.message || 'Account created successfully!');
        setTimeout(() => onClose(), 900);
      }
    } catch (err) {
      setErrorMsg('An error occurred while creating your account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-6 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full max-h-[86vh] sm:max-h-[88vh] shadow-2xl border border-slate-200/80 relative flex flex-col overflow-hidden transition-all my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 text-white p-4 sm:p-5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-sm"
            aria-label="Close modal"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-brand-orange text-white text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider">
              {mode === 'login' ? 'COMMUNITY ACCESS' : 'CREATE ACCOUNT'}
            </span>
          </div>

          <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
            {mode === 'login' ? 'Sign In to CIH Case Study' : 'Join Case Study Network'}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-none">
            {mode === 'login' 
              ? 'Access session materials, fast registration, and mentorship tools.'
              : 'Choose your participant track to get started.'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-navy-950/70 p-0.5 sm:p-1 rounded-xl mt-3 sm:mt-4 border border-white/10">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(null); }}
              className={`flex-1 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition-all ${
                mode === 'login' 
                  ? 'bg-brand-orange text-white shadow-md' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(null); }}
              className={`flex-1 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition-all ${
                mode === 'signup' 
                  ? 'bg-brand-orange text-white shadow-md' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Modal Body (Clean inner scroll) */}
        <div className="p-4 sm:p-5 space-y-3.5 flex-1 overflow-y-auto">
          {/* Alerts */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ======================= LOGIN FORM ======================= */}
          {mode === 'login' && (
            <div className="space-y-3.5">
              {/* Previously Created Accounts on this Device */}
              {rememberedAccounts.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" />
                      <span>Recognized Accounts on this Device</span>
                    </span>
                    <span className="text-[10px] font-semibold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-full">
                      1-Tap Login
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {rememberedAccounts.map((acc) => {
                      const isSelected = email.trim().toLowerCase() === acc.email.toLowerCase();
                      return (
                        <div
                          key={acc.email}
                          onClick={() => handleSelectRememberedAccount(acc, true)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 group ${
                            isSelected
                              ? 'border-brand-orange bg-brand-orange/5 shadow-xs ring-1 ring-brand-orange/30'
                              : 'border-slate-200 hover:border-brand-orange/40 bg-slate-50/80 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 shadow-2xs ${
                              acc.role === 'alumni' ? 'bg-navy-900 text-white' : 'bg-brand-orange text-white'
                            }`}>
                              {acc.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-navy-900 truncate group-hover:text-brand-orange transition-colors">
                                  {acc.fullName}
                                </span>
                                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded shrink-0 ${
                                  acc.role === 'alumni' ? 'bg-navy-100 text-navy-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {acc.role === 'alumni' ? (acc.alumniCohort || 'Alumni') : 'Guest'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 truncate">{acc.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectRememberedAccount(acc, true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 group-hover:border-brand-orange group-hover:bg-brand-orange group-hover:text-white text-navy-900 text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1"
                              title="Sign in with this account immediately"
                            >
                              <span>Sign In</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleRemoveAccount(e, acc.email)}
                              className="w-6 h-6 rounded-md hover:bg-rose-50 text-slate-300 hover:text-rose-600 flex items-center justify-center transition-colors"
                              title="Remove from device remembered accounts"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="relative py-1.5 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                    <span className="relative bg-white px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Or Sign In with Email
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-navy-900 mb-0.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. user@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-navy-900 mb-0.5">Password</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Toggle */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-navy-900">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-brand-orange focus:ring-brand-orange/30"
                    />
                    <span className="text-[11px] font-medium">Remember my account on this device</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 sm:py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-orange-glow transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
                >
                  {loading ? (
                    <span>Signing In...</span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ======================= SIGN UP FORM ======================= */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              
              {/* Option Selector: Guest vs CIH Alumni (Side-by-side on all screens) */}
              <div>
                <label className="block text-[11px] font-extrabold text-navy-900 uppercase tracking-wider mb-1.5">
                  Select Registration Track
                </label>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {/* Option 1: Guest */}
                  <div
                    onClick={() => setSelectedRole('guest')}
                    className={`cursor-pointer rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border transition-all flex flex-col justify-between ${
                      selectedRole === 'guest'
                        ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                          <Globe className="w-3.5 h-3.5" />
                        </div>
                        {selectedRole === 'guest' && (
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px]">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-navy-900 leading-tight">Guest Attendee</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                        First-timers, students & professionals.
                      </p>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-blue-700 mt-1.5 block">
                      Direct access ➔
                    </span>
                  </div>

                  {/* Option 2: CIH Alumni */}
                  <div
                    onClick={() => setSelectedRole('alumni')}
                    className={`cursor-pointer rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border transition-all flex flex-col justify-between ${
                      selectedRole === 'alumni'
                        ? 'bg-orange-50/90 border-brand-orange ring-2 ring-brand-orange/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-brand-orange/15 text-brand-orange flex items-center justify-center">
                          <GraduationCap className="w-3.5 h-3.5" />
                        </div>
                        {selectedRole === 'alumni' && (
                          <span className="w-4 h-4 rounded-full bg-brand-orange text-white flex items-center justify-center text-[9px]">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-navy-900 leading-tight">CIH Alumni</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                        Past natives & grads with mentor option.
                      </p>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-brand-orange mt-1.5 block">
                      Volunteer to be a mentor ★
                    </span>
                  </div>
                </div>
              </div>

              {/* Core User Fields */}
              <div className="space-y-2.5 pt-0.5">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-navy-900 mb-0.5">Full Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Kelechi Okafor"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-navy-900 mb-0.5">
                    Email Address <span className="text-brand-orange font-normal text-[10px]">(@gmail.com strictly required)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-navy-900 mb-0.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 801 234 5678"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-navy-900 mb-0.5">Create Password</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= SPECIAL CIH ALUMNI SECTION ================= */}
              {selectedRole === 'alumni' && (
                <div className="p-3 sm:p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2.5 animate-fade-in">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                    <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                      CIH Alumni Verification
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-800 mb-0.5">
                      Graduating Cohort or Hub Track <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required={selectedRole === 'alumni'}
                      value={alumniCohort}
                      onChange={(e) => setAlumniCohort(e.target.value)}
                      placeholder="Cohort year and cohort track"
                      className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange/40 text-slate-900"
                    />
                  </div>

                  {/* Volunteer as a Mentor Option */}
                  <div className="pt-2 border-t border-amber-200/60">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isMentorVolunteer}
                        onChange={(e) => setIsMentorVolunteer(e.target.checked)}
                        className="w-3.5 h-3.5 mt-0.5 rounded text-brand-orange focus:ring-brand-orange border-amber-300"
                      />
                      <div>
                        <span className="text-xs font-extrabold text-navy-900 flex items-center gap-1">
                          <HeartHandshake className="w-3.5 h-3.5 text-brand-orange" />
                          Volunteer to be a Case Study Mentor
                        </span>
                        <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">
                          Guide breakout pods and share industry insights during Wednesday sessions.
                        </p>
                      </div>
                    </label>

                    {/* Expandable Mentor Focus Areas */}
                    {isMentorVolunteer && (
                      <div className="mt-2.5 pl-5 space-y-2 animate-fade-in">
                        <span className="text-[10px] font-bold text-slate-700 block">
                          Select your mentoring focus areas:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {MENTOR_FOCUS_OPTIONS.map((area) => {
                            const selected = selectedFocusAreas.includes(area);
                            return (
                              <button
                                key={area}
                                type="button"
                                onClick={() => toggleFocusArea(area)}
                                className={`text-[9px] font-bold px-2 py-0.5 rounded-md border transition-all ${
                                  selected
                                    ? 'bg-brand-orange text-white border-brand-orange shadow-xs'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                {area} {selected && '✓'}
                              </button>
                            );
                          })}
                        </div>

                        <div className="pt-1">
                          <label className="block text-[10px] font-bold text-slate-800 mb-0.5">
                            LinkedIn Profile URL <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="url"
                            required
                            value={linkedinUrl}
                            onChange={(e) => setLinkedinUrl(e.target.value)}
                            placeholder="https://www.linkedin.com/in/yourname"
                            className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange/40 text-slate-900"
                          />
                          <p className="text-[10px] text-slate-500 mt-0.5">Required for alumni mentor verification.</p>
                        </div>

                        <div className="pt-1">
                          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                            Short Coach / Mentor Note (Optional)
                          </label>
                          <input
                            type="text"
                            value={mentorBio}
                            onChange={(e) => setMentorBio(e.target.value)}
                            placeholder="Brief summary of your professional background..."
                            className="w-full px-2.5 py-1 bg-white border border-amber-300 rounded-md text-[11px] focus:outline-none focus:ring-2 focus:ring-brand-orange/40 text-slate-900"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

                {/* Remember Me on Signup */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-navy-900">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-brand-orange focus:ring-brand-orange/30"
                    />
                    <span className="text-[11px] font-medium">Remember this account on this device for faster login</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 sm:py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-orange-glow transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>
                      {selectedRole === 'alumni' 
                        ? (isMentorVolunteer ? 'Complete Alumni Mentor Registration' : 'Complete Alumni Registration') 
                        : 'Sign Up as Guest & Enter Site'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer note */}
          <div className="text-center pt-1">
            <p className="text-[10px] text-slate-400">
              Community Innovation Hub • Plot 104, 5th Avenue Abesan Estate, Ipaja
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
