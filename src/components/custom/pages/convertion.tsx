import React, { useState, useEffect, useRef } from "react";
import { toPng } from "html-to-image";
import loadFfmpeg from "../useAble/template/ffmpegLoader";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const SvgImage: React.FC<{ svgRef: React.RefObject<SVGSVGElement> }> = ({
  svgRef,
}) => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const initializeFfmpeg = async () => {
      try {
        const ffmpegInstance = await loadFfmpeg();
        ffmpegRef.current = ffmpegInstance;
        setLoaded(true);
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

  const generateImage = async () => {
    if (svgRef.current) {
      const node = svgRef.current;
      if (node) {
        const dataUrl = await toPng(node, {
          pixelRatio: 10,
        });
        setImageData(dataUrl);
      }
    }
  };

  const createVideo = async () => {
    if (ffmpegRef.current && imageData) {
      const ffmpeg = ffmpegRef.current;
      const response = await fetch(imageData);
      const blob = await response.blob();
      const file = new File([blob], "image.png", { type: "image/png" });

      // Write the image file to ffmpeg FS
      await ffmpeg.writeFile("image.png", await fetchFile(file));

      // Execute the ffmpeg command to create a 1-minute video
      await ffmpeg.exec([
        "-loop",
        "1",
        "-i",
        "image.png",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-vf",
        
        // "scale=1280:720",
        "/output/output.mp4",
      ]);
      // ("-loop", "1", "-i", "image.png", "-c:v", "libx264", "-t", "60", "-pix_fmt", "yuv420p", "-vf", "scale=1280:720", "/output/video.mp4")
      // Read the resulting video file from ffmpeg FS
      const data = await ffmpeg.readFile("/output/video.mp4");

      // Convert the data to a Blob
      let videoBlob;
      if (data instanceof Uint8Array) {
        videoBlob = new Blob([data], { type: "video/mp4" });
      } else {
        videoBlob = new Blob([new TextEncoder().encode(data)], {
          type: "video/mp4",
        });
      }

      // Create an object URL from the Blob
      const videoUrl = URL.createObjectURL(videoBlob);

      // Set the video source
      if (videoRef.current) {
        videoRef.current.src = videoUrl;
      }
    }
  };

  const initializeFfmpeg = async () => {
    try {
      const ffmpegInstance = await loadFfmpeg();
      ffmpegRef.current = ffmpegInstance;
      setLoaded(true);
    } catch (error) {
      logMessage("Failed to initialize ffmpeg");
    }
  };

  return loaded ? (
    <div>
      <button onClick={generateImage}>Generate Image</button>
      {imageData && (
        <img src={imageData} alt="SVG as PNG" className="w-4/6 h-4/6" />
      )}
      <button onClick={createVideo}>Create Video</button>
      <video ref={videoRef} controls className="w-full mt-4"></video>
      <p ref={messageRef}></p>
      <p>Open Developer Tools (Ctrl+Shift+I) to View Logs</p>
    </div>
  ) : (
    <button onClick={initializeFfmpeg}>Load ffmpeg-core (~31 MB)</button>
  );
};

export default SvgImage;
