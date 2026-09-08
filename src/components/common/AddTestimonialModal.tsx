import React, { useState } from 'react';
import { X, Star, MessageSquare, User, Send, CheckCircle2, Sparkles, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { addStoredTestimonial } from '../../services/storage';
import { Testimonial } from '../../types';

interface AddTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddTestimonialModal: React.FC<AddTestimonialModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();

  const [name, setName] = useState(user?.fullName || '');
  const [role, setRole] = useState(user?.alumniCohort || (user?.role === 'alumni' ? 'CIH Alumni' : 'Guest Attendee'));
  const [attendeeType, setAttendeeType] = useState<'CIH Alumni' | 'GUEST' | 'Hub Native' | 'Youth Fellow'>(
    user?.role === 'alumni' ? 'CIH Alumni' : 'GUEST'
  );
  const [quote, setQuote] = useState('');
  const [highlight, setHighlight] = useState('');
  const [rating, setRating] = useState(5);
  const [sessionTopic, setSessionTopic] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) return;

    const initials = name.trim().split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'CS';

    const newTestimonial: Testimonial = {
      id: `test-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      role: role.trim() || (attendeeType === 'CIH Alumni' ? 'CIH Alumni Native' : 'Guest Participant'),
      attendeeType,
      initials,
      quote: quote.trim(),
      highlight: highlight.trim() || quote.trim().substring(0, 80) + '...',
      rating,
      sessionTopic: sessionTopic.trim() || 'Wednesday Case Study Session',
      cohort: user?.alumniCohort || undefined,
      createdAt: new Date().toISOString(),
      featured: true
    };

    addStoredTestimonial(newTestimonial);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      if (onSuccess) onSuccess();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 relative overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-sm"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-brand-orange text-white text-[10px] font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COMMUNITY VOICES</span>
          </div>

          <h3 className="text-2xl font-extrabold text-white tracking-tight">
            Share Your Case Study Experience
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            How has attending Wednesday Case Studies impacted your leadership, decision-making, or career?
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-3 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-navy-900">Thank you for your testimony!</h4>
              <p className="text-xs text-slate-600">
                Your experience inspires new attendees and fellows across the CIH community.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy-900 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Amina Yusuf"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-navy-900 mb-1">Attendee Track</label>
                  <select
                    value={attendeeType}
                    onChange={(e) => setAttendeeType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 text-slate-900"
                  >
                    <option value="CIH Alumni">CIH Alumni</option>
                    <option value="GUEST">GUEST Attendee</option>
                    <option value="Hub Native">Hub Native</option>
                    <option value="Youth Fellow">Youth Fellow</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy-900 mb-1">Current Role / Title</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Tech Fellow, Student, Designer, Product Manager"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 text-slate-900"
                />
              </div>

              {/* Star Rating */}
              <div>
                <label className="block font-bold text-navy-900 mb-1">Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-[11px] font-bold text-slate-500 ml-2">
                    {rating === 5 ? '5.0 (Exceptional)' : `${rating}.0 Stars`}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy-900 mb-1">Your Testimony / Review</label>
                <textarea
                  required
                  rows={3}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Share how the sessions helped you develop decision-making skills, character, or career clarity..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 text-slate-900 resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-navy-900 mb-1">One-sentence Key Takeaway / Highlight</label>
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) => setHighlight(e.target.value)}
                  placeholder="e.g. Transformed my approach to ethical leadership"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 hover:text-navy-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Testimony</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
