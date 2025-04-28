import React, { useEffect, useState, useCallback } from 'react';
import './interview-timer.scss';

interface InterviewTimerProps {
  duration: number; // in minutes
  isActive: boolean;
  onTimeUp: () => void;
}

export const InterviewTimer: React.FC<InterviewTimerProps> = ({ duration, isActive, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(duration * 60);
    setIsWarning(false);
    setIsCritical(false);
  }, [duration]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getProgressColor = useCallback((timeLeft: number) => {
    const totalSeconds = duration * 60;
    const percentageLeft = (timeLeft / totalSeconds) * 100;
    if (percentageLeft <= 15) return 'critical';
    if (percentageLeft <= 30) return 'warning';
    return 'normal';
  }, [duration]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          const percentageLeft = (newTime / (duration * 60)) * 100;
          
          setIsWarning(percentageLeft <= 30);
          setIsCritical(percentageLeft <= 15);
          
          if (newTime <= 0) {
            onTimeUp();
            clearInterval(intervalId);
          }
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive, duration, onTimeUp]);

  const progressPercentage = (timeLeft / (duration * 60)) * 100;
  const statusColor = getProgressColor(timeLeft);

  return (
    <div className="interview-timer">
      <div className="timer-container">
        <div className="timer-progress">
          <svg viewBox="0 0 100 100" className={statusColor}>
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              className="timer-background" 
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              className="timer-indicator"
              style={{
                strokeDasharray: `${2 * Math.PI * 45}`,
                strokeDashoffset: `${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`
              }}
            />
          </svg>
          <div className="timer-content">
            <div className="time-display">{formatTime(timeLeft)}</div>
            <div className="timer-label">
              <span className="material-symbols-outlined">
                {isCritical ? 'timer_off' : isWarning ? 'timer' : 'schedule'}
              </span>
              <span>
                {isCritical ? 'Time Critical' : isWarning ? 'Time Running Low' : 'Interview Time'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="timer-info">
          <div className="info-item">
            <span className="material-symbols-outlined">
              {timeLeft > 0 ? 'hourglass_top' : 'hourglass_bottom'}
            </span>
            <span className="label">
              {timeLeft > 0 ? 'Time Remaining' : 'Time Up'}
            </span>
          </div>
          <div className="info-item">
            <span className="material-symbols-outlined">
              {isActive ? 'play_circle' : 'pause_circle'}
            </span>
            <span className="label">
              {isActive ? 'Interview Active' : 'Interview Paused'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}; 