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

import cn from "classnames";
import { ReactNode, RefObject, useRef, useState } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { useScreenCapture } from "../../hooks/use-screen-capture";
import { useWebcam } from "../../hooks/use-webcam";
import "./control-tray.scss";
import AudioControls from "./AudioControls";
import MediaControls from "./MediaControls";
import { useVideoFrameSender } from "../../hooks/use-video-frame-sender";

export type ControlTrayProps = {
  videoRef: RefObject<HTMLVideoElement>;
  children?: ReactNode;
  supportsVideo: boolean;
  onVideoStreamChange?: (stream: MediaStream | null) => void;
};

export default function ControlTray({
  videoRef,
  children,
  onVideoStreamChange = () => {},
  supportsVideo,
}: ControlTrayProps) {
  const webcam = useWebcam();
  const screenCapture = useScreenCapture();
  const [activeVideoStream, setActiveVideoStream] = useState<MediaStream | null>(null);
  const renderCanvasRef = useRef<HTMLCanvasElement>(null);
  const connectButtonRef = useRef<HTMLButtonElement>(null);
  const { client, connected, connect, disconnect } = useLiveAPIContext();

  useVideoFrameSender(
    videoRef,
    renderCanvasRef,
    client,
    connected,
    activeVideoStream
  );

  const handleVideoStreamChange = (stream: MediaStream | null) => {
    setActiveVideoStream(stream);
    onVideoStreamChange(stream);
  };

  return (
    <section className="control-tray">
      <canvas style={{ display: "none" }} ref={renderCanvasRef} />
      
      {/* Status indicator */}
      <div className={cn("status-indicator", { visible: connected })}>
        <div className="status-dot" />
        {connected ? "Interview in progress" : "Ready to start"}
      </div>

      {/* Media controls */}
      <nav className="actions-nav">
        <AudioControls connected={connected} />
        {supportsVideo && (
          <MediaControls
            webcam={webcam}
            screenCapture={screenCapture}
            onStreamChange={handleVideoStreamChange}
          />
        )}
        {children}
      </nav>

      {/* Start/End Interview button */}
      <div className={cn("connection-container", { connected })}>
        <div className="connection-button-container">
          <button
            ref={connectButtonRef}
            className={cn("connect-toggle", { connected })}
            onClick={connected ? disconnect : connect}
          >
            <span className="material-symbols-outlined">
              {connected ? "stop" : "play_arrow"}
            </span>
            <span className="button-text">
              {connected ? "End Interview" : "Start Interview"}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
