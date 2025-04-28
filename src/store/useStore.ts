import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { InterviewSession, UserProfile } from '../lib/supabase';

interface InterviewState {
  // User settings and preferences
  settings: {
    interviewDuration: number;
    preferredLanguage: string;
    voiceId: string;
    feedbackPreference: 'detailed' | 'brief' | 'end';
  };
  
  // Current interview session
  currentSession: {
    isActive: boolean;
    startTime?: number;
    type: string;
    difficulty: string;
    skills: string[];
  };
  
  // Interview progress
  progress: {
    currentStage: string;
    completedStages: string[];
    metrics: {
      overallScore: number;
      technicalScore?: number;
      communicationScore: number;
      confidenceScore: number;
    };
  };

  // Authentication state
  auth: {
    isAuthenticated: boolean;
    user?: UserProfile;
    session?: InterviewSession;
  };

  // Actions
  setSettings: (settings: Partial<InterviewState['settings']>) => void;
  startInterview: (config: Partial<InterviewState['currentSession']>) => void;
  endInterview: () => void;
  updateProgress: (progress: Partial<InterviewState['progress']>) => void;
  setAuth: (auth: Partial<InterviewState['auth']>) => void;
}

export const useStore = create<InterviewState>()(
  persist(
    (set) => ({
      // Initial state
      settings: {
        interviewDuration: 45,
        preferredLanguage: 'en-US',
        voiceId: 'default',
        feedbackPreference: 'detailed',
      },

      currentSession: {
        isActive: false,
        type: 'technical',
        difficulty: 'medium',
        skills: [],
      },

      progress: {
        currentStage: 'introduction',
        completedStages: [],
        metrics: {
          overallScore: 0,
          communicationScore: 0,
          confidenceScore: 0,
        },
      },

      auth: {
        isAuthenticated: false,
      },

      // Actions
      setSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      startInterview: (config) =>
        set((state) => ({
          currentSession: {
            ...state.currentSession,
            ...config,
            isActive: true,
            startTime: Date.now(),
          },
        })),

      endInterview: () =>
        set((state) => ({
          currentSession: {
            ...state.currentSession,
            isActive: false,
          },
        })),

      updateProgress: (newProgress) =>
        set((state) => ({
          progress: { ...state.progress, ...newProgress },
        })),

      setAuth: (newAuth) =>
        set((state) => ({
          auth: { ...state.auth, ...newAuth },
        })),
    }),
    {
      name: 'lomia-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        auth: {
          isAuthenticated: state.auth.isAuthenticated,
          user: state.auth.user,
        },
      }),
    }
  )
); 