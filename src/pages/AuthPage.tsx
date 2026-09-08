import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowLeft, GraduationCap, Globe, HeartHandshake } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openAuthModal, isAuthenticated } = useAuth();

  const isSignup = location.pathname.includes('signup');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    } else {
      openAuthModal(isSignup ? 'signup' : 'login', isSignup ? 'guest' : 'guest');
    }
  }, [location.pathname, isAuthenticated]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-elevated text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-brand-orange/15 text-brand-orange flex items-center justify-center mx-auto shadow-sm">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-navy-900">
            {isSignup ? 'Join CIH Case Study' : 'Welcome Back'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {isSignup 
              ? 'Sign up as a Guest or CIH Alumni to access session materials & mentorship.'
              : 'Sign in to your account to manage your profile and session registrations.'}
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <button
            onClick={() => openAuthModal(isSignup ? 'signup' : 'login')}
            className="w-full py-3.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-95"
          >
            {isSignup ? 'Open Sign Up Form' : 'Open Sign In Form'}
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 hover:text-navy-900 py-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
