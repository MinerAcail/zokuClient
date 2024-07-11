import React, { useEffect, useRef } from 'react';
import overlay from '../../../assets/videos/overlay.mp4';
import BG from '../../../assets/videos/bg.mp4';

const VideoOverlayPreview: React.FC = () => {
  const backgroundRef = useRef<HTMLVideoElement | null>(null);
  const overlayRef = useRef<HTMLVideoElement | null>(null);

  const height = 660;
  const width = (9 / 16) * height; // 371.25
  const boxWidth = width * 0.9; // 334.125
  const boxHeight = height * 0.4; // 264
  const margin = 40;
  const x = (width - boxWidth) / 2; // 18.5625
  const y = margin; // 40

  useEffect(() => {
    if (backgroundRef.current && overlayRef.current) {
      // Pause the videos and seek to the first frame for preview
      backgroundRef.current.currentTime = 0;
      backgroundRef.current.pause();
      overlayRef.current.currentTime = 0;
      overlayRef.current.pause();
    }
  }, []);

  return (
    <div style={{ position: 'relative', width: `${width}px`, height: `${height}px`, border: '1px solid #000' }}>
      {/* Background Video */}
      <video
        ref={backgroundRef}
        src={BG}
        width={width}
        height={height}
        style={{ position: 'absolute', left: '0px', top: '0px' }}
        controls
      />

      {/* Overlay Video */}
      <video
        ref={overlayRef}
        src={overlay}
        width={boxWidth}
        height={boxHeight}
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          borderRadius: '10px',
          border: '2px solid #000',
          opacity: 0.7, // Semi-transparent for preview purposes
        }}
        controls
      />
    </div>
  );
};

export default VideoOverlayPreview;
