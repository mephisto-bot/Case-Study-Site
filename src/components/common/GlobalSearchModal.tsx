import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Layers, HelpCircle, UserCheck, ArrowRight, Sparkles } from 'lucide-react';
import { getStoredCaseStudies } from '../../services/storage';
import { topicModules, initialFAQs } from '../../data/initialData';
import { FAQItem } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResultItem {
  id: string;
  type: 'Case Study' | 'Syllabus Topic' | 'FAQ' | 'Page';
  title: string;
  subtitle: string;
  path: string;
  icon: React.ReactNode;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered from parent or keydown
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const caseStudies = getStoredCaseStudies();
  const lowerQuery = query.toLowerCase().trim();

  const results: SearchResultItem[] = [];

  if (lowerQuery.length > 0) {
    // 1. Search Case Studies
    caseStudies.forEach(cs => {
      if (cs.title.toLowerCase().includes(lowerQuery) || cs.excerpt.toLowerCase().includes(lowerQuery) || cs.sector.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: `cs-${cs.id}`,
          type: 'Case Study',
          title: cs.title,
          subtitle: `${cs.sector} • ${cs.date}`,
          path: '/past-case-studies',
          icon: <BookOpen className="w-4 h-4 text-brand-orange" />
        });
      }
    });

    // 2. Search Syllabus Topics
    topicModules.forEach(topic => {
      if (topic.title.toLowerCase().includes(lowerQuery) || topic.shortDescription.toLowerCase().includes(lowerQuery) || topic.theme.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: `topic-${topic.id}`,
          type: 'Syllabus Topic',
          title: topic.title,
          subtitle: `${topic.theme} • ${topic.category}`,
          path: '/topics',
          icon: <Layers className="w-4 h-4 text-blue-500" />
        });
      }
    });

    // 3. Search FAQs
    initialFAQs.forEach((faq: FAQItem) => {
      if (faq.question.toLowerCase().includes(lowerQuery) || faq.answer.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: `faq-${faq.id}`,
          type: 'FAQ',
          title: faq.question,
          subtitle: faq.category,
          path: '/faq',
          icon: <HelpCircle className="w-4 h-4 text-purple-500" />
        });
      }
    });

    // 4. Search Static Pages
    const pages = [
      { name: 'What is Case Study', desc: 'About Community Innovation Hub mentorship program', path: '/about', icon: <Sparkles className="w-4 h-4 text-emerald-500" /> },
      { name: 'Mentorship Program', desc: '1-on-1 personal growth & guidance application', path: '/mentorship', icon: <UserCheck className="w-4 h-4 text-amber-500" /> },
      { name: 'Register for Session', desc: 'Join next Wednesday live case study session', path: '/register', icon: <ArrowRight className="w-4 h-4 text-brand-orange" /> }
    ];

    pages.forEach((p, idx) => {
      if (p.name.toLowerCase().includes(lowerQuery) || p.desc.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: `page-${idx}`,
          type: 'Page',
          title: p.name,
          subtitle: p.desc,
          path: p.path,
          icon: p.icon
        });
      }
    });
  }

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-elevated border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-brand-orange shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search case studies, topics, FAQs, mentorship..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-base text-navy-900 font-medium placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-bold text-slate-500 hover:text-navy-900 bg-slate-200/60 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Esc
          </button>
        </div>

        {/* Results Container */}
        <div className="p-2 overflow-y-auto max-h-[60vh] space-y-1">
          {query.trim().length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm">Type any keyword to search across the entire site.</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {['Leadership', 'AI', 'Ethics', 'Mentorship', 'Venue'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 rounded-full bg-slate-100 hover:bg-brand-orange-light hover:text-navy-900 text-xs font-medium text-slate-600 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p className="text-sm font-semibold">No results found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for topic titles, leadership, or logistics.</p>
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.path)}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-50 flex items-start gap-3 transition-colors group"
              >
                <div className="p-2.5 rounded-lg bg-slate-100 group-hover:bg-white shadow-xs shrink-0 transition-colors">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-brand-orange">
                      {item.type}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-navy-900 group-hover:text-brand-orange transition-colors truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">
                    {item.subtitle}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-orange shrink-0 self-center transition-colors" />
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 flex justify-between items-center px-4">
          <span>Search Engine Active</span>
          <span className="font-semibold text-slate-500">{results.length} result(s)</span>
        </div>
      </div>
    </div>
  );
};
