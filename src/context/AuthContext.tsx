import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { authService, LoginPayload } from '../services/auth';
import { INITIAL_USER_PROFILE } from '../data/mockData';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: LoginPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Check local storage for existing session
    const saved = localStorage.getItem('life_rpg_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USER_PROFILE;
      }
    }
    return INITIAL_USER_PROFILE;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('life_rpg_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('life_rpg_user');
    }
  }, [user]);

  const login = async (payload: LoginPayload): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await authService.login(payload);
      if (res.success && res.data) {
        setUser(res.data.user);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: LoginPayload): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await authService.register(payload);
      if (res.success && res.data) {
        setUser(res.data.user);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const completeOnboarding = () => {
    setUser((prev) => (prev ? { ...prev, onboardingCompleted: true } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        completeOnboarding,
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
