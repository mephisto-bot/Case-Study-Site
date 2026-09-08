import React, { useState } from 'react';
import { X, Mail, MapPin, Phone, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { isValidGmail, GMAIL_ERROR_MESSAGE } from '../../utils/validation';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    if (!isValidGmail(email)) {
      setEmailError(GMAIL_ERROR_MESSAGE);
      return;
    }
    setEmailError('');
    setSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-navy-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-8 shadow-2xl relative my-auto border border-slate-100 break-words">
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange-light text-brand-orange text-xs font-bold uppercase tracking-wider mb-2">
              <MessageSquare className="w-3.5 h-3.5" /> Get in Touch
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-navy-900">Contact CIH Organizers</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Have questions about the Wednesday Case Study sessions or hub membership? Reach out directly.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0 -mt-1 -mr-1"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="py-12 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-navy-900">Message Sent!</h4>
            <p className="text-sm text-slate-600 mt-2">
              Thank you for reaching out. A CIH coordinator will respond to your email shortly.
            </p>
          </div>
        ) : (
          <>
            {/* Contact quick cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">Email Support</div>
                  <a href="mailto:info@cih.com.ng" className="text-xs font-bold text-navy-900 hover:text-brand-orange truncate block">
                    info@cih.com.ng
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">Hub Location</div>
                  <div className="text-xs font-bold text-navy-900 leading-tight mt-0.5">
                    Plot 104, 5th Avenue Abesan Estate, Ipaja, Lagos, Nigeria
                  </div>
                </div>
              </div>
            </div>

            {/* Quick message form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Samuel Audu"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email Address <span className="text-[10px] text-brand-orange font-bold lowercase">(@gmail.com only)</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder="samuel@gmail.com"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange ${
                    emailError ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200'
                  }`}
                />
                {emailError && (
                  <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Message or Question</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about session prerequisites, venue details, or group registrations..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-navy-900 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold rounded-lg shadow-md transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" /> Send Inquiry
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
