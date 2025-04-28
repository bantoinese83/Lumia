import { useEffect, useState } from 'react';

import cn from 'classnames';

import { useLiveAPIContext } from '../../contexts/LiveAPIContext';
import { AudioRecorder } from '../../lib/audio-recorder';
import AudioPulse from '../audio-pulse/AudioPulse';

type AudioControlsProps = {
  connected: boolean;
};

export default function AudioControls({ connected }: AudioControlsProps) {
  const [inVolume, setInVolume] = useState(0);
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted, setMuted] = useState(false);
  const { client, volume } = useLiveAPIContext();

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--volume',
      `${Math.max(5, Math.min(inVolume * 200, 8))}px`
    );
  }, [inVolume]);

  useEffect(() => {
    const onData = (base64: string) => {
      client.sendRealtimeInput([
        {
          mimeType: 'audio/pcm;rate=16000',
          data: base64,
        },
      ]);
    };

    if (connected && !muted && audioRecorder) {
      audioRecorder.on('data', onData).on('volume', setInVolume).start();
    } else {
      audioRecorder.stop();
    }

    return () => {
      audioRecorder.off('data', onData).off('volume', setInVolume);
    };
  }, [connected, client, muted, audioRecorder]);

  return (
    <>
      <button 
        className={cn('action-button', { active: !muted })} 
        onClick={() => setMuted(!muted)}
        data-tooltip={muted ? "Unmute microphone" : "Mute microphone"}
      >
        {!muted ? (
          <span className="material-symbols-outlined">mic</span>
        ) : (
          <span className="material-symbols-outlined">mic_off</span>
        )}
      </button>

      <div 
        className="action-button no-action" 
        data-tooltip="Audio level"
      >
        <AudioPulse volume={volume} active={connected && !muted} hover={false} />
      </div>
    </>
  );
}
