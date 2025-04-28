import Dexie, { Table } from 'dexie';

export interface InterviewRecording {
  id?: number;
  timestamp: number;
  audioData: Blob;
  duration: number;
  metadata: {
    type: string;
    difficulty: string;
    skills: string[];
  };
}

export interface InterviewFeedback {
  id?: number;
  recordingId: number;
  timestamp: number;
  metrics: {
    clarity: number;
    confidence: number;
    technicalAccuracy?: number;
    sentiment: 'positive' | 'neutral' | 'negative';
  };
  suggestions: string[];
  strengths: string[];
  improvements: string[];
}

export class LomiaDatabase extends Dexie {
  recordings!: Table<InterviewRecording>;
  feedback!: Table<InterviewFeedback>;

  constructor() {
    super('LomiaDB');
    this.version(1).stores({
      recordings: '++id, timestamp',
      feedback: '++id, recordingId, timestamp'
    });
  }
}

export const db = new LomiaDatabase(); 