import React, { useState, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import loadFfmpeg from '../useAble/template/ffmpegLoader';
import overlay from '../../../assets/videos/overlay1.mp4';
import BG from '../../../assets/videos/bg.mp4';


const VideoOverLayConverter: React.FC = () => {
  const [ffmpeg, setFfmpeg] = useState<FFmpeg | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const initializeFfmpeg = async () => {
      try {
        const ffmpegInstance = await loadFfmpeg();
        setFfmpeg(ffmpegInstance);
      } catch (error) {
        logMessage('Failed to initialize ffmpeg');
      }
    };

    initializeFfmpeg();
  }, []);

  const logMessage = (message: string) => {
    setLog(prevLog => [...prevLog, message]);
    console.log(message);
  };

  const overlayVideo = async () => {
    if (!ffmpeg) return;

    setLoading(true);
    logMessage('Starting video overlay...');

    try {
      // Load the background and overlay videos into ffmpeg
      await ffmpeg.writeFile('bg.mp4', await fetchFile(BG));
      await ffmpeg.writeFile('overlay.mp4', await fetchFile(overlay));

      // Run the ffmpeg command to overlay the videos with scaling
      await ffmpeg.exec([
        '-i', 'bg.mp4',
        '-i', 'overlay.mp4',
        '-filter_complex', 'overlay=54:210',
        '-preset', 'fast',
        'output.mp4'
      ]);

      logMessage('Video overlay completed.');

      // Fetch and set video URL
      const data = await ffmpeg.readFile('output.mp4');
      const videoBlob = new Blob([data], { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(videoBlob);
      setVideoUrl(videoUrl);
    } catch (error) {
      logMessage(`Error overlaying video: ${error.message}`);
    } finally {
      setLoading(false);
      logMessage('Process completed.');
    }
  };

  const fetchFile = async (url: string): Promise<Uint8Array> => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  };

  return (
    <div>
      <button onClick={overlayVideo} disabled={loading}>
        Overlay Video
      </button>
      {loading && <p>Loading...</p>}
      {log.length > 0 && (
        <div>
          <h3>Processing Log:</h3>
          <ul>
            {log.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}
      {/* <VideoOverlayPreview/> */}
      {videoUrl && (
        <div>
          <video src={videoUrl} controls />
          <a href={videoUrl} download="output.mp4">
            Download Video
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoOverLayConverter;
