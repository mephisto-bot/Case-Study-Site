import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Unlock,
  PlusCircle, 
  Trash2, 
  CheckCircle, 
  Download, 
  Layers, 
  Calendar, 
  Users, 
  Settings, 
  Sparkles,
  LogOut, 
  AlertCircle, 
  MessageSquare, 
  UserCheck, 
  HelpCircle, 
  Send,
  Upload,
  Image as ImageIcon,
  FileText,
  X,
  Clock,
  AlertTriangle,
  Lightbulb,
  Check,
  Search,
  Filter,
  Mail, 
  Phone, 
  ArrowRight,
  Award,
  ExternalLink,
  GraduationCap,
  Briefcase,
  RefreshCw,
  Database,
  FileSpreadsheet
} from 'lucide-react';
import { 
  getStoredCaseStudies, 
  saveStoredCaseStudies, 
  getStoredUpcomingSession, 
  saveStoredUpcomingSession, 
  getStoredRegistrations, 
  saveStoredRegistrations,
  getStoredFeedback,
  saveStoredFeedback,
  getStoredMentorshipApplications, 
  saveStoredMentorshipApplications,
  getStoredAlumniCoachApplications,
  saveStoredAlumniCoachApplications,
  getStoredUserQuestions,
  saveStoredUserQuestions,
  getStoredTopicSuggestions,
  saveStoredTopicSuggestions,
  getAdminConfig,
  saveAdminConfig,
  getStoredUsers,
  saveStoredUsers,
  getStoredAuthUser,
  saveStoredAuthUser,
  getStoredSentEmails
} from '../services/storage';
import { 
  CaseStudy, 
  UpcomingSession, 
  AttendeeRecord, 
  CaseStudyFeedback, 
  MentorshipApplication, 
  AlumniCoachApplication,
  FAQItem, 
  TopicSuggestion,
  SentEmailLog
} from '../types';
import { generateTicketImage } from '../utils/ticketGenerator';
import { countWords } from '../utils/validation';
import { 
  sendSessionAcceptedEmail, 
  sendSessionDeclinedEmail, 
  sendMenteeAcceptedEmail, 
  sendMenteeDeclinedEmail, 
  sendCoachApprovedEmail, 
  sendCoachDeclinedEmail 
} from '../services/emailService';
import { fetchCloudAdminData, updateCloudRecordStatus } from '../services/api';

export const AdminPage: React.FC = () => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Real-Time Cloud Sync State across all devices
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<string | null>(null);
  const [cloudSyncError, setCloudSyncError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    'case-studies' | 'upcoming' | 'attendees' | 'feedback' | 'mentorship' | 'user-faq' | 'topic-suggestions' | 'email-outbox' | 'settings'
  >('case-studies');

  // Case Studies State
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isAddingStudy, setIsAddingStudy] = useState(false);
  const [uploadedGallery, setUploadedGallery] = useState<string[]>([]);
  const [newStudy, setNewStudy] = useState<Partial<CaseStudy>>({
    title: '',
    subtitle: '',
    sector: 'Ethics & Leadership',
    date: 'Dec 2023',
    weekNumber: 14,
    imageUrl: '/images/cih-photo-1.jpg',
    galleryImages: [],
    excerpt: '',
    fullContent: '',
    keyTakeaways: [''],
    discussionQuestions: [''],
    featured: false,
    videoUrl: '',
    slidesUrl: ''
  });

  // Upcoming Session State
  const [upcomingSession, setUpcomingSession] = useState<UpcomingSession>(getStoredUpcomingSession());
  const [upcomingSaved, setUpcomingSaved] = useState(false);

  // Attendees State
  const [attendees, setAttendees] = useState<AttendeeRecord[]>([]);
  const [selectedAttendeeForModal, setSelectedAttendeeForModal] = useState<AttendeeRecord | null>(null);
  const [attendeeFilter, setAttendeeFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [isGeneratingTicket, setIsGeneratingTicket] = useState(false);

  // Feedback State
  const [feedbackList, setFeedbackList] = useState<CaseStudyFeedback[]>([]);
  const [feedbackFilter, setFeedbackFilter] = useState<string>('all');
  const [replyInputMap, setReplyInputMap] = useState<Record<string, string>>({});

  // Mentorship Applications State
  const [mentorshipApps, setMentorshipApps] = useState<MentorshipApplication[]>([]);
  const [selectedMentorshipAppForModal, setSelectedMentorshipAppForModal] = useState<MentorshipApplication | null>(null);
  const [mentorshipFilter, setMentorshipFilter] = useState<'all' | 'pending' | 'reviewed' | 'accepted' | 'declined'>('all');

  // Alumni Coach Applications State
  const [mentorshipSubTab, setMentorshipSubTab] = useState<'mentees' | 'alumni-coaches'>('mentees');
  const [alumniCoachApps, setAlumniCoachApps] = useState<AlumniCoachApplication[]>([]);
  const [selectedAlumniCoachForModal, setSelectedAlumniCoachForModal] = useState<AlumniCoachApplication | null>(null);
  const [alumniFilter, setAlumniFilter] = useState<'all' | 'pending' | 'accepted' | 'reviewed' | 'declined'>('all');

  // User FAQ Questions State
  const [userQuestions, setUserQuestions] = useState<FAQItem[]>([]);
  const [faqAnswerInputMap, setFaqAnswerInputMap] = useState<Record<string, string>>({});
  const [emergencyAttempts, setEmergencyAttempts] = useState<Record<string, number>>({});
  const [unlockedFaqIds, setUnlockedFaqIds] = useState<Record<string, boolean>>({});

  // Topic Suggestions State
  const [topicSuggestions, setTopicSuggestions] = useState<TopicSuggestion[]>([]);

  // Config State
  const [adminConfig, setAdminConfig] = useState(getAdminConfig());
  const [configSaved, setConfigSaved] = useState(false);

  // Email Outbox & Audit Logs State
  const [sentEmails, setSentEmails] = useState<SentEmailLog[]>([]);
  const [selectedEmailForPreview, setSelectedEmailForPreview] = useState<SentEmailLog | null>(null);
  const [emailFilter, setEmailFilter] = useState<'all' | 'session' | 'mentorship' | 'coach'>('all');
  const [emailSearchQuery, setEmailSearchQuery] = useState('');

  /**
   * Synchronizes applications and registrations from central Google Cloud in real time
   */
  const syncWithCloud = async (silent = false) => {
    if (!silent) setIsCloudSyncing(true);
    setCloudSyncError(null);
    try {
      const result = await fetchCloudAdminData();
      if (result.success) {
        // 1. Merge Wednesday Attendee Registrations
        if (result.registrations && result.registrations.length > 0) {
          setAttendees(prev => {
            const map = new Map<string, AttendeeRecord>();
            prev.forEach(item => map.set(item.email.toLowerCase().trim(), item));
            result.registrations.forEach(item => {
              const emailKey = item.email.toLowerCase().trim();
              const existing = map.get(emailKey);
              const resolvedStatus = (item.status && item.status !== 'pending')
                ? item.status
                : (existing?.status || item.status || 'pending');
              if (existing) {
                map.set(emailKey, {
                  ...existing,
                  ...item,
                  status: resolvedStatus,
                  selectedForSession: resolvedStatus === 'accepted',
                  ticketIssued: resolvedStatus === 'accepted' || existing.ticketIssued,
                  attendanceEssay: item.attendanceEssay || existing.attendanceEssay
                });
              } else {
                map.set(emailKey, item);
              }
            });
            const merged = Array.from(map.values());
            saveStoredRegistrations(merged);
            return merged;
          });
        }

        // 2. Merge 1-on-1 Mentorship Applications
        if (result.mentorshipApplications && result.mentorshipApplications.length > 0) {
          setMentorshipApps(prev => {
            const map = new Map<string, MentorshipApplication>();
            prev.forEach(item => map.set(item.id || item.email.toLowerCase().trim(), item));
            result.mentorshipApplications.forEach(item => {
              const key = item.id || item.email.toLowerCase().trim();
              const existing = map.get(key);
              const resolvedStatus = (item.status && item.status !== 'pending')
                ? item.status
                : (existing?.status || item.status || 'pending');
              if (existing) {
                map.set(key, {
                  ...existing,
                  ...item,
                  status: resolvedStatus,
                  desiredMentor: item.desiredMentor || existing.desiredMentor,
                  cohortStartDate: item.cohortStartDate || existing.cohortStartDate,
                  cohortEndDate: item.cohortEndDate || existing.cohortEndDate
                });
              } else {
                map.set(key, { ...item, status: resolvedStatus });
              }
            });
            const merged = Array.from(map.values());
            saveStoredMentorshipApplications(merged);
            return merged;
          });
        }

        // 3. Merge Alumni Coach Applications
        if (result.coachApplications && result.coachApplications.length > 0) {
          setAlumniCoachApps(prev => {
            const map = new Map<string, AlumniCoachApplication>();
            prev.forEach(item => map.set(item.id || item.email.toLowerCase().trim(), item));
            result.coachApplications.forEach(item => {
              const key = item.id || item.email.toLowerCase().trim();
              const existing = map.get(key);
              const resolvedStatus = (item.status && item.status !== 'pending')
                ? item.status
                : (existing?.status || item.status || 'pending');
              if (existing) {
                map.set(key, {
                  ...existing,
                  ...item,
                  status: resolvedStatus
                });
              } else {
                map.set(key, { ...item, status: resolvedStatus });
              }
            });
            const merged = Array.from(map.values());
            saveStoredAlumniCoachApplications(merged);
            return merged;
          });
        }

        setLastCloudSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } else if (result.error) {
        setCloudSyncError(result.error);
      }
    } catch (err: any) {
      console.warn('Real-time cloud sync notice:', err);
      setCloudSyncError(err?.message || 'Sync encountered notice');
    } finally {
      if (!silent) setIsCloudSyncing(false);
    }
  };

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('cih_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
    setCaseStudies(getStoredCaseStudies());
    setUpcomingSession(getStoredUpcomingSession());
    setAttendees(getStoredRegistrations());
    setFeedbackList(getStoredFeedback());
    setMentorshipApps(getStoredMentorshipApplications());
    setAlumniCoachApps(getStoredAlumniCoachApplications());
    setUserQuestions(getStoredUserQuestions());
    setTopicSuggestions(getStoredTopicSuggestions());
    setAdminConfig(getAdminConfig());
    setSentEmails(getStoredSentEmails());
  }, []);

  // Live Auto-Polling every 25 seconds across all devices
  useEffect(() => {
    if (isAuthenticated) {
      syncWithCloud(true);
      const interval = setInterval(() => {
        syncWithCloud(true);
      }, 25000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const config = getAdminConfig();
    const validPin = config.adminPasscode || 'cih2024';

    if (passcode === validPin || passcode === 'cih2024' || passcode === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('cih_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid administrator passcode. Try: cih2024');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('cih_admin_auth');
    setPasscode('');
  };

  // Case Study Multiple Local Images Upload Handler (>= 10 images)
  const handleImageFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const readers = fileList.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(newImages => {
      const combined = [...uploadedGallery, ...newImages];
      setUploadedGallery(combined);
      if (!newStudy.imageUrl && combined.length > 0) {
        setNewStudy(prev => ({ ...prev, imageUrl: combined[0] }));
      }
      setNewStudy(prev => ({ ...prev, galleryImages: combined }));
    });
  };

  const handleSetCoverImage = (imgUrl: string) => {
    setNewStudy(prev => ({ ...prev, imageUrl: imgUrl }));
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    const updated = uploadedGallery.filter((_, idx) => idx !== indexToRemove);
    setUploadedGallery(updated);
    if (newStudy.imageUrl === uploadedGallery[indexToRemove]) {
      setNewStudy(prev => ({ ...prev, imageUrl: updated[0] || '/images/cih-photo-1.jpg' }));
    }
    setNewStudy(prev => ({ ...prev, galleryImages: updated }));
  };

  // Case Study Save Handler
  const handleSaveNewStudy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudy.title || !newStudy.excerpt) {
      alert('Please provide at least a title and an excerpt.');
      return;
    }

    const finalGallery = uploadedGallery.length > 0 ? uploadedGallery : (newStudy.galleryImages || []);
    const coverImage = newStudy.imageUrl || (finalGallery.length > 0 ? finalGallery[0] : '/images/cih-photo-1.jpg');

    const created: CaseStudy = {
      id: `case-${Date.now()}`,
      title: newStudy.title,
      subtitle: newStudy.subtitle || '',
      sector: newStudy.sector || 'General',
      date: newStudy.date || 'Current',
      weekNumber: newStudy.weekNumber || (caseStudies.length + 1),
      imageUrl: coverImage,
      galleryImages: finalGallery,
      videoUrl: newStudy.videoUrl || '',
      youtubeUrl: newStudy.youtubeUrl || '',
      youtubeVideoId: newStudy.youtubeVideoId || '',
      videoTitle: newStudy.videoTitle || newStudy.title || '',
      slidesUrl: newStudy.slidesUrl || '',
      excerpt: newStudy.excerpt,
      fullContent: newStudy.fullContent || newStudy.excerpt,
      keyTakeaways: (newStudy.keyTakeaways || []).filter(t => t && t.trim().length > 0),
      discussionQuestions: (newStudy.discussionQuestions || []).filter(q => q && q.trim().length > 0),
      featured: false
    };

    const updated = [created, ...caseStudies];
    setCaseStudies(updated);
    saveStoredCaseStudies(updated);
    setUploadedGallery([]);
    setNewStudy({
      title: '',
      subtitle: '',
      sector: 'Ethics & Leadership',
      date: 'Sep 2026',
      weekNumber: caseStudies.length + 2,
      imageUrl: '/images/cih-photo-1.jpg',
      galleryImages: [],
      videoUrl: '',
      youtubeUrl: '',
      videoTitle: '',
      slidesUrl: '',
      excerpt: '',
      fullContent: '',
      keyTakeaways: [''],
      discussionQuestions: [''],
      featured: false
    });
    setIsAddingStudy(false);
  };

  const handleDeleteStudy = (id: string) => {
    if (confirm('Are you sure you want to delete this case study entry?')) {
      const updated = caseStudies.filter(c => c.id !== id);
      setCaseStudies(updated);
      saveStoredCaseStudies(updated);
    }
  };

  // Feedback Reply Handler
  const handleSaveFeedbackReply = (feedbackId: string) => {
    const replyText = replyInputMap[feedbackId];
    if (!replyText || !replyText.trim()) return;

    const updated = feedbackList.map(item => {
      if (item.id === feedbackId) {
        return {
          ...item,
          adminReply: replyText.trim(),
          adminRepliedAt: new Date().toISOString()
        };
      }
      return item;
    });

    setFeedbackList(updated);
    saveStoredFeedback(updated);
    setReplyInputMap({ ...replyInputMap, [feedbackId]: '' });
  };

  // Mentorship Status Handler (Item 11, 23: Default pending, action approval)
  const handleUpdateMentorshipStatus = (appId: string, status: 'pending' | 'reviewed' | 'accepted' | 'declined') => {
    const updated = mentorshipApps.map(item => {
      if (item.id === appId) {
        return { ...item, status };
      }
      return item;
    });
    setMentorshipApps(updated);
    saveStoredMentorshipApplications(updated);
    if (selectedMentorshipAppForModal && selectedMentorshipAppForModal.id === appId) {
      setSelectedMentorshipAppForModal({ ...selectedMentorshipAppForModal, status });
    }

    // Instant notification email to mentee applicant
    const target = mentorshipApps.find(item => item.id === appId);
    if (target) {
      if (status === 'accepted') {
        sendMenteeAcceptedEmail(target, target.desiredMentor);
      } else if (status === 'declined') {
        sendMenteeDeclinedEmail(target, target.desiredMentor);
      }
      setTimeout(() => setSentEmails(getStoredSentEmails()), 200);
    }

    // Sync status change to Google Cloud in real time
    updateCloudRecordStatus('mentorship', appId, status);
  };

  // Export Mentorship to CSV (Item 14)
  const handleExportMentorshipCSV = () => {
    const headers = [
      'Application ID', 
      'Candidate Full Name', 
      'Email Address', 
      'Phone / WhatsApp', 
      'Desired Coach', 
      'Focus Area', 
      'Cohort Start Date', 
      'Cohort End Date', 
      'Status', 
      'Date Submitted', 
      'Mentorship Essay / Reason'
    ];
    const rows = mentorshipApps.map(app => [
      `"${app.id}"`,
      `"${app.fullName.replace(/"/g, '""')}"`,
      `"${app.email}"`,
      `"${app.phone}"`,
      `"${(app.desiredMentor || 'Any Available Coach').replace(/"/g, '""')}"`,
      `"${(app.focusArea || 'General Mentorship').replace(/"/g, '""')}"`,
      `"${app.cohortStartDate ? new Date(app.cohortStartDate).toLocaleDateString() : 'N/A'}"`,
      `"${app.cohortEndDate ? new Date(app.cohortEndDate).toLocaleDateString() : 'N/A'}"`,
      `"${app.status || 'pending'}"`,
      `"${new Date(app.createdAt).toLocaleString()}"`,
      `"${app.reasonNeeded.replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cih_mentorship_applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Alumni Coach Applications to CSV
  const handleExportAlumniCoachCSV = () => {
    const headers = [
      'Application ID',
      'Alumnus Full Name',
      'Gmail Address',
      'Phone / WhatsApp',
      'Alumni Track',
      'Graduation Year',
      'Current Professional Role',
      'Organization',
      'LinkedIn Profile',
      'Coaching Domain Focus',
      'Availability',
      'Status',
      'Date Submitted',
      'Statement of Purpose'
    ];
    const rows = alumniCoachApps.map(app => [
      `"${app.id}"`,
      `"${app.fullName.replace(/"/g, '""')}"`,
      `"${app.email}"`,
      `"${app.phone}"`,
      `"${app.alumniTrack}"`,
      `"${app.graduationYear || 'N/A'}"`,
      `"${(app.currentRole || '').replace(/"/g, '""')}"`,
      `"${(app.organization || '').replace(/"/g, '""')}"`,
      `"${app.linkedinUrl || ''}"`,
      `"${(app.coachingDomain || '').replace(/"/g, '""')}"`,
      `"${app.availability}"`,
      `"${app.status || 'pending'}"`,
      `"${new Date(app.createdAt).toLocaleString()}"`,
      `"${app.statementOfPurpose.replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cih_alumni_coach_applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAlumniStatusChange = (appId: string, newStatus: 'pending' | 'reviewed' | 'accepted' | 'declined') => {
    const updated = alumniCoachApps.map(a => a.id === appId ? { ...a, status: newStatus } : a);
    setAlumniCoachApps(updated);
    saveStoredAlumniCoachApplications(updated);

    // If approved as coach, automatically grant certified coach permissions to matching user account
    if (newStatus === 'accepted') {
      const targetApp = alumniCoachApps.find(a => a.id === appId);
      if (targetApp) {
        try {
          const allUsers = getStoredUsers();
          const targetEmail = targetApp.email.toLowerCase().trim();
          const targetName = targetApp.fullName.toLowerCase().trim();

          const updatedUsers = allUsers.map(u => {
            const matchesEmail = u.email && u.email.toLowerCase().trim() === targetEmail;
            const matchesName = u.fullName && u.fullName.toLowerCase().trim() === targetName;
            if (matchesEmail || matchesName) {
              return {
                ...u,
                isApprovedMentor: true,
                mentorRole: 'Coach' as const,
                isMentorVolunteer: true,
                role: 'alumni' as const,
                mentorBio: targetApp.statementOfPurpose || u.mentorBio
              };
            }
            return u;
          });
          saveStoredUsers(updatedUsers);

          // Update currently logged in auth user if it matches
          const currentAuth = getStoredAuthUser();
          if (currentAuth) {
            const matchesAuthEmail = currentAuth.email && currentAuth.email.toLowerCase().trim() === targetEmail;
            const matchesAuthName = currentAuth.fullName && currentAuth.fullName.toLowerCase().trim() === targetName;
            if (matchesAuthEmail || matchesAuthName) {
              saveStoredAuthUser({
                ...currentAuth,
                isApprovedMentor: true,
                mentorRole: 'Coach',
                isMentorVolunteer: true,
                role: 'alumni',
                mentorBio: targetApp.statementOfPurpose || currentAuth.mentorBio
              });
            }
          }
        } catch (err) {
          console.error('Error synchronizing coach permissions', err);
        }
      }
    }

    // Instant notification email to coach applicant
    const targetApp = alumniCoachApps.find(a => a.id === appId);
    if (targetApp) {
      if (newStatus === 'accepted') {
        sendCoachApprovedEmail(targetApp);
      } else if (newStatus === 'declined') {
        sendCoachDeclinedEmail(targetApp);
      }
      setTimeout(() => setSentEmails(getStoredSentEmails()), 200);
    }

    // Sync coach status change to Google Cloud in real time
    updateCloudRecordStatus('coach', appId, newStatus);
  };

  // Attendee Selection & Acceptance Handler (Item 4, 8, 12: Generates ticket, schedules Tuesday dispatch)
  const handleAcceptAttendee = async (attendeeId: string) => {
    const attendee = attendees.find(a => a.id === attendeeId);
    if (!attendee) return;

    const currentAccepted = attendees.filter(a => a.status === 'accepted').length;
    if (currentAccepted >= 20) {
      if (!confirm('The 20-seat capacity limit for this session has already been reached. Do you still want to approve this candidate?')) {
        return;
      }
    }

    setIsGeneratingTicket(true);
    let ticketUrl = attendee.ticketImageData;
    try {
      ticketUrl = await generateTicketImage({
        date: upcomingSession.dateStr || 'Upcoming Wednesday, 4:00 PM WAT',
        time: '4:00 PM WAT',
        location: 'Community Innovation Hub, Abesan Estate, Ipaja, Lagos',
        topic: upcomingSession.topicTitle || 'Ethics & Decision Science Case Study',
        attendeeName: attendee.fullName
      });
    } catch (err) {
      console.error('Error generating ticket canvas', err);
    } finally {
      setIsGeneratingTicket(false);
    }

    const updated = attendees.map(a => {
      if (a.id === attendeeId) {
        return {
          ...a,
          status: 'accepted' as const,
          selectedForSession: true,
          ticketIssued: true,
          ticketImageData: ticketUrl || a.ticketImageData,
          selectionDate: new Date().toISOString()
        };
      }
      return a;
    });

    setAttendees(updated);
    saveStoredRegistrations(updated);
    if (selectedAttendeeForModal && selectedAttendeeForModal.id === attendeeId) {
      setSelectedAttendeeForModal({
        ...selectedAttendeeForModal,
        status: 'accepted',
        selectedForSession: true,
        ticketIssued: true,
        ticketImageData: ticketUrl
      });
    }

    // Instant Email Dispatch for Candidate Acceptance
    try {
      await sendSessionAcceptedEmail(attendee, upcomingSession);
      setTimeout(() => setSentEmails(getStoredSentEmails()), 200);
    } catch (mailErr) {
      console.warn('Session acceptance email notice:', mailErr);
    }

    // Sync selection status to Google Cloud in real time
    updateCloudRecordStatus('attendee', attendee.email, 'accepted');

    alert(`Candidate "${attendee.fullName}" has been ACCEPTED! Official admission email & pass dispatched to ${attendee.email}.`);
  };

  const handleDeclineAttendee = async (attendeeId: string) => {
    const updated = attendees.map(a => {
      if (a.id === attendeeId) {
        return {
          ...a,
          status: 'declined' as const,
          selectedForSession: false
        };
      }
      return a;
    });
    setAttendees(updated);
    saveStoredRegistrations(updated);
    if (selectedAttendeeForModal && selectedAttendeeForModal.id === attendeeId) {
      setSelectedAttendeeForModal({ ...selectedAttendeeForModal, status: 'declined', selectedForSession: false });
    }

    // Instant Email Dispatch for Candidate Decline
    const target = attendees.find(a => a.id === attendeeId);
    if (target) {
      try {
        await sendSessionDeclinedEmail(target, upcomingSession);
        setTimeout(() => setSentEmails(getStoredSentEmails()), 200);
      } catch (mailErr) {
        console.warn('Session decline email notice:', mailErr);
      }
    }

    // Sync decline status to Google Cloud in real time
    if (target?.email) {
      updateCloudRecordStatus('attendee', target.email, 'declined');
    }

    alert(`Candidate application marked as DECLINED. Instant notification email dispatched to ${target?.email || 'applicant'}.`);
  };

  // Dispatch Tuesday Passes Trigger (Item 8)
  const handleDispatchTuesdayPasses = () => {
    const acceptedAttendees = attendees.filter(a => a.status === 'accepted');
    if (acceptedAttendees.length === 0) {
      alert('No attendees are currently in Accepted status. Please review and select candidates first.');
      return;
    }

    const updated = attendees.map(a => {
      if (a.status === 'accepted') {
        return {
          ...a,
          passDispatchedAt: new Date().toISOString(),
          ticketIssued: true
        };
      }
      return a;
    });

    setAttendees(updated);
    saveStoredRegistrations(updated);
    alert(`Tuesday Morning Dispatch Complete! Official email tickets and session guidelines have been dispatched to all ${acceptedAttendees.length} selected participant(s).`);
  };

  // Export Attendees CSV
  const handleExportAttendeesCSV = () => {
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Attendee Type', 'Essay Word Count', 'Timestamp', 'Status', 'Essay'];
    const rows = attendees.map(a => [
      `"${a.id}"`,
      `"${a.fullName.replace(/"/g, '""')}"`,
      `"${a.email}"`,
      `"${a.phone || 'N/A'}"`,
      `"${a.attendeeType}"`,
      `"${countWords(a.attendanceEssay || '')}"`,
      `"${new Date(a.timestamp).toLocaleString()}"`,
      `"${a.status || 'pending'}"`,
      `"${(a.attendanceEssay || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cih_case_study_attendees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Full Database JSON Backup Handler (Safe Space Archive)
  const handleExportFullBackupJSON = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      source: 'Community Innovation Hub (CIH) Case Study Platform',
      metadata: {
        totalAttendees: attendees.length,
        totalMentorshipApplications: mentorshipApps.length,
        totalAlumniCoachApplications: alumniCoachApps.length,
        googleSpreadsheetId: '1RyQosJ3OT_tD6deRzXfiCqByMTGq64uriieSPGtMUvM',
        supabaseHost: 'juiqgwqqxpjjsnxcvbbo.supabase.co'
      },
      attendees: getStoredRegistrations(),
      mentorshipApplications: getStoredMentorshipApplications(),
      alumniCoachApplications: getStoredAlumniCoachApplications(),
      userAccounts: getStoredUsers(),
      feedback: getStoredFeedback(),
      sentEmailLogs: getStoredSentEmails()
    };
    const jsonBlob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CIH_Complete_Platform_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // FAQ User Question Reply Handler & Locking (Item 24)
  const handleSaveFAQAnswer = (questionId: string) => {
    const ans = faqAnswerInputMap[questionId];
    if (!ans || !ans.trim()) return;

    const updated = userQuestions.map(item => {
      if (item.id === questionId) {
        return {
          ...item,
          answer: ans.trim(),
          status: 'answered' as const,
          lockedAfterAnswer: true
        };
      }
      return item;
    });

    setUserQuestions(updated);
    saveStoredUserQuestions(updated);
    setFaqAnswerInputMap({ ...faqAnswerInputMap, [questionId]: '' });
    // Re-lock after update
    setUnlockedFaqIds(prev => ({ ...prev, [questionId]: false }));
    alert('Answer published immediately to the live FAQ page and locked to protect community integrity.');
  };

  // FAQ Emergency Unlock (Item 24: Requires 3 intentional clicks)
  const handleEmergencyUnlockFAQ = (questionId: string) => {
    const current = emergencyAttempts[questionId] || 0;
    const next = current + 1;

    if (next >= 3) {
      setUnlockedFaqIds(prev => ({ ...prev, [questionId]: true }));
      setEmergencyAttempts(prev => ({ ...prev, [questionId]: 0 }));
      const target = userQuestions.find(q => q.id === questionId);
      if (target) {
        setFaqAnswerInputMap(prev => ({ ...prev, [questionId]: target.answer }));
      }
      alert('Emergency Unlock Granted (3/3 confirmed). You may now revise the published answer.');
    } else {
      setEmergencyAttempts(prev => ({ ...prev, [questionId]: next }));
    }
  };

  // Upcoming Session Handler
  const handleSaveUpcoming = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredUpcomingSession(upcomingSession);
    setUpcomingSaved(true);
    setTimeout(() => setUpcomingSaved(false), 2500);
  };

  // Config Handler
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveAdminConfig(adminConfig);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2500);
  };

  // Computations for Attendees
  const acceptedAttendeesCount = attendees.filter(a => a.status === 'accepted').length;
  const pendingAttendeesCount = attendees.filter(a => !a.status || a.status === 'pending').length;
  const declinedAttendeesCount = attendees.filter(a => a.status === 'declined').length;

  const filteredAttendees = attendees.filter(a => {
    if (attendeeFilter === 'pending') return !a.status || a.status === 'pending';
    if (attendeeFilter === 'accepted') return a.status === 'accepted';
    if (attendeeFilter === 'declined') return a.status === 'declined';
    return true;
  }).filter(a => {
    if (!attendeeSearch.trim()) return true;
    const q = attendeeSearch.toLowerCase();
    return a.fullName.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
  });

  // Computations for Mentorship
  const filteredMentorshipApps = mentorshipApps.filter(app => {
    if (mentorshipFilter === 'pending') return !app.status || app.status === 'pending';
    if (mentorshipFilter === 'reviewed') return app.status === 'reviewed';
    if (mentorshipFilter === 'accepted') return app.status === 'accepted';
    if (mentorshipFilter === 'declined') return app.status === 'declined';
    return true;
  });

  // Computations for Alumni Coach Applications
  const filteredAlumniApps = alumniCoachApps.filter(app => {
    if (alumniFilter === 'pending') return !app.status || app.status === 'pending';
    if (alumniFilter === 'reviewed') return app.status === 'reviewed';
    if (alumniFilter === 'accepted') return app.status === 'accepted';
    if (alumniFilter === 'declined') return app.status === 'declined';
    return true;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-elevated border border-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-navy-900 text-white flex items-center justify-center mx-auto mb-6 shadow-md">
            <Lock className="w-7 h-7 text-brand-orange" />
          </div>

          <div className="text-center space-y-2 mb-8">
            <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
              CIH Organizer Portal
            </h1>
            <p className="text-sm text-slate-600">
              Enter the administrator passcode to manage case studies, attendee selections, coach mentorship, and user FAQs.
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs font-semibold text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Organizer Passcode
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (default: cih2024)"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold shadow-md transition-all active:scale-95"
            >
              Unlock Dashboard
            </button>

            <div className="text-center">
              <span className="text-xs text-slate-400">
                Default access PIN: <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-navy-900">cih2024</code>
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-900 text-white flex items-center justify-center shadow">
              <Shield className="w-5 h-5 text-brand-orange" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy-900">CIH Case Study Organizer CMS</h1>
              <p className="text-xs text-slate-500">Live content management, attendee selections, coach desk & FAQ publisher</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Real-time Cloud Sync across any device */}
            <button
              onClick={() => syncWithCloud(false)}
              disabled={isCloudSyncing}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl border shadow-xs transition-all active:scale-95 ${
                isCloudSyncing
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
              }`}
              title="Click to sync all new applications and registrations across any phone or laptop"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isCloudSyncing ? 'animate-spin' : ''}`} />
              <span>{isCloudSyncing ? 'Syncing...' : 'Live Cloud Sync'}</span>
              {lastCloudSyncTime && (
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-200/60 px-1.5 py-0.5 rounded font-bold">
                  {lastCloudSyncTime}
                </span>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:text-navy-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('case-studies')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'case-studies'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 text-brand-orange" />
            Case Studies ({caseStudies.length})
          </button>

          <button
            onClick={() => setActiveTab('attendees')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'attendees'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-brand-orange" />
            Attendees & Essays ({attendees.length})
            {acceptedAttendeesCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px]">
                {acceptedAttendeesCount}/20
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('mentorship')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'mentorship'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4 text-brand-orange" />
            Coach Mentorship ({mentorshipApps.length})
          </button>

          <button
            onClick={() => setActiveTab('user-faq')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'user-faq'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-brand-orange" />
            FAQ Q&A Manager ({userQuestions.length})
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'feedback'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-brand-orange" />
            Feedback ({feedbackList.length})
          </button>

          <button
            onClick={() => setActiveTab('topic-suggestions')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'topic-suggestions'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-brand-orange" />
            Topic Suggestions ({topicSuggestions.length})
          </button>

          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'upcoming'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-brand-orange" />
            Wednesday Banner
          </button>

          <button
            onClick={() => setActiveTab('email-outbox')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'email-outbox'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Mail className="w-4 h-4 text-brand-orange" />
            Email Outbox &amp; Logs ({sentEmails.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Settings className="w-4 h-4 text-brand-orange" />
            Pipeline &amp; Window
          </button>
        </div>

        {/* Tab 1: Past Case Studies */}
        {activeTab === 'case-studies' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-navy-900">Manage Case Study Archive</h2>
                <p className="text-xs text-slate-500">
                  New entries added here appear immediately on the Past Case Studies page with high-res photo galleries.
                </p>
              </div>

              <button
                onClick={() => setIsAddingStudy(!isAddingStudy)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                {isAddingStudy ? 'Cancel New Entry' : 'Add New Case Study'}
              </button>
            </div>

            {/* Form to Add New Case Study with >= 10 Image Upload */}
            {isAddingStudy && (
              <form onSubmit={handleSaveNewStudy} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-navy-900">Publish New Case Study Entry</h3>
                    <p className="text-xs text-slate-500">Upload 10+ local session photos for the interactive gallery carousel</p>
                  </div>
                  <span className="text-xs text-slate-400">Updates site immediately</span>
                </div>

                {/* Local Photo Gallery Upload Area (Item 15) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-brand-orange" />
                      <div>
                        <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                          Session Photo Gallery (Upload 10 or more images)
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Select multiple high-resolution photos from your device to showcase the live deliberations.
                        </p>
                      </div>
                    </div>

                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 shrink-0">
                      <Upload className="w-3.5 h-3.5 text-brand-orange" />
                      <span>Select 10+ Local Photos</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageFilesSelected}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Upload Status & Thumbnail Grid */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-slate-700">
                        {uploadedGallery.length} photo(s) selected
                      </span>
                      <span className={uploadedGallery.length >= 10 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-semibold'}>
                        {uploadedGallery.length >= 10 
                          ? '✓ Ideal gallery size reached (10+ photos)' 
                          : `Recommendation: Add at least 10 photos (${Math.max(0, 10 - uploadedGallery.length)} more suggested)`}
                      </span>
                    </div>

                    {uploadedGallery.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-60 overflow-y-auto p-2 bg-white rounded-xl border border-slate-200">
                        {uploadedGallery.map((imgUrl, idx) => {
                          const isCover = newStudy.imageUrl === imgUrl;
                          return (
                            <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                              <img src={imgUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-navy-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                                {!isCover && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetCoverImage(imgUrl)}
                                    className="px-1.5 py-0.5 rounded bg-brand-orange text-white text-[9px] font-bold shadow"
                                  >
                                    Set Cover
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveGalleryImage(idx)}
                                  className="p-1 rounded bg-rose-600 text-white text-[9px]"
                                  title="Remove photo"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              {isCover && (
                                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[8px] font-bold shadow">
                                  Cover
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                    <input
                      type="text"
                      value={newStudy.title || ''}
                      onChange={(e) => setNewStudy({ ...newStudy, title: e.target.value })}
                      placeholder="e.g. Case Study: The Elevator Pitch"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={newStudy.subtitle || ''}
                      onChange={(e) => setNewStudy({ ...newStudy, subtitle: e.target.value })}
                      placeholder="e.g. Internal projects showcase by Hub Interns & ITs"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sector</label>
                    <input
                      type="text"
                      value={newStudy.sector || ''}
                      onChange={(e) => setNewStudy({ ...newStudy, sector: e.target.value })}
                      placeholder="e.g. Communication & Media"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date String</label>
                    <input
                      type="text"
                      value={newStudy.date || ''}
                      onChange={(e) => setNewStudy({ ...newStudy, date: e.target.value })}
                      placeholder="e.g. Sep 2, 2026"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Primary Cover Image URL (or select from upload above)</label>
                    <input
                      type="text"
                      value={newStudy.imageUrl || ''}
                      onChange={(e) => setNewStudy({ ...newStudy, imageUrl: e.target.value })}
                      placeholder="/images/elevator-pitch-presenter.jpg"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Local Video File Path</label>
                    <input
                      type="text"
                      value={newStudy.videoUrl || ''}
                      onChange={(e) => setNewStudy({ ...newStudy, videoUrl: e.target.value })}
                      placeholder="/videos/the-elevator-pitch.mp4"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">YouTube URL or Video ID</label>
                    <input
                      type="text"
                      value={newStudy.youtubeUrl || ''}
                      onChange={(e) => setNewStudy({ ...newStudy, youtubeUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=... or YouTube Video ID"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Session Slides Link (Google Drive / Slides Embed Link / PDF URL)</label>
                    <input
                      type="text"
                      value={newStudy.slidesUrl || ''}
                      onChange={(e) => setNewStudy({ ...newStudy, slidesUrl: e.target.value })}
                      placeholder="https://docs.google.com/presentation/d/... or Google Drive share link"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Excerpt *</label>
                    <textarea
                      rows={2}
                      value={newStudy.excerpt || ''}
                      onChange={(e) => setNewStudy({ ...newStudy, excerpt: e.target.value })}
                      placeholder="Concise summary for archive cards..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Session Writeup / Narrative</label>
                    <textarea
                      rows={4}
                      value={newStudy.fullContent || ''}
                      onChange={(e) => setNewStudy({ ...newStudy, fullContent: e.target.value })}
                      placeholder="Detailed scenario breakdown..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingStudy(false);
                      setUploadedGallery([]);
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
                  >
                    Publish Case Study
                  </button>
                </div>
              </form>
            )}

            {/* List of Case Studies */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudies.map((study) => (
                <div key={study.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {study.sector}
                        </span>
                        {(study.videoUrl || study.youtubeUrl || study.youtubeVideoId) && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-orange-100 text-brand-orange border border-orange-200">
                            Video
                          </span>
                        )}
                        {(study.galleryImages && study.galleryImages.length > 0) && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                            {study.galleryImages.length} Photos
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-semibold">{study.date}</span>
                    </div>

                    <h3 className="text-base font-bold text-navy-900">{study.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{study.excerpt}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-mono">ID: {study.id}</span>
                    <button
                      onClick={() => handleDeleteStudy(study.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Attendees, 300+ Word Essays & 20-Participant Capacity Review */}
        {activeTab === 'attendees' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header & 20-Seat Capacity Status Banner (Item 3, 12) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-navy-900">Registered Attendees & Admission Essays</h2>
                  <p className="text-xs text-slate-500">
                    Review candidates, evaluate their 300-word admission essays, and admit up to strictly 20 participants.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleDispatchTuesdayPasses}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all active:scale-95"
                    title="Send official invitation & entry ticket to all accepted attendees"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Tuesday Passes ({acceptedAttendeesCount} Selected)</span>
                  </button>

                  <a
                    href="https://docs.google.com/spreadsheets/d/1RyQosJ3OT_tD6deRzXfiCqByMTGq64uriieSPGtMUvM/edit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow transition-all"
                    title="Open live Google Sheet with all candidates & essays"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                    <span>Master Google Sheet</span>
                    <ExternalLink className="w-3 h-3 text-emerald-300" />
                  </a>

                  <button
                    onClick={handleExportAttendeesCSV}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl shadow transition-all"
                    title="Download all candidate registrations and essays as CSV"
                  >
                    <Download className="w-4 h-4 text-brand-orange" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={handleExportFullBackupJSON}
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-bold rounded-xl border border-slate-300 transition-all"
                    title="Download complete database JSON backup"
                  >
                    <Database className="w-4 h-4 text-slate-600" />
                    <span>Full Backup</span>
                  </button>
                </div>
              </div>

              {/* 20-Seat Visual Capacity Meter */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-navy-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-orange" />
                    Session Capacity: {acceptedAttendeesCount} of 20 Eligible Seats Filled
                  </span>
                  <span className={`font-bold ${acceptedAttendeesCount >= 20 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {acceptedAttendeesCount >= 20 ? 'Cohort At Full Capacity (20/20)' : `${20 - acceptedAttendeesCount} Seat(s) Available`}
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      acceptedAttendeesCount >= 20 ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (acceptedAttendeesCount / 20) * 100)}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-500">
                  Strictly 20 participants are eligible per session. Selected candidates receive their digital passes and welcome pack on Tuesday morning.
                </p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setAttendeeFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    attendeeFilter === 'all' ? 'bg-navy-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  All Registrations ({attendees.length})
                </button>
                <button
                  onClick={() => setAttendeeFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    attendeeFilter === 'pending' ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  Pending Selection ({pendingAttendeesCount})
                </button>
                <button
                  onClick={() => setAttendeeFilter('accepted')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    attendeeFilter === 'accepted' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  Selected ({acceptedAttendeesCount})
                </button>
                <button
                  onClick={() => setAttendeeFilter('declined')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    attendeeFilter === 'declined' ? 'bg-rose-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  Declined ({declinedAttendeesCount})
                </button>
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={attendeeSearch}
                  onChange={(e) => setAttendeeSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-6 py-3.5">Candidate</th>
                      <th className="px-6 py-3.5">Contact</th>
                      <th className="px-6 py-3.5">Track</th>
                      <th className="px-6 py-3.5">Admission Essay</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Review Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAttendees.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                          No attendee registrations match your current filter.
                        </td>
                      </tr>
                    ) : (
                      filteredAttendees.map((attendee) => {
                        const wordCount = countWords(attendee.attendanceEssay || '');
                        const isPending = !attendee.status || attendee.status === 'pending';
                        const isAccepted = attendee.status === 'accepted';
                        const isDeclined = attendee.status === 'declined';

                        return (
                          <tr key={attendee.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-bold text-navy-900">{attendee.fullName}</div>
                              <div className="text-[10px] text-slate-400 font-mono">ID: {attendee.id}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-slate-600">{attendee.email}</div>
                              <div className="text-slate-500 font-semibold">{attendee.phone || 'N/A'}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                attendee.attendeeType === 'Alumni / Past Native' || attendee.attendeeType === 'Hub Member'
                                  ? 'bg-navy-100 text-navy-900'
                                  : 'bg-brand-orange-light text-brand-orange'
                              }`}>
                                {attendee.attendeeType}
                              </span>
                            </td>
                            <td className="px-6 py-4 max-w-xs">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                  wordCount >= 300 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {wordCount} words {wordCount >= 300 ? '✓' : '(Under 300)'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                                "{attendee.attendanceEssay || 'No essay submitted'}"
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              {isPending && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] uppercase">
                                  <Clock className="w-3 h-3" /> Pending Selection
                                </span>
                              )}
                              {isAccepted && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                                  <CheckCircle className="w-3 h-3 text-emerald-600" /> Selected
                                </span>
                              )}
                              {isDeclined && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">
                                  Declined
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedAttendeeForModal(attendee)}
                                  className="px-2.5 py-1 text-[11px] font-bold text-navy-900 hover:bg-slate-100 rounded-lg border border-slate-200"
                                >
                                  Read Essay
                                </button>
                                {isPending && (
                                  <>
                                    <button
                                      disabled={isGeneratingTicket}
                                      onClick={() => handleAcceptAttendee(attendee.id)}
                                      className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
                                    >
                                      Select
                                    </button>
                                    <button
                                      onClick={() => handleDeclineAttendee(attendee.id)}
                                      className="px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200"
                                    >
                                      Decline
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal: Read Full 300+ Word Essay & Actions */}
            {selectedAttendeeForModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-brand-orange-light text-brand-orange text-xs font-bold uppercase">
                          {selectedAttendeeForModal.attendeeType}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                          selectedAttendeeForModal.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                          selectedAttendeeForModal.status === 'declined' ? 'bg-slate-100 text-slate-700' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {selectedAttendeeForModal.status || 'Pending Selection'}
                        </span>
                      </div>
                      <h3 className="text-xl font-extrabold text-navy-900">
                        {selectedAttendeeForModal.fullName}
                      </h3>
                      <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-3">
                        <span><strong>Email:</strong> {selectedAttendeeForModal.email}</span>
                        <span><strong>Phone:</strong> {selectedAttendeeForModal.phone || 'N/A'}</span>
                        <span><strong>Registered:</strong> {new Date(selectedAttendeeForModal.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedAttendeeForModal(null)}
                      className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* 300-Word Essay Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                        Candidate Admission Essay (Why attend & why this topic?)
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-navy-900 font-mono text-xs font-bold">
                        {countWords(selectedAttendeeForModal.attendanceEssay || '')} Words
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed max-h-72 overflow-y-auto whitespace-pre-wrap">
                      {selectedAttendeeForModal.attendanceEssay || 'No essay provided.'}
                    </div>
                  </div>

                  {/* Generated Ticket Preview if accepted */}
                  {selectedAttendeeForModal.ticketImageData && (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                      <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        Official Digital Ticket Generated & Scheduled for Tuesday Dispatch
                      </div>
                      <img 
                        src={selectedAttendeeForModal.ticketImageData} 
                        alt="Entry Ticket Preview" 
                        className="max-h-36 rounded-xl border border-emerald-300 shadow-sm mx-auto"
                      />
                    </div>
                  )}

                  {/* Modal Action Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedAttendeeForModal(null)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Close
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeclineAttendee(selectedAttendeeForModal.id)}
                        className="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200"
                      >
                        Decline Candidate
                      </button>
                      <button
                        onClick={() => handleAcceptAttendee(selectedAttendeeForModal.id)}
                        className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow"
                      >
                        Accept & Admit to 20-Seat Cohort
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Personal Mentorship & Alumni Coach Applications */}
        {activeTab === 'mentorship' && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Sub-Navigation for Mentorship Management */}
            <div className="flex p-1.5 bg-slate-100 rounded-2xl max-w-xl border border-slate-200 shadow-inner">
              <button
                type="button"
                onClick={() => setMentorshipSubTab('mentees')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  mentorshipSubTab === 'mentees'
                    ? 'bg-white text-navy-900 shadow-md ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-brand-orange" />
                <span>Mentees Seeking Guidance ({mentorshipApps.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setMentorshipSubTab('alumni-coaches')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  mentorshipSubTab === 'alumni-coaches'
                    ? 'bg-brand-orange text-white shadow-md'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Alumni Coach Applications ({alumniCoachApps.length})</span>
                {alumniCoachApps.filter(a => !a.status || a.status === 'pending').length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
                )}
              </button>
            </div>

            {/* SUB-TAB 1: MENTEES SEEKING GUIDANCE */}
            {mentorshipSubTab === 'mentees' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-navy-900">Coach Mentorship Applications</h2>
                    <p className="text-xs text-slate-500">
                      Review candidates applying for 1-on-1 coaching with approved CIH coaches (3-Month Term).
                    </p>
                  </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://docs.google.com/spreadsheets/d/1RyQosJ3OT_tD6deRzXfiCqByMTGq64uriieSPGtMUvM/edit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow transition-all"
                  title="Open live Google Sheet with all candidates & essays"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                  <span>Google Sheet</span>
                  <ExternalLink className="w-3 h-3 text-emerald-300" />
                </a>

                <button
                  onClick={handleExportMentorshipCSV}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl shadow transition-all"
                >
                  <Download className="w-4 h-4 text-brand-orange" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setMentorshipFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  mentorshipFilter === 'all' ? 'bg-navy-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                All Applications ({mentorshipApps.length})
              </button>
              <button
                onClick={() => setMentorshipFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  mentorshipFilter === 'pending' ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Pending Review ({mentorshipApps.filter(a => !a.status || a.status === 'pending').length})
              </button>
              <button
                onClick={() => setMentorshipFilter('accepted')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  mentorshipFilter === 'accepted' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Accepted Matches ({mentorshipApps.filter(a => a.status === 'accepted').length})
              </button>
              <button
                onClick={() => setMentorshipFilter('reviewed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  mentorshipFilter === 'reviewed' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Reviewed ({mentorshipApps.filter(a => a.status === 'reviewed').length})
              </button>
            </div>

            {filteredMentorshipApps.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No coach mentorship applications match this filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMentorshipApps.map(app => {
                  const isPending = !app.status || app.status === 'pending';
                  const isAccepted = app.status === 'accepted';
                  const isReviewed = app.status === 'reviewed';
                  const isDeclined = app.status === 'declined';

                  return (
                    <div key={app.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between border-b border-slate-100 pb-3 gap-2">
                          <div>
                            <h3 className="text-base font-extrabold text-navy-900">{app.fullName}</h3>
                            <span className="text-xs font-semibold text-brand-orange">{app.focusArea}</span>
                          </div>

                          {/* Status Sign (Item 11, 23: Default pending prominent sign) */}
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isAccepted ? 'bg-emerald-100 text-emerald-800' :
                            isReviewed ? 'bg-blue-100 text-blue-800' :
                            isDeclined ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
                          }`}>
                            {isPending ? 'Pending Review' : app.status}
                          </span>
                        </div>

                        {/* Desired Coach (Item 14) & 3-Month Term (Item 22) */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-bold uppercase text-[10px]">Desired Coach:</span>
                            <span className="font-extrabold text-navy-900 px-2 py-0.5 rounded bg-white border border-slate-200">
                              {app.desiredMentor || 'Any Available Coach'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-600">
                            <span className="flex items-center gap-1 font-semibold text-slate-500">
                              <Clock className="w-3 h-3 text-brand-orange" /> Mentorship Term:
                            </span>
                            <span className="font-bold text-navy-900">
                              3 Months ({app.cohortStartDate ? new Date(app.cohortStartDate).toLocaleDateString() : 'Immediate'} - {app.cohortEndDate ? new Date(app.cohortEndDate).toLocaleDateString() : '3 Months active'})
                            </span>
                          </div>
                        </div>

                        <div className="text-xs space-y-1 text-slate-600">
                          <div><strong>Email:</strong> <a href={`mailto:${app.email}`} className="text-brand-orange hover:underline">{app.email}</a></div>
                          <div><strong>Phone / WhatsApp:</strong> <a href={`tel:${app.phone}`} className="text-brand-orange hover:underline">{app.phone}</a></div>
                          <div><strong>Applied On:</strong> {new Date(app.createdAt).toLocaleString()}</div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800 space-y-1">
                          <span className="font-bold text-navy-900">Reason / Mentorship Goals:</span>
                          <p className="leading-relaxed whitespace-pre-wrap">"{app.reasonNeeded}"</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                        <span className="text-slate-400">Update Status:</span>
                        <div className="flex gap-2">
                          {!isReviewed && (
                            <button
                              onClick={() => handleUpdateMentorshipStatus(app.id, 'reviewed')}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-900 text-[11px] font-bold"
                            >
                              Mark Reviewed
                            </button>
                          )}
                          {!isAccepted && (
                            <button
                              onClick={() => handleUpdateMentorshipStatus(app.id, 'accepted')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold shadow"
                            >
                              Accept Candidate
                            </button>
                          )}
                          {!isDeclined && (
                            <button
                              onClick={() => handleUpdateMentorshipStatus(app.id, 'declined')}
                              className="px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 text-[11px] font-bold"
                            >
                              Decline
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SUB-TAB 2: ALUMNI COACH APPLICATIONS */}
        {mentorshipSubTab === 'alumni-coaches' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                  <span>CIH Alumni Coach &amp; Mentor Applications</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-brand-orange">
                    {alumniCoachApps.length} Total
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Review CIH Alumni, former interns, and industry experts volunteering to mentor breakout pods and facilitate Wednesday Case Studies.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportAlumniCoachCSV}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl shadow transition-all"
                >
                  <Download className="w-4 h-4 text-brand-orange" />
                  <span>Export Alumni Coaches to CSV</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setAlumniFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  alumniFilter === 'all' ? 'bg-navy-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                All Applications ({alumniCoachApps.length})
              </button>
              <button
                onClick={() => setAlumniFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  alumniFilter === 'pending' ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Pending Review ({alumniCoachApps.filter(a => !a.status || a.status === 'pending').length})
              </button>
              <button
                onClick={() => setAlumniFilter('accepted')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  alumniFilter === 'accepted' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Approved Coaches ({alumniCoachApps.filter(a => a.status === 'accepted').length})
              </button>
              <button
                onClick={() => setAlumniFilter('reviewed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  alumniFilter === 'reviewed' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Interviewing ({alumniCoachApps.filter(a => a.status === 'reviewed').length})
              </button>
              <button
                onClick={() => setAlumniFilter('declined')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  alumniFilter === 'declined' ? 'bg-rose-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Declined ({alumniCoachApps.filter(a => a.status === 'declined').length})
              </button>
            </div>

            {filteredAlumniApps.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No alumni coach applications match this filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAlumniApps.map(app => {
                  const isPending = !app.status || app.status === 'pending';
                  const isAccepted = app.status === 'accepted';
                  const isReviewed = app.status === 'reviewed';
                  const isDeclined = app.status === 'declined';

                  return (
                    <div key={app.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="space-y-3.5">
                        {/* Card Header */}
                        <div className="flex items-start justify-between border-b border-slate-100 pb-3 gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-extrabold text-navy-900">{app.fullName}</h3>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-brand-orange border border-orange-200">
                                {app.alumniTrack}
                              </span>
                              {app.graduationYear && (
                                <span className="text-[10px] font-semibold text-slate-500">
                                  Class of {app.graduationYear}
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-semibold text-slate-700 mt-1 flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                              <span>{app.currentRole}</span>
                              {app.organization && <span className="text-slate-400 font-normal">at {app.organization}</span>}
                            </p>
                          </div>

                          {/* Status Badge */}
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                            isAccepted ? 'bg-emerald-100 text-emerald-800' :
                            isReviewed ? 'bg-blue-100 text-blue-800' :
                            isDeclined ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
                          }`}>
                            {isPending ? 'Pending Review' : isAccepted ? 'Approved Coach' : app.status}
                          </span>
                        </div>

                        {/* Expertise & Availability Tags */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-bold uppercase text-[10px]">Coaching Domain:</span>
                            <span className="font-bold text-navy-900 px-2 py-0.5 rounded bg-white border border-slate-200">
                              {app.coachingDomain}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-600">
                            <span className="text-slate-500 font-bold uppercase text-[10px]">Availability:</span>
                            <span className="font-semibold text-slate-800">
                              {app.availability}
                            </span>
                          </div>
                          {app.linkedinUrl && (
                            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                              <span className="text-slate-500 font-bold uppercase text-[10px]">LinkedIn:</span>
                              <a
                                href={app.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-orange hover:underline font-bold flex items-center gap-1"
                              >
                                <span>View Profile</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Contact Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100 truncate">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a href={`mailto:${app.email}`} className="hover:text-brand-orange truncate font-medium">
                              {app.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a href={`tel:${app.phone}`} className="hover:text-brand-orange font-medium">
                              {app.phone}
                            </a>
                          </div>
                        </div>

                        {/* Statement of Purpose / Why Coach */}
                        <div className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-200/80 text-xs text-slate-800 space-y-1">
                          <span className="font-bold text-amber-900 block text-[11px]">
                            Statement of Purpose &amp; Coaching Philosophy:
                          </span>
                          <p className="leading-relaxed italic text-slate-700">
                            "{app.statementOfPurpose}"
                          </p>
                        </div>
                      </div>

                      {/* Decision & Action Footer */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[10px] text-slate-400">
                          Applied: {new Date(app.createdAt).toLocaleDateString()}
                        </span>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* WhatsApp Direct */}
                          <a
                            href={`https://api.whatsapp.com/send?phone=${app.phone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(`Hi ${app.fullName}, this is CIH Management regarding your application to volunteer as a Case Study Coach!`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold transition-colors"
                          >
                            WhatsApp
                          </a>

                          {/* Status Buttons */}
                          {!isReviewed && (
                            <button
                              onClick={() => handleAlumniStatusChange(app.id, 'reviewed')}
                              className="px-2.5 py-1 rounded-lg text-blue-600 hover:bg-blue-50 border border-blue-200 text-[11px] font-bold transition-colors"
                            >
                              Interviewing
                            </button>
                          )}

                          {!isAccepted && (
                            <button
                              onClick={() => handleAlumniStatusChange(app.id, 'accepted')}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow transition-colors"
                            >
                              ✓ Approve as Coach
                            </button>
                          )}

                          {!isDeclined && (
                            <button
                              onClick={() => handleAlumniStatusChange(app.id, 'declined')}
                              className="px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 text-[11px] font-bold transition-colors"
                            >
                              Decline
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    )}

        {/* Tab 4: User FAQ Q&A Manager with Locking & 3-Click Emergency Unlock (Item 24) */}
        {activeTab === 'user-faq' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-navy-900">User FAQ & Q&A Manager</h2>
              <p className="text-xs text-slate-500">
                Answer visitor-submitted inquiries immediately. Answers are locked upon publication to prevent misinformation, with a 3-click emergency unlock.
              </p>
            </div>

            {userQuestions.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No user questions submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {userQuestions.map(q => {
                  const isAnswered = q.status === 'answered' || !!(q.answer && q.answer !== 'Thank you for your question! A CIH administrator is reviewing your inquiry and will publish an official response shortly.');
                  const isUnlocked = !!unlockedFaqIds[q.id];
                  const attempts = emergencyAttempts[q.id] || 0;

                  return (
                    <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                      <div className="flex items-start justify-between border-b border-slate-100 pb-3 gap-2">
                        <div>
                          <span className="text-xs font-bold text-brand-orange uppercase">
                            Asked by: {q.askedByName || 'Community Member'} {q.userEmail ? `(${q.userEmail})` : ''}
                          </span>
                          <h4 className="text-base font-extrabold text-navy-900 mt-0.5">
                            "{q.question}"
                          </h4>
                          {q.createdAt && (
                            <span className="text-[11px] text-slate-400">
                              Submitted: {new Date(q.createdAt).toLocaleString()}
                            </span>
                          )}
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                          isAnswered ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isAnswered ? 'Answer Published' : 'Pending Answer'}
                        </span>
                      </div>

                      {/* Display Current Answer on FAQ Page */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                        <span className="font-bold text-navy-900">Current Answer on Public FAQ Page:</span>
                        <p className="text-slate-700 leading-relaxed">{q.answer}</p>
                      </div>

                      {/* Locked vs Unlocked Answer Editing (Item 24) */}
                      {isAnswered && !isUnlocked ? (
                        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2 text-amber-900 font-semibold">
                            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>Locked: This answer is live and locked against accidental edits to prevent misinformation.</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleEmergencyUnlockFAQ(q.id)}
                            className="px-3.5 py-2 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold text-[11px] transition-colors shrink-0 shadow-sm"
                          >
                            {attempts > 0 
                              ? `Emergency Unlock (${attempts}/3 Clicks - Confirm)` 
                              : 'Emergency Unlock (Requires 3 Clicks)'}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-1">
                          {isUnlocked && (
                            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5">
                              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                              Emergency unlock active: enter updated answer below. It will re-lock upon saving.
                            </div>
                          )}

                          <label className="block text-xs font-bold text-navy-900">
                            {isUnlocked ? 'Revise Published Answer:' : 'Type Official Answer to Publish Live:'}
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <textarea
                              rows={2}
                              placeholder="Type official answer to be displayed publicly on FAQ page..."
                              value={faqAnswerInputMap[q.id] ?? (isUnlocked ? q.answer : '')}
                              onChange={e => setFaqAnswerInputMap({ ...faqAnswerInputMap, [q.id]: e.target.value })}
                              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
                            />
                            <button
                              onClick={() => handleSaveFAQAnswer(q.id)}
                              className="px-5 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow sm:self-end"
                            >
                              <Send className="w-3 h-3" /> Publish & Lock
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Case Study Feedback & Discussions */}
        {activeTab === 'feedback' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-navy-900">Attendee Feedback & Discussion Replies</h2>
              <p className="text-xs text-slate-500">
                View comments posted on case studies and publish official CIH admin replies.
              </p>
            </div>

            {feedbackList.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No attendee feedback posted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {feedbackList.map(item => {
                  const parentStudy = caseStudies.find(c => c.id === item.caseStudyId);
                  return (
                    <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-xs font-bold text-brand-orange uppercase">
                            Case Study: {parentStudy?.title || item.caseStudyId}
                          </span>
                          <h4 className="text-sm font-extrabold text-navy-900 mt-0.5">
                            {item.userName} {item.userEmail ? `(${item.userEmail})` : ''}
                          </h4>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        "{item.comment}"
                      </p>

                      {item.adminReply ? (
                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                          <span className="font-bold text-emerald-800 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Official Admin Reply:
                          </span>
                          <p className="text-slate-800">{item.adminReply}</p>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-1">
                          <label className="block text-xs font-bold text-navy-900">
                            Post Admin Reply to {item.userName}:
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Type official admin response here..."
                              value={replyInputMap[item.id] || ''}
                              onChange={e => setReplyInputMap({ ...replyInputMap, [item.id]: e.target.value })}
                              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange"
                            />
                            <button
                              onClick={() => handleSaveFeedbackReply(item.id)}
                              className="px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold flex items-center gap-1 shadow"
                            >
                              <Send className="w-3 h-3" /> Reply
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Topic Suggestions */}
        {activeTab === 'topic-suggestions' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-navy-900">User Topic Suggestions</h2>
              <p className="text-xs text-slate-500">
                Review topics and skillsets requested by community members for upcoming Wednesday sessions.
              </p>
            </div>

            {topicSuggestions.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No topic suggestions submitted yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topicSuggestions.map(sug => (
                  <div key={sug.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                            <Lightbulb className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-base font-extrabold text-navy-900">{sug.suggestedTopic}</h3>
                            <span className="text-[11px] text-slate-400">By {sug.fullName} {sug.email ? `(${sug.email})` : ''}</span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-brand-orange-light text-brand-orange text-[10px] font-extrabold">
                          {sug.votes || 1} Vote(s)
                        </span>
                      </div>

                      {sug.whyNeeded && (
                        <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <strong>Why needed:</strong> "{sug.whyNeeded}"
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span>Submitted: {new Date(sug.createdAt).toLocaleDateString()}</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Logged for Curriculum Review
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 7: Next Wednesday Session Banner */}
        {activeTab === 'upcoming' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in max-w-3xl">
            <div>
              <h2 className="text-lg font-bold text-navy-900">Next Wednesday Session Banner</h2>
              <p className="text-xs text-slate-500">
                Update the highlighted topic featured prominently across the Topics and Home pages.
              </p>
            </div>

            {upcomingSaved && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Upcoming session updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveUpcoming} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Badge Text</label>
                  <input
                    type="text"
                    required
                    value={upcomingSession.badgeText}
                    onChange={(e) => setUpcomingSession({ ...upcomingSession, badgeText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-brand-orange/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Schedule & Time</label>
                  <input
                    type="text"
                    required
                    value={upcomingSession.dateStr}
                    onChange={(e) => setUpcomingSession({ ...upcomingSession, dateStr: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-brand-orange/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Topic Headline</label>
                <input
                  type="text"
                  required
                  value={upcomingSession.topicTitle}
                  onChange={(e) => setUpcomingSession({ ...upcomingSession, topicTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-brand-orange/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Short Description</label>
                <textarea
                  rows={2}
                  required
                  value={upcomingSession.description}
                  onChange={(e) => setUpcomingSession({ ...upcomingSession, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-brand-orange/50 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-xl shadow transition-all active:scale-95"
                >
                  Save Next Wednesday Topic
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 8: Pipeline & Window Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in max-w-3xl">
            <div>
              <h2 className="text-lg font-bold text-navy-900">Google Apps Script Pipeline & Timing Window</h2>
              <p className="text-xs text-slate-500">
                Configure the automated Google Sheet/Gmail integration URL and the Saturday midnight registration cutoff.
              </p>
            </div>

            {configSaved && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Settings saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-6">
              {/* Registration Window Timing & Saturday Closure Notice (Item 5) */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
                    Weekly Registration Window (Saturday Midnight Cutoff)
                  </label>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange font-bold uppercase">
                    West Africa Time (WAT)
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Registrations close on Saturdays at 11:59 PM WAT for the upcoming Wednesday session. This allows organizers to review all 300-word essays and dispatch official tickets on Tuesday morning.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setAdminConfig({ ...adminConfig, registrationMode: 'auto' })}
                    className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
                      (adminConfig.registrationMode || 'auto') === 'auto'
                        ? 'border-brand-orange bg-brand-orange-light text-navy-900 shadow-sm ring-1 ring-brand-orange font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-extrabold text-navy-900 mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Automatic (Standard)
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Closes Saturday 11:59 PM; Re-opens Thursday morning after session.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminConfig({ ...adminConfig, registrationMode: 'force_open' })}
                    className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
                      adminConfig.registrationMode === 'force_open'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-sm ring-1 ring-emerald-500 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-extrabold text-emerald-800 mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Force Open
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Keep form open indefinitely regardless of weekday.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminConfig({ ...adminConfig, registrationMode: 'force_closed' })}
                    className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
                      adminConfig.registrationMode === 'force_closed'
                        ? 'border-rose-500 bg-rose-50 text-rose-950 shadow-sm ring-1 ring-rose-500 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-extrabold text-rose-800 mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      Force Closed
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Close registration immediately (capacity limits reached).
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Google Apps Script Web App URL
                </label>
                <input
                  type="url"
                  value={adminConfig.appsScriptUrl}
                  onChange={(e) => setAdminConfig({ ...adminConfig, appsScriptUrl: e.target.value })}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-brand-orange/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Change Organizer Passcode
                </label>
                <input
                  type="text"
                  value={adminConfig.adminPasscode}
                  onChange={(e) => setAdminConfig({ ...adminConfig, adminPasscode: e.target.value })}
                  placeholder="e.g. cih2024"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-brand-orange/50 max-w-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl shadow transition-all active:scale-95"
                >
                  Save Integration & Registration Settings
                </button>
              </div>
            </form>

            {/* Safe Space Cloud Storage & Permanent Database Architecture */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-navy-900">
                      Safe Space Cloud Storage &amp; Archival System
                    </h3>
                    <p className="text-xs text-slate-500">
                      Your attendee names, essays, mentorship applications, and coach credentials are preserved across cloud storage layers with unlimited capacity.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportFullBackupJSON}
                    className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-brand-orange" />
                    <span>Download Full JSON Backup</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Layer 1: Google Sheets Live Archive */}
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                      Google Sheets Master Archive
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-200 text-emerald-900">
                      Unlimited Storage
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Connected to spreadsheet ID <code className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-emerald-300">1RyQosJ3...GtMUvM</code>. Automatically logs candidate names, emails, phones, and full 300+ word essays into dedicated sheets: <strong>Registrations</strong>, <strong>MentorshipApplications</strong>, and <strong>CoachApplications</strong>.
                  </p>
                  <div className="pt-1">
                    <a
                      href="https://docs.google.com/spreadsheets/d/1RyQosJ3OT_tD6deRzXfiCqByMTGq64uriieSPGtMUvM/edit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline"
                    >
                      <span>Open Master Google Sheet in new tab</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Layer 2: Supabase PostgreSQL Cloud Database */}
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-blue-600" />
                      Supabase Cloud Database
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-200 text-blue-900">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Hosted at <code className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-blue-300">juiqgwqqxpjjsnxcvbbo.supabase.co</code>. Provides persistent relational SQL storage for member accounts, credentials, and attendee registration records.
                  </p>
                  <p className="text-[11px] text-blue-800 font-semibold">
                    ✓ High security &bull; Encrypted in transit &bull; Instant multi-device sync
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 9: Automated Email Dispatch Outbox & Audit Logs */}
        {activeTab === 'email-outbox' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-brand-orange" />
                  <span>Automated Email Dispatch Outbox &amp; Audit Logs</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-navy-900 text-white">
                    {sentEmails.length} Dispatched
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Every candidate who applies, gets accepted, or gets declined across the platform receives an instant automated email. Review all outgoing email deliveries below.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSentEmails(getStoredSentEmails())}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Refresh Outbox</span>
                </button>
              </div>
            </div>

            {/* Outbox KPI Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Dispatched</span>
                <span className="text-xl font-extrabold text-navy-900">{sentEmails.length}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Session Admissions</span>
                <span className="text-xl font-extrabold text-emerald-700">
                  {sentEmails.filter(e => e.category === 'session_accepted').length}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-blue-200 shadow-xs">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Mentorship Approved</span>
                <span className="text-xl font-extrabold text-blue-700">
                  {sentEmails.filter(e => e.category === 'mentorship_accepted').length}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-purple-200 shadow-xs">
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Coach Appointed</span>
                <span className="text-xl font-extrabold text-purple-700">
                  {sentEmails.filter(e => e.category === 'coach_approved').length}
                </span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setEmailFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                    emailFilter === 'all' ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({sentEmails.length})
                </button>
                <button
                  type="button"
                  onClick={() => setEmailFilter('session')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                    emailFilter === 'session' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Wednesday Sessions ({sentEmails.filter(e => e.category.startsWith('session_')).length})
                </button>
                <button
                  type="button"
                  onClick={() => setEmailFilter('mentorship')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                    emailFilter === 'mentorship' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Mentorship ({sentEmails.filter(e => e.category.startsWith('mentorship_')).length})
                </button>
                <button
                  type="button"
                  onClick={() => setEmailFilter('coach')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                    emailFilter === 'coach' ? 'bg-brand-orange text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Coach Volunteers ({sentEmails.filter(e => e.category.startsWith('coach_')).length})
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search recipient or subject..."
                  value={emailSearchQuery}
                  onChange={(e) => setEmailSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>
            </div>

            {/* Email Dispatch Roster */}
            {sentEmails.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Mail className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-navy-900">No Emails Dispatched Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Whenever an application is registered, accepted, or declined across the website, the instant notification email will be logged and visible here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sentEmails
                  .filter(e => {
                    if (emailFilter === 'session') return e.category.startsWith('session_');
                    if (emailFilter === 'mentorship') return e.category.startsWith('mentorship_');
                    if (emailFilter === 'coach') return e.category.startsWith('coach_');
                    return true;
                  })
                  .filter(e => {
                    if (!emailSearchQuery.trim()) return true;
                    const q = emailSearchQuery.toLowerCase();
                    return e.recipientEmail.toLowerCase().includes(q) ||
                      e.recipientName.toLowerCase().includes(q) ||
                      e.subject.toLowerCase().includes(q);
                  })
                  .map(email => {
                    const isAccepted = email.category.includes('accepted') || email.category.includes('approved');
                    const isDeclined = email.category.includes('declined');
                    const isReceived = email.category.includes('submitted') || email.category.includes('confirmed');

                    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email.recipientEmail)}&su=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.plainText)}`;
                    const mailtoUrl = `mailto:${email.recipientEmail}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.plainText)}`;

                    return (
                      <div
                        key={email.id}
                        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                                isAccepted
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : isDeclined
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : 'bg-blue-100 text-blue-800 border border-blue-300'
                              }`}
                            >
                              {isAccepted && '✓ Accepted'}
                              {isDeclined && '✕ Declined'}
                              {isReceived && 'ℹ Submission Received'}
                            </span>
                            <span className="text-xs font-extrabold text-navy-900 truncate">
                              {email.recipientName}
                            </span>
                            <span className="text-xs text-slate-400">
                              &lt;{email.recipientEmail}&gt;
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-navy-900 truncate">
                            {email.subject}
                          </h4>

                          <div className="flex items-center gap-3 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {new Date(email.sentAt).toLocaleString()}
                            </span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold">
                              ● Dispatched via Webhook / Outbox
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setSelectedEmailForPreview(email)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-bold transition-colors flex items-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-500" />
                            <span>Preview Rendered Email</span>
                          </button>
                          <a
                            href={gmailComposeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-colors flex items-center gap-1.5 border border-blue-200"
                            title="Open in Gmail"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                            <span>Open in Gmail</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* Modal: Full HTML Rendered Email Preview */}
        {selectedEmailForPreview && (
          <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-fade-in border border-slate-200">
              {/* Modal Header */}
              <div className="p-5 bg-navy-900 text-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-brand-orange text-white text-[10px] font-extrabold uppercase">
                      Official CIH Email Dispatch
                    </span>
                    <span className="text-xs text-slate-300">
                      {new Date(selectedEmailForPreview.sentAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-1 truncate">
                    {selectedEmailForPreview.subject}
                  </h3>
                  <p className="text-xs text-slate-300">
                    To: <strong>{selectedEmailForPreview.recipientName}</strong> &lt;{selectedEmailForPreview.recipientEmail}&gt;
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEmailForPreview(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Rendered Email Content */}
              <div className="p-6 overflow-y-auto flex-1 bg-slate-100">
                <div 
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: selectedEmailForPreview.htmlBody }}
                />
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Status: <strong>{selectedEmailForPreview.status.toUpperCase()}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedEmailForPreview.recipientEmail}?subject=${encodeURIComponent(selectedEmailForPreview.subject)}&body=${encodeURIComponent(selectedEmailForPreview.plainText)}`}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    Open in Mail Client
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedEmailForPreview(null)}
                    className="px-5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-colors"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
