import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, SignUpFormData } from '../types';
import { 
  getStoredAuthUser, 
  saveStoredAuthUser, 
  getStoredUsers, 
  saveStoredUsers,
  saveRememberedAccount,
  setLastLoginEmail
} from '../services/storage';
import { insertUserToSupabase } from '../services/supabase';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAlumni: boolean;
  isMentorVolunteer: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  signup: (data: SignUpFormData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => void;
  authModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  initialSignupRole: 'guest' | 'alumni';
  openAuthModal: (mode?: 'login' | 'signup', defaultRole?: 'guest' | 'alumni') => void;
  closeAuthModal: () => void;
  profileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredAuthUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [initialSignupRole, setInitialSignupRole] = useState<'guest' | 'alumni'>('guest');
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    // Initial sync
    const saved = getStoredAuthUser();
    if (saved) {
      setUser(saved);
    } else {
      // Pop up immediately after loading website if not logged in
      const timer = setTimeout(() => {
        setAuthModalMode('signup');
        setAuthModalOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  const openAuthModal = (mode: 'login' | 'signup' = 'login', defaultRole: 'guest' | 'alumni' = 'guest') => {
    setAuthModalMode(mode);
    setInitialSignupRole(defaultRole);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const openProfileModal = () => {
    setProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
  };

  const login = async (email: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const allUsers = getStoredUsers();
    const foundUser = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      // If user doesn't exist yet, we can create a guest account on the fly or prompt
      return {
        success: false,
        message: 'No account found with this email. Please sign up or check your credentials.'
      };
    }

    if (foundUser.passwordHash && cleanPass && foundUser.passwordHash !== cleanPass) {
      return {
        success: false,
        message: 'Incorrect password. Please try again.'
      };
    }

    const authSession: AuthUser = {
      id: foundUser.id,
      fullName: foundUser.fullName,
      email: foundUser.email,
      phone: foundUser.phone,
      role: foundUser.role,
      isAlumni: foundUser.isAlumni,
      alumniCohort: foundUser.alumniCohort,
      isMentorVolunteer: foundUser.isMentorVolunteer,
      mentorFocusAreas: foundUser.mentorFocusAreas,
      mentorBio: foundUser.mentorBio,
      createdAt: foundUser.createdAt
    };

    setUser(authSession);
    saveStoredAuthUser(authSession);
    saveRememberedAccount({
      email: foundUser.email,
      fullName: foundUser.fullName,
      role: foundUser.role,
      alumniCohort: foundUser.alumniCohort,
    });
    setLastLoginEmail(foundUser.email);
    closeAuthModal();

    return { success: true, message: `Welcome back, ${foundUser.fullName}!` };
  };

  const signup = async (data: SignUpFormData): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanName = data.fullName.trim();

    if (!cleanName || !cleanEmail) {
      return { success: false, message: 'Please provide your full name and valid email.' };
    }

    const allUsers = getStoredUsers();
    if (allUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'An account with this email already exists. Please log in.' };
    }

    const isAlumni = data.role === 'alumni';

    const newUser: AuthUser & { passwordHash?: string } = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fullName: cleanName,
      email: cleanEmail,
      phone: data.phone.trim(),
      passwordHash: data.password ? data.password.trim() : 'cihpass123',
      role: data.role,
      isAlumni,
      alumniCohort: isAlumni ? (data.alumniCohort || 'CIH Alumni Native') : undefined,
      isMentorVolunteer: isAlumni ? !!data.isMentorVolunteer : false,
      mentorFocusAreas: isAlumni && data.isMentorVolunteer ? (data.mentorFocusAreas || []) : undefined,
      mentorBio: isAlumni && data.isMentorVolunteer ? (data.mentorBio || '') : undefined,
      createdAt: new Date().toISOString()
    };

    // Save to users directory
    saveStoredUsers([newUser, ...allUsers]);

    // Sync user profile to Supabase database (if configured)
    insertUserToSupabase(newUser).catch((err) => {
      console.warn('Supabase user profile sync notice:', err);
    });

    // Set active session
    const authSession: AuthUser = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      isAlumni: newUser.isAlumni,
      alumniCohort: newUser.alumniCohort,
      isMentorVolunteer: newUser.isMentorVolunteer,
      mentorFocusAreas: newUser.mentorFocusAreas,
      mentorBio: newUser.mentorBio,
      createdAt: newUser.createdAt
    };

    setUser(authSession);
    saveStoredAuthUser(authSession);
    saveRememberedAccount({
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
      alumniCohort: newUser.alumniCohort,
    });
    setLastLoginEmail(newUser.email);
    closeAuthModal();

    return { 
      success: true, 
      message: isAlumni 
        ? (newUser.isMentorVolunteer ? `Welcome to CIH Alumni Mentorship, ${cleanName}!` : `Welcome back, CIH Alumni ${cleanName}!`) 
        : `Welcome to Community Innovation Hub, ${cleanName}!` 
    };
  };

  const logout = () => {
    setUser(null);
    saveStoredAuthUser(null);
    setProfileModalOpen(false);
  };

  const updateProfile = (data: Partial<AuthUser>) => {
    if (!user) return;
    const updated: AuthUser = { ...user, ...data };
    setUser(updated);
    saveStoredAuthUser(updated);

    // Also update in all users store
    const allUsers = getStoredUsers();
    const updatedAll = allUsers.map((u) => u.id === user.id ? { ...u, ...data } : u);
    saveStoredUsers(updatedAll);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAlumni: user?.role === 'alumni' || !!user?.isAlumni,
        isMentorVolunteer: !!user?.isMentorVolunteer,
        login,
        signup,
        logout,
        updateProfile,
        authModalOpen,
        authModalMode,
        initialSignupRole,
        openAuthModal,
        closeAuthModal,
        profileModalOpen,
        openProfileModal,
        closeProfileModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
