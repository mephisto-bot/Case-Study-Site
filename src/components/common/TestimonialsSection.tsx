import React, { useState, useEffect } from 'react';
import { 
  Quote, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  MessageSquarePlus, 
  GraduationCap, 
  User, 
  CheckCircle2, 
  HeartHandshake
} from 'lucide-react';
import { getStoredTestimonials } from '../../services/storage';
import { Testimonial } from '../../types';
import { AddTestimonialModal } from './AddTestimonialModal';

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadData = () => {
    setTestimonials(getStoredTestimonials());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (!testimonials.length) return null;

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-white via-slate-50 to-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-xs font-bold text-brand-orange">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Attendee Testimonies</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
              Real Impact from Real Attendees
            </h2>
            {/* Shortened on mobile, rich on desktop */}
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
              <span className="hidden sm:inline">Hear directly from CIH Alumni, first-time guests, and fellows on how weekly Wednesday Case Studies built their decision confidence and leadership skills.</span>
              <span className="sm:hidden">Stories from past alumni and guests on weekly Wednesday Case Study sessions.</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <MessageSquarePlus className="w-4 h-4 text-brand-orange" />
              <span>Share Your Story</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* MOBILE SLIDER / COMPACT VIEW (Clean, No Fatigue)             */}
        {/* ============================================================ */}
        <div className="block sm:hidden">
          {testimonials[activeIndex] && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-soft relative space-y-4 animate-fade-in">
              {/* Rating + Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                  testimonials[activeIndex].attendeeType === 'CIH Alumni'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {testimonials[activeIndex].attendeeType}
                </span>
              </div>

              {/* Quote */}
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                "{testimonials[activeIndex].quote}"
              </p>

              {/* Author Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {testimonials[activeIndex].initials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-navy-900 truncate">{testimonials[activeIndex].name}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{testimonials[activeIndex].role}</p>
                  </div>
                </div>

                {/* Mobile Navigation Arrows */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous testimonial"
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next testimonial"
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-3">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  activeIndex === idx ? 'w-5 bg-brand-orange' : 'w-1.5 bg-slate-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP GRID VIEW (Expansive, Rich & Premium)                 */}
        {/* ============================================================ */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="card-hover-effect rounded-3xl bg-white p-7 border border-slate-200/80 shadow-soft flex flex-col justify-between relative group hover:border-brand-orange/40 hover:shadow-xl transition-all"
            >
              {/* Quote Mark Background Icon */}
              <div className="absolute top-6 right-6 text-slate-100 group-hover:text-orange-50 transition-colors pointer-events-none">
                <Quote className="w-12 h-12" />
              </div>

              <div className="space-y-4 relative z-10">
                {/* Rating + Track Pill */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                    item.attendeeType === 'CIH Alumni'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {item.attendeeType === 'CIH Alumni' ? <GraduationCap className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    <span>{item.attendeeType}</span>
                  </span>
                </div>

                {/* Key Takeaway Highlight */}
                {item.highlight && (
                  <p className="text-sm font-bold text-navy-900 group-hover:text-brand-orange transition-colors">
                    "{item.highlight}"
                  </p>
                )}

                {/* Full Quote */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.quote}
                </p>
              </div>

              {/* Author Bio */}
              <div className="pt-5 border-t border-slate-100 flex items-center gap-3.5 mt-4 relative z-10">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-navy-950 to-navy-800 text-white flex items-center justify-center font-extrabold text-sm shadow-sm shrink-0 border border-white/10">
                  {item.initials}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-navy-900 truncate flex items-center gap-1">
                    <span>{item.name}</span>
                    <span title="Verified Attendee">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 truncate">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Add Testimonial Modal */}
      <AddTestimonialModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => loadData()}
      />
    </section>
  );
};
