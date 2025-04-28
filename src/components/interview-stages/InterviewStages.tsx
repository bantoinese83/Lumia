import React from 'react';
import './interview-stages.scss';

interface InterviewStage {
  id: string;
  title: string;
  icon: string;
  completed: boolean;
  active: boolean;
}

interface InterviewStagesProps {
  currentStage: string;
}

export const InterviewStages: React.FC<InterviewStagesProps> = ({ currentStage }) => {
  const stages: InterviewStage[] = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: 'waving_hand',
      completed: currentStage !== 'introduction',
      active: currentStage === 'introduction'
    },
    {
      id: 'main-discussion',
      title: 'Main Discussion',
      icon: 'forum',
      completed: ['technical-deep-dive', 'closing-questions'].includes(currentStage),
      active: currentStage === 'main-discussion'
    },
    {
      id: 'technical-deep-dive',
      title: 'Technical Deep Dive',
      icon: 'code',
      completed: currentStage === 'closing-questions',
      active: currentStage === 'technical-deep-dive'
    },
    {
      id: 'closing-questions',
      title: 'Closing Questions',
      icon: 'help',
      completed: false,
      active: currentStage === 'closing-questions'
    }
  ];

  return (
    <div className="interview-stages">
      <div className="stages-container">
        {stages.map((stage, index) => (
          <React.Fragment key={stage.id}>
            <div className={`stage ${stage.completed ? 'completed' : ''} ${stage.active ? 'active' : ''}`}>
              <div className="stage-icon">
                <span className="material-symbols-outlined">{stage.icon}</span>
                <div className="stage-connector">
                  <div className="connector-line" />
                </div>
              </div>
              <div className="stage-title">{stage.title}</div>
            </div>
            {index < stages.length - 1 && (
              <div className={`connector ${stage.completed ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}; 