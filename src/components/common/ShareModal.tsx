import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Smartphone, 
  Laptop, 
  FileText, 
  Download, 
  Mail, 
  CheckCircle2, 
  ExternalLink,
  Share2,
  Sparkles,
  Layers,
  BookOpen
} from 'lucide-react';
import { CaseStudy } from '../../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  study: CaseStudy;
}

type DeviceCategory = 'ios' | 'android' | 'pc' | 'mac' | 'other';

interface DeviceInfo {
  category: DeviceCategory;
  name: string;
  isMobile: boolean;
  hasNativeShare: boolean;
  recommendation: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, study }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedNotes, setCopiedNotes] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'recommended' | 'all' | 'notes'>('recommended');
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    category: 'other',
    name: 'Browser',
    isMobile: false,
    hasNativeShare: false,
    recommendation: 'Choose any sharing option below.'
  });

  // Detect user environment
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent || '';
    const platform = (navigator as any).userAgentData?.platform || navigator.platform || '';
    
    const isIOS = /iPhone|iPad|iPod/i.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/i.test(ua);
    const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/i.test(platform) && !isIOS;
    const isWindows = /Win32|Win64|Windows|WinCE/i.test(platform) || /Windows NT/i.test(ua);
    const isMobile = isIOS || isAndroid || /Mobi|mobile/i.test(ua);
    const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

    if (isIOS) {
      setDeviceInfo({
        category: 'ios',
        name: 'iPhone / iPad (iOS)',
        isMobile: true,
        hasNativeShare,
        recommendation: 'Optimized for iOS: Share directly via WhatsApp, Instagram, Apple Notes, or the iOS Share Sheet.'
      });
    } else if (isAndroid) {
      setDeviceInfo({
        category: 'android',
        name: 'Android Device',
        isMobile: true,
        hasNativeShare,
        recommendation: 'Optimized for Android: Share to WhatsApp, Instagram, Facebook, Google Keep, or device apps.'
      });
    } else if (isMac) {
      setDeviceInfo({
        category: 'mac',
        name: 'Mac PC (macOS)',
        isMobile: false,
        hasNativeShare,
        recommendation: 'Optimized for Mac: Share via WhatsApp Web, LinkedIn, Facebook, or export to Apple Notes/Notion.'
      });
    } else if (isWindows) {
      setDeviceInfo({
        category: 'pc',
        name: 'Windows PC',
        isMobile: false,
        hasNativeShare,
        recommendation: 'Optimized for Windows PC: Share via WhatsApp Web, LinkedIn, Facebook, X, or export study notes.'
      });
    } else {
      setDeviceInfo({
        category: 'other',
        name: isMobile ? 'Mobile Browser' : 'Desktop Browser',
        isMobile,
        hasNativeShare,
        recommendation: 'Select your preferred chat, social, or notes platform below.'
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Build canonical share URL with deep link
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://case-study-website-nine.vercel.app';
  const shareUrl = `${origin}/past-case-studies?study=${encodeURIComponent(study.id)}`;

  // Summary content
  const plainSummary = `📚 CIH Wednesday Case Study: "${study.title}" (${study.sector})\n\n"${study.excerpt}"\n\n👉 Read the full case study & join the discussion: ${shareUrl}`;

  // Formatted study notes text for Notes App
  const formattedNotesText = `=================================================
COMMUNITY INNOVATION HUB (CIH) • CASE STUDY NOTES
=================================================
Title: ${study.title}
${study.subtitle ? `Subtitle: ${study.subtitle}\n` : ''}Sector: ${study.sector}
Date: ${study.date} ${study.weekNumber ? `(Week ${study.weekNumber})` : ''}

EXECUTIVE SUMMARY:
${study.fullContent || study.excerpt}

KEY TAKEAWAYS & METHODOLOGIES:
${(study.keyTakeaways || []).map((item, idx) => `${idx + 1}. ${item}`).join('\n') || 'Practical decision science & leadership frameworks.'}

${study.discussionQuestions && study.discussionQuestions.length > 0 ? `DISCUSSION QUESTIONS:\n${study.discussionQuestions.map((q) => `• ${q}`).join('\n')}\n` : ''}
SOURCE & DISCUSSION:
${shareUrl}
=================================================`;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      showToast('Link copied to clipboard! Ready to share anywhere.');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      showToast('Link copied to clipboard!');
    }
  };

  const handleCopyNotes = async () => {
    try {
      await navigator.clipboard.writeText(formattedNotesText);
      setCopiedNotes(true);
      showToast('✓ Formatted study notes copied! Open your Notes app and paste.');
      setTimeout(() => setCopiedNotes(false), 2500);
    } catch {
      showToast('Notes copied to clipboard!');
    }
  };

  const handleDownloadNotes = () => {
    const element = document.createElement('a');
    const file = new Blob([formattedNotesText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `CIH-CaseStudy-${study.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Downloaded study notes file (.txt) to your device!');
  };

  // Platform Actions
  const shareToWhatsApp = () => {
    const text = encodeURIComponent(plainSummary);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(shareUrl);
    const quote = encodeURIComponent(`CIH Case Study: ${study.title}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const shareToInstagram = () => {
    // Copy link & excerpt to clipboard first so the user can easily paste it into story link sticker, DM, or bio
    navigator.clipboard.writeText(shareUrl).catch(() => {});
    showToast('Link copied! Paste into your Instagram Story link sticker, DM, or bio.');
    
    // Open Instagram app or web
    setTimeout(() => {
      if (deviceInfo.isMobile) {
        window.location.href = 'instagram://app';
        setTimeout(() => {
          window.open('https://www.instagram.com/', '_blank');
        }, 1200);
      } else {
        window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
      }
    }, 400);
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`Dissecting real-world leadership & decision science in "${study.title}" at Community Innovation Hub:`);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const shareToTelegram = () => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(`CIH Case Study: "${study.title}"\n${study.excerpt}`);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const shareToEmail = () => {
    const subject = encodeURIComponent(`CIH Case Study: ${study.title}`);
    const body = encodeURIComponent(`Hi,\n\nI wanted to share this weekly case study from Community Innovation Hub:\n\nTopic: ${study.title}\nSector: ${study.sector}\nDate: ${study.date}\n\nSummary:\n${study.excerpt}\n\nRead the complete case study and key takeaways here:\n${shareUrl}\n\nBest regards!`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
  };

  const triggerNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `CIH Case Study: ${study.title}`,
        text: `"${study.title}" (${study.sector}) - Community Innovation Hub Case Study`,
        url: shareUrl,
      }).then(() => {
        showToast('Shared successfully!');
      }).catch((err) => {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      });
    } else {
      handleCopyLink();
    }
  };

  const openNotesAppDirectly = () => {
    handleCopyNotes();
    if (deviceInfo.category === 'ios') {
      // iOS mobilenotes deep-link
      setTimeout(() => {
        window.location.href = 'mobilenotes://';
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-navy-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative my-auto border border-slate-100 flex flex-col">
        
        {/* Toast Notification Alert */}
        {toastMessage && (
          <div className="absolute top-3 left-4 right-4 z-50 bg-navy-900 text-white text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-slide-down border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="flex-1 font-medium">{toastMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 px-5 sm:px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-navy-900 leading-tight">
                Share Case Study
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                {deviceInfo.isMobile ? (
                  <Smartphone className="w-3.5 h-3.5 text-brand-orange" />
                ) : (
                  <Laptop className="w-3.5 h-3.5 text-blue-600" />
                )}
                <span className="font-semibold text-slate-700">{deviceInfo.name}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
            aria-label="Close share dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Case Study Mini Preview Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3.5">
            <img
              src={study.imageUrl}
              alt={study.title}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover shrink-0 border border-slate-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/cih-photo-1.jpg';
              }}
            />
            <div className="min-w-0 flex-1">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-brand-orange/10 text-brand-orange uppercase tracking-wider mb-1">
                {study.sector}
              </span>
              <h4 className="text-sm font-bold text-navy-900 truncate leading-snug">
                {study.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                {study.excerpt}
              </p>
            </div>
          </div>

          {/* Quick Copy Link Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Direct Case Study Link
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-0">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full text-xs sm:text-sm bg-slate-50 text-slate-700 font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 select-all truncate focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
                />
              </div>
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                  copiedLink
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-navy-900 hover:bg-navy-800 text-white shadow-sm hover:shadow'
                }`}
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Native OS Share Sheet CTA (if supported) */}
          {deviceInfo.hasNativeShare && (
            <button
              onClick={triggerNativeShare}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center justify-between shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                    Open {deviceInfo.category === 'ios' ? 'iOS' : deviceInfo.category === 'android' ? 'Android' : 'Device'} Share Menu
                  </div>
                  <div className="text-[11px] text-blue-100">
                    {deviceInfo.category === 'ios' 
                      ? 'AirDrop, Apple Notes, Messages, Reminders & more' 
                      : 'Nearby Share, Keep, Messages & installed apps'}
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          )}

          {/* Filter / Category Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('recommended')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'recommended'
                  ? 'bg-white text-navy-900 shadow-sm'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
              <span>For Your Device</span>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'bg-white text-navy-900 shadow-sm'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span>Notes App & Save</span>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-white text-navy-900 shadow-sm'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>All Platforms</span>
            </button>
          </div>

          {/* Device Advice Helper */}
          <div className="px-3 py-2 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] sm:text-xs text-blue-900 leading-relaxed flex items-start gap-2">
            <span className="font-bold text-blue-600 shrink-0">Device Info:</span>
            <span>{deviceInfo.recommendation}</span>
          </div>

          {/* Tab 1: Recommended for your device OR Tab 3: All Platforms */}
          {(activeTab === 'recommended' || activeTab === 'all') && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {activeTab === 'recommended' ? `Top Apps on ${deviceInfo.name}` : 'Select Platform to Share To'}
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                
                {/* WhatsApp */}
                <button
                  onClick={shareToWhatsApp}
                  className="p-3.5 rounded-xl border border-slate-200/90 hover:border-emerald-500 bg-white hover:bg-emerald-50/30 transition-all text-left flex items-start gap-3 group shadow-xs hover:shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {/* Official WhatsApp SVG */}
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.162 8.162 0 01-1.25-4.38c0-4.51 3.67-8.18 8.18-8.18 2.19 0 4.24.85 5.78 2.39a8.125 8.125 0 012.4 5.79c0 4.51-3.67 8.18-8.18 8.18zm4.49-6.13c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.45 1.03 2.62.12.17 1.78 2.71 4.3 3.8 2.53 1.09 2.53.73 2.99.69.45-.04 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-navy-900 group-hover:text-emerald-600 transition-colors">
                      WhatsApp
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {deviceInfo.isMobile ? 'Send to chat or status' : 'WhatsApp Web / Desktop'}
                    </div>
                  </div>
                </button>

                {/* Instagram */}
                <button
                  onClick={shareToInstagram}
                  className="p-3.5 rounded-xl border border-slate-200/90 hover:border-pink-500 bg-white hover:bg-pink-50/30 transition-all text-left flex items-start gap-3 group shadow-xs hover:shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    {/* Official Instagram SVG */}
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-navy-900 group-hover:text-pink-600 transition-colors">
                      Instagram
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      Story link sticker & DM
                    </div>
                  </div>
                </button>

                {/* Facebook */}
                <button
                  onClick={shareToFacebook}
                  className="p-3.5 rounded-xl border border-slate-200/90 hover:border-blue-600 bg-white hover:bg-blue-50/30 transition-all text-left flex items-start gap-3 group shadow-xs hover:shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {/* Official Facebook SVG */}
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-navy-900 group-hover:text-blue-600 transition-colors">
                      Facebook
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      Feed post or groups
                    </div>
                  </div>
                </button>

                {/* Notes App (Apple Notes / Keep / Notion) */}
                <button
                  onClick={openNotesAppDirectly}
                  className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-400 transition-all text-left flex items-start gap-3 group shadow-xs hover:shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-navy-900 group-hover:text-amber-700 transition-colors flex items-center gap-1">
                      <span>Notes App</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-200/80 text-amber-900 font-bold uppercase">
                        {deviceInfo.category === 'ios' ? 'Apple Notes' : 'Keep / Notes'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                      Copy formatted study note
                    </div>
                  </div>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={shareToLinkedIn}
                  className="p-3.5 rounded-xl border border-slate-200/90 hover:border-sky-600 bg-white hover:bg-sky-50/30 transition-all text-left flex items-start gap-3 group shadow-xs hover:shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {/* Official LinkedIn SVG */}
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-navy-900 group-hover:text-sky-600 transition-colors">
                      LinkedIn
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      Professional network post
                    </div>
                  </div>
                </button>

                {/* X (formerly Twitter) */}
                <button
                  onClick={shareToTwitter}
                  className="p-3.5 rounded-xl border border-slate-200/90 hover:border-black bg-white hover:bg-slate-50 transition-all text-left flex items-start gap-3 group shadow-xs hover:shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {/* Official X SVG */}
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-navy-900 group-hover:text-black transition-colors">
                      X (Twitter)
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      Tweet / Post update
                    </div>
                  </div>
                </button>

                {/* Telegram */}
                <button
                  onClick={shareToTelegram}
                  className="p-3.5 rounded-xl border border-slate-200/90 hover:border-[#229ED9] bg-white hover:bg-sky-50/30 transition-all text-left flex items-start gap-3 group shadow-xs hover:shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#229ED9]/10 text-[#229ED9] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {/* Official Telegram SVG */}
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-navy-900 group-hover:text-[#229ED9] transition-colors">
                      Telegram
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      Forward to study channel
                    </div>
                  </div>
                </button>

                {/* Email */}
                <button
                  onClick={shareToEmail}
                  className="p-3.5 rounded-xl border border-slate-200/90 hover:border-slate-500 bg-white hover:bg-slate-50 transition-all text-left flex items-start gap-3 group shadow-xs hover:shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-navy-900 group-hover:text-slate-900 transition-colors">
                      Email
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      Send full case breakdown
                    </div>
                  </div>
                </button>

              </div>
            </div>
          )}

          {/* Tab 2: Notes App & Save (Deep Dive for taking study notes) */}
          {activeTab === 'notes' && (
            <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy-900">
                    Personal Study Notes & Reflection
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Save the case summary, key lessons, and discussion questions into your favorite notes tool (Apple Notes, Google Keep, Notion, Obsidian, or Microsoft OneNote).
                  </p>
                </div>
              </div>

              {/* Note Preview Box */}
              <div className="p-3 rounded-lg bg-white border border-amber-200/80 font-mono text-[11px] text-slate-700 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {formattedNotesText}
              </div>

              {/* Action Buttons for Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleCopyNotes}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    copiedNotes
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                  }`}
                >
                  {copiedNotes ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedNotes ? 'Copied to Clipboard!' : 'Copy Formatted Note'}</span>
                </button>

                <button
                  onClick={handleDownloadNotes}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  <span>Download .TXT File</span>
                </button>
              </div>

              {deviceInfo.category === 'ios' && (
                <div className="pt-1 text-center">
                  <button
                    onClick={openNotesAppDirectly}
                    className="inline-flex items-center gap-1.5 text-xs text-amber-800 hover:text-amber-900 font-semibold underline underline-offset-2"
                  >
                    <span>Tap here to copy note and launch Apple Notes app</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-5 sm:px-6 py-3.5 flex items-center justify-between text-xs text-slate-500 rounded-b-2xl">
          <span className="text-[11px]">
            Free & open community resource by Community Innovation Hub
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-navy-900 hover:bg-slate-200/70 font-semibold transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
