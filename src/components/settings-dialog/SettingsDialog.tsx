import {
  useRef,
  useState,
  useEffect,
} from "react";
import cn from "classnames";
import "./settings-dialog.scss";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { LiveConfig } from "../../multimodal-live-types";
import VoiceSelector from "./VoiceSelector";
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';
import { ResumeUploader } from './ResumeUploader';
import { DocumentAnalysis } from '../../services/geminiService';

const PREDEFINED_OPTIONS = {
  roles: [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Product Manager",
    "Machine Learning Engineer",
    "Mobile Developer",
    "Security Engineer",
  ],
  experience: ["Entry Level", "1-3 years", "3-5 years", "5-8 years", "8+ years", "10+ years", "15+ years"],
  companies: [
    "Google",
    "Meta (Facebook)",
    "Amazon",
    "Apple",
    "Microsoft",
    "Netflix",
    "Uber",
    "Airbnb",
    "LinkedIn",
    "Twitter",
  ],
  industries: [
    "Technology",
    "Finance & Banking",
    "Healthcare & Biotech",
    "E-commerce & Retail",
    "Education & EdTech",
    "Gaming & Entertainment",
    "Automotive & Transportation",
    "Energy & Utilities",
    "Real Estate & PropTech",
    "Media & Communications",
    "Manufacturing & Industrial",
    "Travel & Hospitality",
    "Food & Agriculture",
    "Consulting & Professional Services",
    "Insurance & InsurTech",
    "Aerospace & Defense",
    "Telecommunications",
  ],
  interviewTypes: [
    { value: "technical", label: "Technical Interview", description: "Focus on coding, system design, and technical skills" },
    { value: "behavioral", label: "Behavioral Interview", description: "Focus on soft skills, past experiences, and problem-solving approach" },
    { value: "mixed", label: "Mixed Interview", description: "Combination of technical and behavioral questions" }
  ],
  difficultyLevels: [
    { value: "easy", label: "Entry Level", description: "Basic concepts and fundamentals" },
    { value: "medium", label: "Intermediate", description: "More complex problems and scenarios" },
    { value: "hard", label: "Advanced", description: "Challenging questions for senior positions" }
  ],
  interviewDurations: [
    { value: 30, label: "30 minutes" },
    { value: 45, label: "45 minutes" },
    { value: 60, label: "1 hour" },
    { value: 90, label: "1.5 hours" }
  ],
  skills: {
    technical: [
      "JavaScript",
      "Python",
      "Java",
      "C++",
      "React",
      "Node.js",
      "System Design",
      "Data Structures",
      "Algorithms",
      "Cloud (AWS/GCP/Azure)",
      "DevOps",
      "Database Design",
      "Machine Learning",
      "Distributed Systems",
      "Security",
      "Mobile Development",
      "Microservices",
      "API Design",
    ],
    behavioral: [
      "Leadership",
      "Communication",
      "Problem Solving",
      "Team Collaboration",
      "Project Management",
      "Conflict Resolution",
      "Time Management",
      "Adaptability",
      "Strategic Thinking",
      "Mentoring",
      "Cross-functional Collaboration",
      "Decision Making",
      "Innovation",
      "Customer Focus",
    ],
  },
  languages: [
    { code: "de-DE", name: "German (Germany)" },
    { code: "en-AU", name: "English (Australia)" },
    { code: "en-GB", name: "English (United Kingdom)" },
    { code: "en-IN", name: "English (India)" },
    { code: "en-US", name: "English (US)" },
    { code: "es-US", name: "Spanish (United States)" },
    { code: "fr-FR", name: "French (France)" },
    { code: "hi-IN", name: "Hindi (India)" },
    { code: "pt-BR", name: "Portuguese (Brazil)" },
    { code: "ar-XA", name: "Arabic (Generic)" },
    { code: "es-ES", name: "Spanish (Spain)" },
    { code: "fr-CA", name: "French (Canada)" },
    { code: "id-ID", name: "Indonesian (Indonesia)" },
    { code: "it-IT", name: "Italian (Italy)" },
    { code: "ja-JP", name: "Japanese (Japan)" },
    { code: "tr-TR", name: "Turkish (Turkey)" },
    { code: "vi-VN", name: "Vietnamese (Vietnam)" },
    { code: "bn-IN", name: "Bengali (India)" },
    { code: "gu-IN", name: "Gujarati (India)" },
    { code: "kn-IN", name: "Kannada (India)" },
    { code: "ml-IN", name: "Malayalam (India)" },
    { code: "mr-IN", name: "Marathi (India)" },
    { code: "ta-IN", name: "Tamil (India)" },
    { code: "te-IN", name: "Telugu (India)" },
    { code: "nl-NL", name: "Dutch (Netherlands)" },
    { code: "ko-KR", name: "Korean (South Korea)" },
    { code: "cmn-CN", name: "Mandarin Chinese (China)" },
    { code: "pl-PL", name: "Polish (Poland)" },
    { code: "ru-RU", name: "Russian (Russia)" },
    { code: "th-TH", name: "Thai (Thailand)" }
  ],
  voices: [
    "Puck",
    "Charon", 
    "Kore",
    "Fenrir",
    "Aoede",
    "Leda",
    "Orus",
    "Zephyr"
  ]
};

export default function SettingsDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { config, setConfig } = useLiveAPIContext();
  const [showIndicator, setShowIndicator] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [interviewConfig, setInterviewConfig] = useState({
    candidateName: "",
    role: "",
    yearsOfExperience: "",
    industry: "",
    targetCompany: "",
    interviewType: "technical",
    difficultyLevel: "medium",
    duration: 45,
    specificSkills: [] as string[],
    preferredLanguage: "en-US",
    focusAreas: [] as string[],
    resumeHighlights: "",
    interviewGoals: "",
    feedbackPreference: "detailed",
  });
  const [resumeAnalysis, setResumeAnalysis] = useState<DocumentAnalysis | null>(null);
  
  useEffect(() => {
    const dialogElement = dialogRef.current;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (dialogElement && dialogElement.open) {
        dialogElement.close();
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
      setIsOpen(false);
    }
  };

  const handleDialogClick = (e: React.MouseEvent) => {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (rect) {
      const isInDialog = (e.clientX >= rect.left && e.clientX <= rect.right &&
                         e.clientY >= rect.top && e.clientY <= rect.bottom);
      if (!isInDialog) {
        handleClose();
      }
    }
  };

  const openDialog = () => {
    if (dialogRef.current) {
      setShowIndicator(false);
      setIsOpen(true);
      dialogRef.current.showModal();
    }
  };

  const updateInterviewConfig = (field: string, value: any) => {
    setInterviewConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSkill = (skill: string) => {
    setInterviewConfig(prev => ({
      ...prev,
      specificSkills: prev.specificSkills.includes(skill)
        ? prev.specificSkills.filter(s => s !== skill)
        : [...prev.specificSkills, skill]
    }));
  };

  const handleResumeAnalysis = (analysis: DocumentAnalysis) => {
    setResumeAnalysis(analysis);
    setInterviewConfig(prev => ({
      ...prev,
      specificSkills: [...new Set([...prev.specificSkills, ...analysis.keySkills])],
      focusAreas: [...new Set([...prev.focusAreas, ...analysis.recommendations])],
    }));
  };

  useEffect(() => {
    const instruction = `You are an experienced technical interviewer conducting a ${interviewConfig.interviewType} interview${interviewConfig.candidateName ? ` for ${interviewConfig.candidateName}` : ''} for a ${interviewConfig.role} position${interviewConfig.yearsOfExperience ? ` with ${interviewConfig.yearsOfExperience} experience` : ''} in the ${interviewConfig.industry} industry${interviewConfig.targetCompany ? `, following ${interviewConfig.targetCompany}'s interview style` : ''}. ${interviewConfig.specificSkills.length > 0 ? `Focus on assessing skills in: ${interviewConfig.specificSkills.join(", ")}.` : ''} Conduct the interview in ${interviewConfig.preferredLanguage}. Be professional, provide constructive feedback, and assess both technical competency and communication skills.`;

    const newConfig: LiveConfig = {
      ...config,
      systemInstruction: {
        parts: [{ text: instruction }],
      },
    };
    setConfig(newConfig);
  }, [interviewConfig, setConfig, config.model, config.generationConfig, config.tools]);

  const renderTags = (options: string[], field: string, currentValue: string) => (
    <div className="tag-options">
      {options.map((option) => (
        <button
          key={option}
          className={`tag ${currentValue === option ? 'selected' : ''}`}
          onClick={() => updateInterviewConfig(field, option)}
        >
          {option}
        </button>
      ))}
    </div>
  );

  const renderSkillTags = () => (
    <div className="tag-options">
      {PREDEFINED_OPTIONS.skills[interviewConfig.interviewType === 'technical' ? 'technical' : 'behavioral'].map((skill) => (
        <button
          key={skill}
          className={`tag ${interviewConfig.specificSkills.includes(skill) ? 'selected' : ''}`}
          onClick={() => toggleSkill(skill)}
        >
          {skill}
        </button>
      ))}
    </div>
  );

  const renderDifficultySelector = () => (
    <div className="form-group">
      <label>Interview Difficulty</label>
      <div className="difficulty-selector">
        {PREDEFINED_OPTIONS.difficultyLevels.map(level => (
          <button
            key={level.value}
            className={cn("difficulty-button", { 
              selected: interviewConfig.difficultyLevel === level.value 
            })}
            onClick={() => updateInterviewConfig('difficultyLevel', level.value)}
          >
            <span className="difficulty-label">{level.label}</span>
            <span className="difficulty-description">{level.description}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderDurationSelector = () => (
    <div className="form-group">
      <label>Interview Duration</label>
      <div className="duration-selector">
        {PREDEFINED_OPTIONS.interviewDurations.map(duration => (
          <button
            key={duration.value}
            className={cn("duration-button", {
              selected: interviewConfig.duration === duration.value
            })}
            onClick={() => updateInterviewConfig('duration', duration.value)}
          >
            {duration.label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderInterviewTypeSelector = () => (
    <div className="form-group">
      <label>Interview Type</label>
      <div className="interview-type-selector">
        {PREDEFINED_OPTIONS.interviewTypes.map(type => (
          <button
            key={type.value}
            className={cn("type-button", {
              selected: interviewConfig.interviewType === type.value
            })}
            onClick={() => updateInterviewConfig('interviewType', type.value)}
          >
            <span className="type-label">{type.label}</span>
            <span className="type-description">{type.description}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderFocusAreas = () => (
    <div className="form-group">
      <label>Focus Areas</label>
      <div className="focus-areas-input">
        <textarea
          value={interviewConfig.focusAreas.join("\n")}
          onChange={(e) => updateInterviewConfig('focusAreas', e.target.value.split("\n"))}
          placeholder="Enter specific areas you'd like to focus on during the interview (one per line)"
          rows={3}
        />
      </div>
    </div>
  );

  const renderResumeHighlights = () => (
    <div className="form-group">
      <label>Key Resume Points</label>
      <div className="resume-highlights-input">
        <textarea
          value={interviewConfig.resumeHighlights}
          onChange={(e) => updateInterviewConfig('resumeHighlights', e.target.value)}
          placeholder="Enter key points from your resume that you'd like the interviewer to focus on"
          rows={3}
        />
      </div>
    </div>
  );

  const renderInterviewGoals = () => (
    <div className="form-group">
      <label>Interview Goals</label>
      <div className="interview-goals-input">
        <textarea
          value={interviewConfig.interviewGoals}
          onChange={(e) => updateInterviewConfig('interviewGoals', e.target.value)}
          placeholder="What do you hope to achieve from this interview practice?"
          rows={3}
        />
      </div>
    </div>
  );

  return (
    <div className="settings-dialog">
      <button
        className="action-button material-symbols-outlined"
        onClick={openDialog}
        type="button"
      >
        settings
      </button>
      {showIndicator && (
        <div className="settings-indicator">
          <div className="indicator-content">
            <span className="material-symbols-outlined">arrow_forward</span>
            <p>Complete interview setup</p>
          </div>
        </div>
      )}
      <dialog 
        ref={dialogRef} 
        className="dialog"
        onClick={handleDialogClick}
      >
        <div className="dialog-header">
          <h2>Interview Setup</h2>
          <button 
            className="close-button material-symbols-outlined" 
            onClick={handleClose}
            type="button"
          >
            close
          </button>
        </div>
        <div className="dialog-container" onClick={e => e.stopPropagation()}>
          <ErrorBoundary>
            <div className="mode-selectors">
              <VoiceSelector />
            </div>

            <div className="interview-form">
              <div className="form-group">
                <label>Candidate Name</label>
                <input
                  type="text"
                  value={interviewConfig.candidateName}
                  onChange={(e) => updateInterviewConfig('candidateName', e.target.value)}
                  placeholder="Enter your name..."
                />
              </div>

              <div className="form-group">
                <label>Position/Role</label>
                <input
                  type="text"
                  value={interviewConfig.role}
                  onChange={(e) => updateInterviewConfig('role', e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                />
                {renderTags(PREDEFINED_OPTIONS.roles, 'role', interviewConfig.role)}
              </div>

              <div className="form-group">
                <label>Experience Level</label>
                {renderTags(PREDEFINED_OPTIONS.experience, 'yearsOfExperience', interviewConfig.yearsOfExperience)}
              </div>

              {renderInterviewTypeSelector()}
              {renderDifficultySelector()}
              {renderDurationSelector()}

              <div className="form-group">
                <label>Target Company Style</label>
                <input
                  type="text"
                  value={interviewConfig.targetCompany}
                  onChange={(e) => updateInterviewConfig('targetCompany', e.target.value)}
                  placeholder="e.g. Google, Meta, or custom company..."
                />
                {renderTags(PREDEFINED_OPTIONS.companies, 'targetCompany', interviewConfig.targetCompany)}
              </div>

              <div className="form-group">
                <label>Industry</label>
                <input
                  type="text"
                  value={interviewConfig.industry}
                  onChange={(e) => updateInterviewConfig('industry', e.target.value)}
                  placeholder="e.g. Technology, Healthcare"
                />
                {renderTags(PREDEFINED_OPTIONS.industries, 'industry', interviewConfig.industry)}
              </div>

              <div className="form-group">
                <label>Skills to Assess</label>
                <input
                  type="text"
                  value={interviewConfig.specificSkills.join(", ")}
                  onChange={(e) => updateInterviewConfig('specificSkills', e.target.value.split(", ").filter(Boolean))}
                  placeholder="Add custom skills..."
                />
                {renderSkillTags()}
              </div>

              {renderFocusAreas()}
              {renderResumeHighlights()}
              {renderInterviewGoals()}

              <div className="form-group">
                <label>Preferred Language</label>
                <select
                  value={interviewConfig.preferredLanguage}
                  onChange={(e) => updateInterviewConfig('preferredLanguage', e.target.value)}
                >
                  {PREDEFINED_OPTIONS.languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Feedback Preference</label>
                <select
                  value={interviewConfig.feedbackPreference}
                  onChange={(e) => updateInterviewConfig('feedbackPreference', e.target.value)}
                >
                  <option value="detailed">Detailed feedback after each answer</option>
                  <option value="brief">Brief feedback after each answer</option>
                  <option value="end">Feedback at the end of interview</option>
                </select>
              </div>

              <ResumeUploader onAnalysisComplete={handleResumeAnalysis} />

              {resumeAnalysis && (
                <div className="ai-insights">
                  <h3>AI Interview Insights</h3>
                  
                  <div className="insight-section">
                    <h4>Key Skills</h4>
                    <div className="tags">
                      {resumeAnalysis.keySkills.map((skill, index) => (
                        <span key={index} className="tag">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div className="insight-section">
                    <h4>Experience Highlights</h4>
                    <ul>
                      {resumeAnalysis.experience.map((exp, index) => (
                        <li key={index}>{exp}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="insight-section">
                    <h4>Recommended Focus Areas</h4>
                    <div className="tags">
                      {resumeAnalysis.recommendations.map((rec, index) => (
                        <span key={index} className="tag recommendation">{rec}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ErrorBoundary>
        </div>
      </dialog>
    </div>
  );
}
