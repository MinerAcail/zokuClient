import React, { useState, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import loadFfmpeg from '../useAble/template/ffmpegLoader';

// Import your default image
import defaultImageUrl from '../../../assets/images/zu.png';

const ImageToVideoConverter: React.FC = () => {
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



  const createVideoFromImage = async () => {
    if (!ffmpeg ) return;

    setLoading(true);
    logMessage('Starting video creation...');

    try {
      // Convert image to video using FFmpeg
      await ffmpeg.writeFile('input.png', await fetchFile(defaultImageUrl));


      await ffmpeg.exec([
        '-loop', '1',
        '-i', 'input.png',
        '-t', '5', // 5 seconds duration
        '-vf', 'scale=-1:1920',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-preset','fast',
        'output.mp4'
      ]);

      logMessage('Video creation completed.');

      // Fetch and set video URL
      const data = await ffmpeg.readFile('output.mp4');
      const videoBlob = new Blob([data], { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(videoBlob);
      setVideoUrl(videoUrl);
    } catch (error) {
      logMessage(`Error creating video: ${error.message}`);
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
      <h2>Create Video from Image Tempilate</h2>
      <button onClick={createVideoFromImage} disabled={loading}>
        Create Video
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

export default ImageToVideoConverter;
