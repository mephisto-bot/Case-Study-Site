import React from 'react';
import { X, CheckCircle2, BookOpen, Clock, ArrowRight, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TopicModule } from '../../types';

interface TopicDetailModalProps {
  topic: TopicModule | null;
  onClose: () => void;
}

export const TopicDetailModal: React.FC<TopicDetailModalProps> = ({ topic, onClose }) => {
  if (!topic) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative my-auto border border-slate-100 p-6 sm:p-8">
        {/* Topic Image Banner if available */}
        {topic.imageUrl && (
          <div className="relative h-44 sm:h-52 w-full rounded-xl overflow-hidden mb-6 bg-navy-900 shadow-md">
            <img
              src={topic.imageUrl}
              alt={topic.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/cih-photo-1.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/30 to-transparent" />
            <div className="absolute bottom-3 left-4 bg-white/90 backdrop-blur-md text-navy-900 text-xs font-bold px-3 py-1 rounded-lg">
              {topic.category}
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white shadow-md transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center shrink-0 border border-navy-100">
            <BookOpen className="w-6 h-6 text-brand-orange" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <span>{topic.category}</span>
              {topic.duration && (
                <>
                  <span>•</span>
                  <span className="text-brand-orange flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {topic.duration}
                  </span>
                </>
              )}
            </div>
            <h3 className="text-2xl font-bold text-navy-900">{topic.title}</h3>
          </div>
        </div>

        {/* Overview */}
        <div className="space-y-6 text-slate-700">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Module Overview</h4>
            <p className="text-sm sm:text-base leading-relaxed text-slate-700">
              {topic.fullOverview || topic.shortDescription}
            </p>
          </div>

          {/* Learning Outcomes */}
          {topic.learningOutcomes && topic.learningOutcomes.length > 0 && (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <h4 className="text-sm font-bold text-navy-900">Key Competencies Developed</h4>
              <ul className="space-y-2.5">
                {topic.learningOutcomes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sample Case Scenario */}
          {topic.sampleCase && (
            <div className="p-4 rounded-xl bg-navy-50/70 border border-navy-100 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-1">
                  Sample Case Dilemma
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic">
                  "{topic.sampleCase}"
                </p>
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Covered in our rotating weekly Wednesday curriculum.
            </span>
            <Link
              to="/register"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold shadow-md transition-all active:scale-95"
            >
              Enroll for This Topic
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
