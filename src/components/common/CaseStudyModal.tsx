import React, { useState, useEffect } from 'react';
import { X, Calendar, CheckCircle, HelpCircle, ArrowRight, Share2, Tag, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CaseStudy } from '../../types';
import { SessionVideoPlayer } from './SessionVideoPlayer';
import { ShareModal } from './ShareModal';

interface CaseStudyModalProps {
  study: CaseStudy | null;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ study, onClose }) => {
  if (!study) return null;

  const [currentImage, setCurrentImage] = useState<string>(study.imageUrl);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setCurrentImage(study.imageUrl);
  }, [study]);

  const allImages = Array.from(new Set([study.imageUrl, ...(study.galleryImages || [])]));

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-navy-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative my-auto border border-slate-100">
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-navy-900 flex items-center gap-1.5">
              <Tag className="w-3 h-3 text-brand-orange" /> {study.sector}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> {study.date}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Share Case Study"
              className="p-2 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Image / Gallery View */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-navy-950">
          <img
            src={currentImage}
            alt={study.title}
            className="w-full h-full object-cover opacity-90 transition-all duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/cih-photo-1.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none">
            {study.weekNumber && (
              <span className="inline-block px-2.5 py-0.5 rounded bg-brand-orange text-white text-[11px] font-bold uppercase tracking-wider mb-2">
                Week {study.weekNumber} Retrospective
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {study.title}
            </h2>
            {study.subtitle && (
              <p className="text-sm sm:text-base text-slate-200 mt-1 font-medium">
                {study.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Multi-Photo Thumbnail Bar */}
        {allImages.length > 1 && (
          <div className="px-6 pt-4 pb-2 bg-slate-50 border-b border-slate-100 flex items-center gap-3 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
              <ImageIcon className="w-3.5 h-3.5 text-brand-orange" /> Photos:
            </span>
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(img)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  currentImage === img ? 'border-brand-orange scale-105 shadow-md ring-2 ring-brand-orange/30' : 'border-slate-200 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Session photo ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8 text-slate-700">
          {/* Embedded Video Section (If available) */}
          {(study.videoUrl || study.youtubeUrl || study.youtubeVideoId) && (
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Session Video Recording
                </h4>
              </div>
              <SessionVideoPlayer
                videoUrl={study.videoUrl}
                youtubeUrl={study.youtubeUrl}
                youtubeVideoId={study.youtubeVideoId}
                title={study.videoTitle || `${study.title} - Session Video`}
                posterUrl={study.imageUrl}
              />
            </div>
          )}

          {/* Overview / Context */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Case Context & Scenario Breakdown
            </h4>
            <p className="text-base sm:text-lg leading-relaxed text-slate-800 font-normal">
              {study.fullContent || study.excerpt}
            </p>
          </div>

          {/* Key Lessons / Takeaways */}
          {study.keyTakeaways && study.keyTakeaways.length > 0 && (
            <div className="p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-100 space-y-4">
              <h4 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-brand-orange" />
                Key Insights & Methodologies Uncovered
              </h4>
              <ul className="space-y-3">
                {study.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-brand-orange/10 text-brand-orange font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Discussion & Debate Questions */}
          {study.discussionQuestions && study.discussionQuestions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-orange" />
                Peer Deliberation Prompts
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {study.discussionQuestions.map((q, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-navy-50/60 border border-navy-100/80 text-sm text-slate-800 italic">
                    "{q}"
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive User Feedback & Community Discussion */}
          <FeedbackSection caseStudyId={study.id} />

          {/* Bottom Action Footer */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 text-center sm:text-left">
              Want to take part in live case studies like this? Join us this Wednesday.
            </div>
            <Link
              to="/register"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold shadow-md hover:shadow-orange-glow transition-all active:scale-95"
            >
              Register for Next Session
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Adaptive Share Pop-up Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        study={study}
      />
    </div>
  );
};

// Subcomponent for Case Study Feedback & Discussion
const FeedbackSection: React.FC<{ caseStudyId: string }> = ({ caseStudyId }) => {
  const [feedbackList, setFeedbackList] = React.useState<any[]>([]);
  const [comment, setComment] = React.useState('');
  const [submittedMsg, setSubmittedMsg] = React.useState(false);

  React.useEffect(() => {
    import('../../services/storage').then(mod => {
      const items = mod.getStoredFeedback().filter((f: any) => f.caseStudyId === caseStudyId);
      setFeedbackList(items);
    });
  }, [caseStudyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newFb = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      caseStudyId,
      userName: 'Anonymous Participant',
      userEmail: '',
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };

    const mod = await import('../../services/storage');
    const existing = mod.getStoredFeedback();
    const updated = [newFb, ...existing];
    mod.saveStoredFeedback(updated);

    setFeedbackList(updated.filter(f => f.caseStudyId === caseStudyId));
    setComment('');
    setSubmittedMsg(true);
    setTimeout(() => setSubmittedMsg(false), 4000);
  };

  return (
    <div className="pt-6 border-t border-slate-200 space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-extrabold text-navy-900 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-orange"></span>
          <span>Attendee Feedback & Discussion</span>
        </h4>
        <span className="text-xs font-bold text-slate-500">{feedbackList.length} Comments</span>
      </div>

      {/* List of Feedback */}
      {feedbackList.length === 0 ? (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 italic text-center">
          No feedback posted yet for this study. Be the first to share your thoughts or questions!
        </div>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {feedbackList.map(item => (
            <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-navy-900">
                <span className="font-bold">{item.userName}</span>
                <span className="text-[10px] text-slate-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-700 text-sm">{item.comment}</p>

              {/* Admin Reply if present */}
              {item.adminReply && (
                <div className="mt-2 pl-3 border-l-2 border-brand-orange bg-brand-orange/5 p-2 rounded-r-lg space-y-1">
                  <div className="flex items-center justify-between font-bold text-brand-orange">
                    <span>CIH Admin Response:</span>
                  </div>
                  <p className="text-slate-800 font-medium">{item.adminReply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Post Feedback Form */}
      <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-navy-950 text-white space-y-3">
        <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Share Your Feedback or Question
        </div>

        {submittedMsg && (
          <div className="p-2 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold">
            ✓ Feedback submitted successfully! Admins will review and reply.
          </div>
        )}

        <textarea
          required
          rows={3}
          placeholder="What did you learn or what question do you have regarding this case study? *"
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-navy-900 text-white text-xs border border-white/10 focus:outline-none focus:border-brand-orange resize-none"
        />

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold transition-colors shadow-md active:scale-95"
        >
          Post Feedback / Question
        </button>
      </form>
    </div>
  );
};
