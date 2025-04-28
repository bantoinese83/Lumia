import React, { useEffect, useState } from 'react';
import { GeminiService, EngagementMetrics, InterviewProgress } from '../../services/geminiService';
import './interview-metrics.scss';

export const InterviewMetrics: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [metrics, setMetrics] = useState<EngagementMetrics | null>(null);
  const [progress, setProgress] = useState<InterviewProgress | null>(null);
  const geminiService = GeminiService.getInstance();

  useEffect(() => {
    if (!isActive) return;

    const updateMetrics = async () => {
      const newMetrics = await geminiService.getEngagementMetrics();
      const newProgress = geminiService.getInterviewProgress();
      setMetrics(newMetrics);
      setProgress(newProgress);
    };

    // Update metrics every 5 seconds during active interview
    const intervalId = setInterval(updateMetrics, 5000);
    updateMetrics(); // Initial update

    return () => clearInterval(intervalId);
  }, [isActive]);

  if (!metrics || !progress) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'average';
    return 'needs-improvement';
  };

  return (
    <div className="interview-metrics">
      <div className="metrics-section">
        <h3>Real-time Engagement Metrics</h3>
        <div className="metrics-grid">
          <div className={`metric-card ${getScoreColor(metrics.responseQuality)}`}>
            <span className="metric-value">{Math.round(metrics.responseQuality)}%</span>
            <span className="metric-label">Response Quality</span>
          </div>
          <div className={`metric-card ${getScoreColor(metrics.interactionFlow)}`}>
            <span className="metric-value">{Math.round(metrics.interactionFlow)}%</span>
            <span className="metric-label">Interaction Flow</span>
          </div>
          <div className={`metric-card ${getScoreColor(metrics.adaptability)}`}>
            <span className="metric-value">{Math.round(metrics.adaptability)}%</span>
            <span className="metric-label">Adaptability</span>
          </div>
          <div className={`metric-card ${getScoreColor(metrics.stressManagement)}`}>
            <span className="metric-value">{Math.round(metrics.stressManagement)}%</span>
            <span className="metric-label">Stress Management</span>
          </div>
        </div>
      </div>

      <div className="progress-section">
        <h3>Interview Progress</h3>
        <div className="progress-bars">
          <div className="progress-item">
            <div className="progress-label">
              <span>Overall Performance</span>
              <span>{Math.round(progress.overallPerformance)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progress.overallPerformance}%` }}
              />
            </div>
          </div>
          <div className="progress-item">
            <div className="progress-label">
              <span>Technical Competency</span>
              <span>{Math.round(progress.technicalCompetency)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progress.technicalCompetency}%` }}
              />
            </div>
          </div>
          <div className="progress-item">
            <div className="progress-label">
              <span>Communication Skills</span>
              <span>{Math.round(progress.communicationSkills)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progress.communicationSkills}%` }}
              />
            </div>
          </div>
          <div className="progress-item">
            <div className="progress-label">
              <span>Confidence Level</span>
              <span>{Math.round(progress.confidenceLevel)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progress.confidenceLevel}%` }}
              />
            </div>
          </div>
        </div>

        <div className="learning-points">
          <h4>Key Learning Points</h4>
          <ul>
            {progress.learningPoints.slice(0, 3).map((point, index) => (
              <li key={index}>
                <span className="material-symbols-outlined">school</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="recommendations">
          <h4>Personalized Recommendations</h4>
          <ul>
            {progress.recommendations.slice(0, 3).map((rec, index) => (
              <li key={index}>
                <span className="material-symbols-outlined">psychology</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}; 