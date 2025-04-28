import { db, InterviewRecording, InterviewFeedback } from '../db/database';
import { supabase, UserProfile, InterviewSession } from '../lib/supabase';
import { useStore } from '../store/useStore';

export class StorageService {
  // Local Storage Operations (Zustand)
  static getSettings() {
    return useStore.getState().settings;
  }

  static updateSettings(settings: Partial<typeof useStore.getState().settings>) {
    useStore.getState().setSettings(settings);
  }

  // IndexedDB Operations (Dexie)
  static async saveRecording(recording: Omit<InterviewRecording, 'id'>) {
    return await db.recordings.add(recording);
  }

  static async getRecordings() {
    return await db.recordings.orderBy('timestamp').reverse().toArray();
  }

  static async saveFeedback(feedback: Omit<InterviewFeedback, 'id'>) {
    return await db.feedback.add(feedback);
  }

  static async getFeedbackForRecording(recordingId: number) {
    return await db.feedback.where('recordingId').equals(recordingId).first();
  }

  // Supabase Operations
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      useStore.getState().setAuth({
        isAuthenticated: true,
        user: profile as UserProfile,
      });
    }

    return data;
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    useStore.getState().setAuth({
      isAuthenticated: false,
      user: undefined,
      session: undefined,
    });
  }

  static async saveInterviewSession(session: Omit<InterviewSession, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('interview_sessions')
      .insert([{ ...session, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async syncLocalData() {
    if (!useStore.getState().auth.isAuthenticated) return;

    const recordings = await db.recordings.toArray();
    const feedback = await db.feedback.toArray();

    // Sync recordings and feedback to Supabase
    const { error } = await supabase.from('interview_data').insert(
      recordings.map((recording) => ({
        user_id: useStore.getState().auth.user?.id,
        recording_data: recording,
        feedback_data: feedback.find((f) => f.recordingId === recording.id),
        synced_at: new Date().toISOString(),
      }))
    );

    if (error) throw error;
  }

  // Utility methods
  static async clearLocalData() {
    await db.delete();
    localStorage.clear();
    useStore.getState().setAuth({
      isAuthenticated: false,
      user: undefined,
      session: undefined,
    });
  }

  static async exportData() {
    const recordings = await db.recordings.toArray();
    const feedback = await db.feedback.toArray();
    const settings = useStore.getState().settings;

    return {
      recordings,
      feedback,
      settings,
      exportDate: new Date().toISOString(),
    };
  }
} 