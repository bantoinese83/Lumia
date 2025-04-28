import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLiveAPIContext } from '../../contexts/LiveAPIContext';
import { GeminiService } from '../../services/geminiService';
import './transcript.scss';

interface Word {
  text: string;
  type: 'filler' | 'stop' | 'technical' | 'normal';
  confidence: number;
}

interface TranscriptSegment {
  words: Word[];
  timestamp: number;
  isUser: boolean;
  feedback?: {
    clarity: number;
    confidence: number;
    technicalAccuracy?: number;
    suggestions: string[];
  };
}

const FILLER_WORDS = new Set([
  'um', 'uh', 'like', 'you know', 'sort of', 'kind of', 'basically',
  'actually', 'literally', 'stuff', 'things', 'whatever'
]);

const TECHNICAL_TERMS = new Set([
  'algorithm', 'api', 'database', 'framework', 'function', 'interface',
  'javascript', 'python', 'react', 'server', 'typescript', 'component'
]);

export const TranscriptDisplay: React.FC = () => {
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [metrics, setMetrics] = useState({
    fillerWordCount: 0,
    technicalTermCount: 0,
    averageConfidence: 0,
    clarityScore: 0,
  });
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { connected } = useLiveAPIContext();
  const geminiService = GeminiService.getInstance();

  const startRecognition = useCallback(() => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.start();
      setError(null);
      setRetryCount(0);
    } catch (err) {
      console.error('Failed to start recognition:', err);
      setError('Failed to start speech recognition');
    }
  }, []);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in your browser');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setIsListening(false);
      // If we're still connected and haven't exceeded retry attempts, restart
      if (connected && retryCount < 3) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          startRecognition();
        }, 1000); // Wait 1 second before retrying
      } else if (retryCount >= 3) {
        setError('Speech recognition stopped. Please refresh the page to try again.');
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      switch (event.error) {
        case 'no-speech':
          // Ignore no-speech errors as they're common
          break;
        case 'audio-capture':
          setError('No microphone was found or microphone is disabled');
          break;
        case 'not-allowed':
          setError('Microphone permission was denied');
          break;
        case 'network':
          setError('Network error occurred. Please check your connection');
          break;
        default:
          setError(`Error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onresult = async (event) => {
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        const words = lastResult[0].transcript.trim().split(' ').map(word => {
          const lowerWord = word.toLowerCase();
          let type: Word['type'] = 'normal';
          
          if (FILLER_WORDS.has(lowerWord)) {
            type = 'filler';
          } else if (TECHNICAL_TERMS.has(lowerWord)) {
            type = 'technical';
          }

          return {
            text: word,
            type,
            confidence: lastResult[0].confidence
          };
        });

        if (words.length === 0) return; // Skip empty responses

        const newSegment: TranscriptSegment = {
          words,
          timestamp: Date.now(),
          isUser: true,
        };

        try {
          const feedback = await geminiService.analyzeResponse(words.map(w => w.text).join(' '));
          newSegment.feedback = feedback;
          
          setMetrics(prev => ({
            fillerWordCount: prev.fillerWordCount + words.filter(w => w.type === 'filler').length,
            technicalTermCount: prev.technicalTermCount + words.filter(w => w.type === 'technical').length,
            averageConfidence: (prev.averageConfidence + lastResult[0].confidence) / 2,
            clarityScore: feedback.clarity,
          }));
        } catch (error) {
          console.error('Error getting feedback:', error);
          // Still add the segment even if feedback fails
        }

        setTranscript(prev => [...prev, newSegment]);
        setRetryCount(0); // Reset retry count on successful transcription
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [connected, retryCount, startRecognition]);

  useEffect(() => {
    if (connected && !isListening && recognitionRef.current) {
      startRecognition();
    }
  }, [connected, isListening, startRecognition]);

  return (
    <div className="transcript-container">
      {error && (
        <div className="error-message">
          <span className="material-symbols-outlined">error</span>
          <p>{error}</p>
        </div>
      )}
      <div className="metrics-panel">
        <div className="metric">
          <span className="metric-label">Clarity Score</span>
          <div className="metric-value">
            <div 
              className="progress-bar" 
              style={{ width: `${metrics.clarityScore}%` }}
            />
            <span>{Math.round(metrics.clarityScore)}%</span>
          </div>
        </div>
        <div className="metric">
          <span className="metric-label">Filler Words</span>
          <span className="metric-value">{metrics.fillerWordCount}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Technical Terms</span>
          <span className="metric-value">{metrics.technicalTermCount}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Confidence</span>
          <div className="metric-value">
            <div 
              className="progress-bar" 
              style={{ width: `${metrics.averageConfidence * 100}%` }}
            />
            <span>{Math.round(metrics.averageConfidence * 100)}%</span>
          </div>
        </div>
      </div>

      <div className="transcript-scroll">
        {transcript.map((segment, index) => (
          <div 
            key={index} 
            className={`transcript-segment ${segment.isUser ? 'user' : 'interviewer'}`}
          >
            <div className="segment-content">
              {segment.words.map((word, wordIndex) => (
                <span 
                  key={wordIndex}
                  className={`word ${word.type}`}
                  title={word.type !== 'normal' ? `${word.type} word` : ''}
                >
                  {word.text}{' '}
                </span>
              ))}
            </div>
            {segment.feedback && (
              <div className="feedback-panel">
                <div className="feedback-metrics">
                  <span>Clarity: {segment.feedback.clarity}%</span>
                  <span>Confidence: {segment.feedback.confidence}%</span>
                  {segment.feedback.technicalAccuracy !== undefined && (
                    <span>Technical Accuracy: {segment.feedback.technicalAccuracy}%</span>
                  )}
                </div>
                <div className="feedback-suggestions">
                  {segment.feedback.suggestions.map((suggestion, i) => (
                    <div key={i} className="suggestion">
                      <span className="material-symbols-outlined">tips_and_updates</span>
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 