import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { BriefingPage } from './pages/BriefingPage';
import { TopicsPage } from './pages/TopicsPage';
import { PastStudiesPage } from './pages/PastStudiesPage';
import { RegisterPage } from './pages/RegisterPage';
import { MentorshipPage } from './pages/MentorshipPage';
import { FAQPage } from './pages/FAQPage';
import { AdminPage } from './pages/AdminPage';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthProvider } from './context/AuthContext';

// Scroll to top helper on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <ScrollToTop />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<BriefingPage />} />
            <Route path="/briefing" element={<Navigate to="/about" replace />} />
            <Route path="/topics" element={<TopicsPage />} />
            <Route path="/mentorship" element={<MentorshipPage />} />
            <Route path="/past-case-studies" element={<PastStudiesPage />} />
            <Route path="/past-studies" element={<PastStudiesPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};
