import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL as string;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  interview_count: number;
  created_at: string;
  settings: {
    preferred_language: string;
    interview_duration: number;
    feedback_preference: string;
    voice_id: string;
  };
};

export type InterviewSession = {
  id: string;
  user_id: string;
  type: string;
  difficulty: string;
  duration: number;
  skills: string[];
  feedback: {
    overall_score: number;
    technical_score?: number;
    communication_score: number;
    suggestions: string[];
  };
  created_at: string;
}; 