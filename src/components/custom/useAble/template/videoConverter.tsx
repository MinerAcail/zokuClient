import React, { useState, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import loadFfmpeg from "./ffmpegLoader";
import ImageUploader from "./imageLoader";

const VideoConverterForOverlay: React.FC = () => {
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
        logMessage("Failed to initialize ffmpeg");
      }
    };
    initializeFfmpeg();
  }, []);

  const logMessage = (message: string) => {
    setLog((prevLog) => [...prevLog, message]);
    console.log(message);
  };

  const createSlideshow = async (files: FileList) => {
    if (!ffmpeg) return;

    setLoading(true);
    logMessage("Starting slideshow creation...");

    // Cleanup previous directories
    try {
      await ffmpeg.deleteDir("/input");
      logMessage("Cleaned up previous input directory.");
      await ffmpeg.deleteDir("/output");
      logMessage("Cleaned up previous output directory.");
    } catch (error) {
      logMessage(`Error cleaning up directories: ${error.message}`);
    }

    // Create new directories
    await ffmpeg.createDir("/input");
    await ffmpeg.createDir("/output");

    logMessage("Uploading files...");
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const data = new Uint8Array(await file.arrayBuffer());
      await ffmpeg.writeFile(`/input/${i}.jpg`, data);
      logMessage(`Uploaded file ${i + 1} of ${files.length}`);
    }

    logMessage("Creating video...");
    try {
      await ffmpeg.exec([
        "-framerate",
        "1/5", // 1 image every 3 seconds
        "-pattern_type",
        "glob",
        "-i",
        "/input/*.jpg",
        "-vf",
        "scale=972:768",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "/output/slideshow.mp4",
      ]);
      logMessage("Video creation completed.");

      logMessage("Fetching video file...");
      const data = await ffmpeg.readFile("/output/slideshow.mp4");
      let videoBlob;
      if (data instanceof Uint8Array) {
        videoBlob = new Blob([data], { type: "video/mp4" });
      } else {
        videoBlob = new Blob([new TextEncoder().encode(data)], {
          type: "video/mp4",
        });
      }
      const videoUrl = URL.createObjectURL(videoBlob);
      setVideoUrl(videoUrl);
    } catch (error) {
      logMessage(`Error creating video: ${error.message}`);
    } finally {
      setLoading(false);
      logMessage("Process completed.");

      // Cleanup input and output directories
      try {
        await ffmpeg.deleteDir("/input");
        logMessage("Cleaned up input directory.");
        await ffmpeg.deleteDir("/output");
        logMessage("Cleaned up output directory.");
      } catch (error) {
        logMessage(`Error cleaning up directories: ${error.message}`);
      }
    }
  };

  const handleUpload = (files: FileList) => {
    createSlideshow(files);
  };

  return (
    <div>
      <ImageUploader onUpload={handleUpload} />
      {loading && <p>Loading...</p>}
      {log.length > 0 && (
        <div>
          <h2>Processing Log:</h2>
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
          <a href={videoUrl} download="slideshow.mp4">
            Download Video
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoConverterForOverlay;
