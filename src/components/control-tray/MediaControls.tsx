import { UseMediaStreamResult } from '../../hooks/use-media-stream-mux';

import MediaStreamButton from './MediaStreamButton';

type MediaControlsProps = {
  webcam: UseMediaStreamResult;
  screenCapture: UseMediaStreamResult;
  onStreamChange: (stream: MediaStream | null) => void;
};

export default function MediaControls({
  webcam,
  screenCapture,
  onStreamChange,
}: MediaControlsProps) {
  const videoStreams = [webcam, screenCapture];

  const changeStreams = (next?: UseMediaStreamResult) => async () => {
    if (next) {
      const mediaStream = await next.start();
      onStreamChange(mediaStream);
    } else {
      onStreamChange(null);
    }

    videoStreams.filter(msr => msr !== next).forEach(msr => msr.stop());
  };

  return (
    <>
      <MediaStreamButton
        isStreaming={screenCapture.isStreaming}
        start={changeStreams(screenCapture)}
        stop={changeStreams()}
        onIcon="cancel_presentation"
        offIcon="present_to_all"
      />
      <MediaStreamButton
        isStreaming={webcam.isStreaming}
        start={changeStreams(webcam)}
        stop={changeStreams()}
        onIcon="videocam_off"
        offIcon="videocam"
      />
    </>
  );
}
