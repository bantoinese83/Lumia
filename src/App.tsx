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
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(true);
  const [interviewerImage, setInterviewerImage] = useState('');
  const { config, setConfig } = useLiveAPIContext();

  // Set default config on mount
  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: 'audio',
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: 'Puck',
            },
          },
        },
      },
    });
  }, [setConfig]);

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

  // Enable webcam by default
  useEffect(() => {
    const enableWebcam = async () => {
      try {
        if (isWebcamEnabled) {
                  const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false // We handle audio separately
                  });
                  setVideoStream(stream);
                }
        else if (videoStream) {
                    videoStream.getTracks().forEach(track => track.stop());
                    setVideoStream(null);
                  }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setIsWebcamEnabled(false);
      }
    };
    enableWebcam();
  }, [isWebcamEnabled]);

  // Handle webcam toggle
  const toggleWebcam = () => {
    setIsWebcamEnabled(!isWebcamEnabled);
  };

  return (
    <div className="app-container">
      <Header />
      <div className="streaming-console">
        <main>
          <div className="main-app-area">
            <div className="stream-container">
              <video
                className={cn("stream", {
                  hidden: !videoRef.current || !videoStream || !isWebcamEnabled,
                })}
                ref={videoRef}
                autoPlay
                playsInline
                muted
              />
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
          </div>

          <ControlTray
            videoRef={videoRef}
            supportsVideo={true}
            onVideoStreamChange={setVideoStream}
          >
            <button 
              className="action-button"
              onClick={toggleWebcam}
            >
              <span className="material-symbols-outlined">
                {isWebcamEnabled ? 'videocam_off' : 'videocam'}
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
