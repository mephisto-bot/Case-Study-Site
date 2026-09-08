import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShieldCheck, Globe, Sparkles } from 'lucide-react';
import { ContactModal } from '../common/ContactModal';

export const Footer: React.FC = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
      <footer className="bg-navy-900 text-slate-300 py-12 border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Main Footer Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            {/* Brand & Tagline */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-3">
                <img 
                  src="/images/cih-logo.png" 
                  alt="Community Innovation Hub Logo" 
                  className="h-8 w-auto object-contain" 
                />
                <span className="text-xl font-extrabold text-white tracking-tight">CIH Case Study</span>
              </div>
              <p className="text-xs text-slate-400 max-w-md">
                Empowering young minds with critical frameworks, cognitive agility, and life skills through weekly interactive case studies.
              </p>
            </div>

            {/* Official Website Highlight Box */}
            <div className="w-full md:w-auto">
              <a
                href="https://cih.com.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-orange to-amber-600 hover:from-brand-orange-hover hover:to-amber-700 text-white text-xs sm:text-sm font-extrabold shadow-lg hover:shadow-orange-glow transition-all active:scale-95 group text-center"
              >
                <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform shrink-0" />
                <span>Check out Community Innovation Hub official website</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center">
            <span>
              © {new Date().getFullYear()} Community Innovation Hub (CIH). All rights reserved.
            </span>

            {/* Quick Footer Links */}
            <div className="flex flex-wrap items-center justify-center gap-5">
              <Link to="/about" className="hover:text-white transition-colors">
                What is Case Study
              </Link>
              <button
                onClick={() => setPrivacyOpen(true)}
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setContactOpen(true)}
                className="hover:text-white transition-colors"
              >
                Contact
              </button>
              <Link
                to="/admin"
                className="text-slate-500 hover:text-slate-300 flex items-center gap-1"
                title="Organizer Portal"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Portal
              </Link>
            </div>
          </div>

        </div>
      </footer>

      {/* Contact Modal */}
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />

      {/* Privacy Policy Modal */}
      {privacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-navy-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-8 shadow-2xl text-slate-700 relative my-auto border border-slate-100 break-words">
            <h3 className="text-xl font-bold text-navy-900 mb-4">Privacy & Data Handling</h3>
            <p className="text-sm leading-relaxed text-slate-600 mb-4">
              Community Innovation Hub (CIH) values your privacy. When you register for the Case Study program, your full name, email address, phone number, and attendee classification are securely recorded solely for session attendance coordination, WhatsApp updates, calendar invite dispatch, and curriculum notifications.
            </p>
            <p className="text-sm leading-relaxed text-slate-600 mb-4">
              <strong>Media & Video Documentation:</strong> Photographs and videos are recorded during on-site sessions for Community Innovation Hub archives, educational recaps, and community updates.
            </p>
            <p className="text-sm leading-relaxed text-slate-600 mb-6">
              We never sell or share your contact information with third-party marketers. You may request deletion of your registration details at any time by contacting our team.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setPrivacyOpen(false)}
                className="px-6 py-2.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
