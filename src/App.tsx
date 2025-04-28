/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect, useRef, useState } from "react";
import "./App.scss";
import { LiveAPIProvider } from "./contexts/LiveAPIContext";
import ControlTray from "./components/control-tray/ControlTray";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { useLiveAPIContext } from "./contexts/LiveAPIContext";
import { voiceProfiles } from "./config/voiceProfiles";
import { TranscriptDisplay } from "./components/transcript/TranscriptDisplay";
import { InterviewTimer } from "./components/timer/InterviewTimer";
import { InterviewMetrics } from "./components/interview-metrics/InterviewMetrics";
import { InterviewStages } from "./components/interview-stages/InterviewStages";
import cn from "classnames";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY as string;
if (typeof API_KEY !== "string") {
  throw new Error("set REACT_APP_GEMINI_API_KEY in .env");
}

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

function AppContent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [interviewerImage, setInterviewerImage] = useState('');
  const [currentStage, setCurrentStage] = useState('introduction');
  const { config, connected } = useLiveAPIContext();

  // Get current interviewer profile
  const currentInterviewer = voiceProfiles.find(
    profile => profile.value === config.generationConfig?.speechConfig?.voiceConfig?.prebuiltVoiceConfig?.voiceName
  ) || voiceProfiles[0];

  // Handle interviewer image loading
  useEffect(() => {
    setInterviewerImage(currentInterviewer.image);
  }, [currentInterviewer]);

  const handleInterviewerImageError = () => {
    if (interviewerImage !== currentInterviewer.fallbackImage) {
      setInterviewerImage(currentInterviewer.fallbackImage);
    }
  };

  // Handle video toggle
  const toggleVideo = async () => {
    setIsVideoEnabled(!isVideoEnabled);
    if (!isVideoEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false // Audio handled separately
        });
        setVideoStream(stream);
      } catch (err) {
        console.error("Error accessing video:", err);
      }
    } else if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
  };

  // Update interview stage based on time
  useEffect(() => {
    if (!connected) return;

    const totalDuration = config.interviewDuration || 45;
    const stageInterval = setInterval(() => {
      const timeElapsed = Date.now() - startTime;
      const progressPercentage = (timeElapsed / (totalDuration * 60 * 1000)) * 100;

      if (progressPercentage >= 75) {
        setCurrentStage('closing-questions');
      } else if (progressPercentage >= 50) {
        setCurrentStage('technical-deep-dive');
      } else if (progressPercentage >= 25) {
        setCurrentStage('main-discussion');
      }
    }, 1000);

    const startTime = Date.now();

    return () => clearInterval(stageInterval);
  }, [connected, config.interviewDuration]);

  return (
    <div className="app-container">
      <Header />
      <div className="streaming-console">
        <main>
          <InterviewStages currentStage={currentStage} />
          <div className="main-app-area">
            <div className="content-container">
              <div className="stream-container">
                <div className="video-stream user-stream">
                  {isVideoEnabled ? (
                    <video
                      className={cn("stream", {
                        hidden: !videoRef.current || !videoStream,
                      })}
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                    />
                  ) : (
                    <div className="placeholder-avatar">
                      <span className="material-symbols-outlined">person</span>
                      <span className="label">Camera Off</span>
                    </div>
                  )}
                </div>
                <div 
                  className="stream interviewer-stream" 
                  style={{ 
                    backgroundImage: `url(${interviewerImage})`,
                  }}
                >
                  <div className="interviewer-info">
                    <h3>{currentInterviewer.value}</h3>
                    <p>{currentInterviewer.role}</p>
                    <p>{currentInterviewer.company}</p>
                  </div>
                  <img 
                    src={interviewerImage}
                    alt=""
                    style={{ display: 'none' }}
                    onError={handleInterviewerImageError}
                  />
                </div>
              </div>
              <div className="side-panel">
                <InterviewTimer 
                  duration={config.interviewDuration || 45} 
                  isActive={connected}
                  onTimeUp={() => setCurrentStage('closing-questions')}
                />
                <InterviewMetrics isActive={connected} />
                <div className="transcript-wrapper">
                  <TranscriptDisplay />
                </div>
              </div>
            </div>
          </div>

          <ControlTray
            videoRef={videoRef}
            supportsVideo={true}
            onVideoStreamChange={setVideoStream}
          >
            <button 
              className={cn("action-button", { active: isVideoEnabled })}
              onClick={toggleVideo}
              data-tooltip={isVideoEnabled ? "Turn camera off" : "Turn camera on"}
            >
              <span className="material-symbols-outlined">
                {isVideoEnabled ? 'videocam' : 'videocam_off'}
              </span>
            </button>
          </ControlTray>
        </main>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <LiveAPIProvider url={uri} apiKey={API_KEY}>
        <AppContent />
      </LiveAPIProvider>
    </div>
  );
}

export default App;
