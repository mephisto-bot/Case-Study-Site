import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Calendar, 
  UserCheck, 
  Trophy, 
  HelpCircle, 
  ChevronDown, 
  Search,
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { initialFAQs } from '../data/initialData';
import { FAQItem } from '../types';
import { getStoredUserQuestions, saveStoredUserQuestions } from '../services/storage';
import { ContactModal } from '../components/common/ContactModal';
import { isValidGmail, GMAIL_ERROR_MESSAGE } from '../utils/validation';

export const FAQPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFAQs);
  const [userQuestions, setUserQuestions] = useState<FAQItem[]>([]);
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Ask Question Form state
  const [askQuestion, setAskQuestion] = useState('');
  const [askName, setAskName] = useState('');
  const [askEmail, setAskEmail] = useState('');
  const [askEmailError, setAskEmailError] = useState('');
  const [askSubmitted, setAskSubmitted] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategoryExpansion = (catTitle: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catTitle]: !prev[catTitle],
    }));
  };

  useEffect(() => {
    const uq = getStoredUserQuestions();
    setUserQuestions(uq);
  }, []);

  const categories = [
    { title: 'What is Case Study?', icon: Lightbulb },
    { title: 'Logistics', icon: Calendar },
    { title: 'Registration', icon: UserCheck },
    { title: 'Outcomes', icon: Trophy },
  ] as const;

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuestion.trim()) return;

    if (askEmail.trim() && !isValidGmail(askEmail.trim())) {
      setAskEmailError(GMAIL_ERROR_MESSAGE);
      return;
    }
    setAskEmailError('');

    const newQuestion: FAQItem = {
      id: `uq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      category: 'User Questions',
      question: askQuestion.trim(),
      answer: 'Thank you for your question! A CIH administrator is reviewing your inquiry and will publish an official response shortly.',
      askedByName: askName.trim() || 'Community Member',
      userEmail: askEmail.trim() || undefined,
      isUserQuestion: true,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updated = [newQuestion, ...userQuestions];
    setUserQuestions(updated);
    saveStoredUserQuestions(updated);

    setAskQuestion('');
    setAskName('');
    setAskEmail('');
    setAskSubmitted(true);
    setTimeout(() => setAskSubmitted(false), 5000);
  };

  const allDisplayFaqs = [...faqs, ...userQuestions];

  const filteredFaqs = allDisplayFaqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Section */}
      <section className="relative bg-navy-pattern text-white py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="hero-glow" />
        
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            <span>Interactive Q&A & Support</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Browse answered questions about our mentorship program, or ask your own question anonymously to receive an official admin response.
          </p>

          {/* Quick FAQ Search Bar */}
          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search questions (e.g. cost, schedule, certificate)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange backdrop-blur-md"
            />
          </div>
        </div>
      </section>

      {/* 2. Grouped FAQ Accordions & User Questions */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* User Interactive Ask Question Box */}
        <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-navy-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-orange text-white flex items-center justify-center shadow-md shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">Ask Your Own Question</h3>
              <p className="text-xs text-slate-300">Don't see your question listed? Submit it directly to CIH admins.</p>
            </div>
          </div>

          {askSubmitted && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Question submitted successfully! Admin will reply and publish your answer below.</span>
            </div>
          )}

          <form onSubmit={handleAskSubmit} className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mary Okon"
                  value={askName}
                  onChange={(e) => setAskName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-orange"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Gmail Address <span className="text-[10px] text-brand-orange font-bold lowercase">(@gmail.com only)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. mary.okon@gmail.com"
                  value={askEmail}
                  onChange={(e) => {
                    setAskEmail(e.target.value);
                    if (askEmailError) setAskEmailError('');
                  }}
                  className={`w-full px-3 py-2 rounded-xl bg-navy-900 border text-white text-xs focus:outline-none focus:border-brand-orange ${
                    askEmailError ? 'border-rose-400 bg-rose-950/30' : 'border-white/10'
                  }`}
                />
                {askEmailError && (
                  <p className="mt-1 text-[11px] text-rose-300 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0 text-rose-400" />
                    <span>{askEmailError}</span>
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Your Question *</label>
              <textarea
                required
                rows={3}
                placeholder="Type your specific question about CIH Case Studies, schedule, venue, or mentorship..."
                value={askQuestion}
                onChange={(e) => setAskQuestion(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-orange resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Submit Question for Admin Reply</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {searchQuery ? (
          /* Search Results */
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-navy-900">
              Search Results ({filteredFaqs.length})
            </h2>
            {filteredFaqs.length === 0 ? (
              <p className="text-slate-500 text-sm">No matching questions found. Feel free to ask your question above or contact us directly.</p>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-bold text-navy-900 text-base sm:text-lg">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-brand-orange' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        <div className="pt-4">{faq.answer}</div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <>
            {/* User Submitted Questions Section (If any exist) */}
            {userQuestions.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-orange/10 text-brand-orange flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-navy-900">
                    Community Submitted Questions
                  </h2>
                </div>

                <div className="space-y-3">
                  {userQuestions.map((faq) => {
                    const isOpen = openFaqId === faq.id;
                    const isPending = faq.status === 'pending';
                    return (
                      <div
                        key={faq.id}
                        className="border border-brand-orange/30 rounded-2xl overflow-hidden bg-brand-orange/5 transition-all"
                      >
                        <button
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-brand-orange">
                                Asked by {faq.askedByName || 'Attendee'}
                              </span>
                              {isPending ? (
                                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> Awaiting Admin Reply
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Admin Answered
                                </span>
                              )}
                            </div>
                            <span className="font-bold text-navy-900 text-base sm:text-lg">
                              "{faq.question}"
                            </span>
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180 text-brand-orange' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-slate-700 leading-relaxed border-t border-slate-200 bg-white/80 animate-fade-in">
                            <div className="pt-4">
                              <strong className="text-navy-900 block mb-1">Official Response:</strong>
                              {faq.answer}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Standard Category Sections */}
            {categories.map((cat) => {
              const catFaqs = faqs.filter((f) => f.category === cat.title);
              if (catFaqs.length === 0) return null;
              const CategoryIcon = cat.icon;

              return (
                <div key={cat.title} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-900 flex items-center justify-center">
                      <CategoryIcon className="w-4 h-4 text-brand-orange" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-navy-900">
                      {cat.title}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {catFaqs.map((faq, idx) => {
                      const isOpen = openFaqId === faq.id;
                      const isHiddenOnMobile = !expandedCategories[cat.title] && idx >= 2;
                      return (
                        <div
                          key={faq.id}
                          className={`border rounded-2xl overflow-hidden transition-all ${
                            isHiddenOnMobile ? 'hidden sm:block' : 'block'
                          } ${
                            isOpen
                              ? 'border-slate-300 shadow-sm bg-white'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <button
                            onClick={() => toggleFaq(faq.id)}
                            className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 transition-colors"
                          >
                            <span className="font-semibold text-navy-900 text-base sm:text-lg">
                              {faq.question}
                            </span>
                            <ChevronDown
                              className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                                isOpen ? 'rotate-180 text-brand-orange' : ''
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40 animate-fade-in">
                              <div className="pt-4">{faq.answer}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Mobile See More Questions in this Category */}
                    {catFaqs.length > 2 && (
                      <div className="flex sm:hidden justify-center pt-1">
                        <button
                          type="button"
                          onClick={() => toggleCategoryExpansion(cat.title)}
                          className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm border border-slate-200/80"
                        >
                          <span>
                            {expandedCategories[cat.title] 
                              ? `Show Fewer Questions` 
                              : `See More Questions (${catFaqs.length - 2} more)`}
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 text-brand-orange transition-transform duration-200 ${expandedCategories[cat.title] ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </section>

      {/* 3. "Still have questions?" Banner */}
      <section className="bg-navy-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-navy-800">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-brand-orange text-white flex items-center justify-center mx-auto shadow-md">
            <HelpCircle className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Still have questions?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            If you couldn't find the answer you were looking for, our team is ready to help provide the clarity you need to join our next session.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setContactModalOpen(true)}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold shadow-lg hover:shadow-orange-glow transition-all active:scale-95"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </div>
  );
};
