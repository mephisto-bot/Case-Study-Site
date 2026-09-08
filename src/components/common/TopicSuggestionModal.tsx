import React, { useState } from 'react';
import { X, Lightbulb, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { TopicSuggestion } from '../../types';
import { getStoredTopicSuggestions, saveStoredTopicSuggestions } from '../../services/storage';

interface TopicSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TopicSuggestionModal: React.FC<TopicSuggestionModalProps> = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [suggestedTopic, setSuggestedTopic] = useState('');
  const [whyNeeded, setWhyNeeded] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !suggestedTopic.trim()) return;

    const newSuggestion: TopicSuggestion = {
      id: `topic-sug-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim(),
      suggestedTopic: suggestedTopic.trim(),
      whyNeeded: whyNeeded.trim(),
      createdAt: new Date().toISOString(),
      votes: 1
    };

    const existing = getStoredTopicSuggestions();
    saveStoredTopicSuggestions([newSuggestion, ...existing]);
    setSubmitted(true);
  };

  const handleReset = () => {
    setFullName('');
    setEmail('');
    setSuggestedTopic('');
    setWhyNeeded('');
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-navy-950/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="bg-white max-w-lg w-full rounded-3xl p-5 sm:p-8 shadow-elevated border border-slate-100 relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {submitted ? (
          <div className="text-center py-6 space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-navy-900">Topic Received!</h3>
            <p className="text-sm text-slate-600">
              Thank you! Your topic suggestion <strong>"{suggestedTopic}"</strong> has been logged. Our organizers will review it for upcoming case study sessions.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-brand-orange text-white text-sm font-bold shadow-md hover:bg-brand-orange-hover transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header Row with Title and Close Button */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-brand-orange flex items-center gap-1">
                    <Sparkles className="w-3 h-3 shrink-0" /> Community Topic Suggestion
                  </span>
                  <h3 className="text-base sm:text-xl font-extrabold text-navy-900 leading-snug break-words">
                    What Would You Like Us to Teach?
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors shrink-0 -mt-1 -mr-1"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Suggest topics or skillsets you want treated during Wednesday Case Studies. The most requested topics will be selected for upcoming sessions!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Full Name <span className="text-brand-orange">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel Adewale"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="samuel@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Suggested Topic / Skill <span className="text-brand-orange">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Navigating AI Ethics or Public Speaking Frameworks"
                  value={suggestedTopic}
                  onChange={(e) => setSuggestedTopic(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Why is this topic important to you?
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us what you hope to learn from this case study..."
                  value={whyNeeded}
                  onChange={(e) => setWhyNeeded(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Submit Topic Suggestion</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
