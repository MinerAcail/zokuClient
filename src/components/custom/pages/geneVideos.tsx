import React, { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const OverlayVideo: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const ffmpegRef = useRef(new FFmpeg());

  const loadFFmpeg = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
    const ffmpeg = ffmpegRef.current;

    ffmpeg.on("log", ({ message }) => {
      if (messageRef.current) {
        messageRef.current.innerHTML = message;
      }
      console.log(message);
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });

    // setLoaded(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(Array.from(event.target.files));
    }
  };

  const createSlideshow = async () => {
    const ffmpeg = ffmpegRef.current;

    for (let i = 0; i < images.length; i++) {
      await ffmpeg.writeFile(`image${i}.png`, await fetchFile(images[i]));
    }

    const inputOptions = images.map((_, i) => `-i image${i}.png`);
    const filterComplex = `-filter_complex "concat=n=${images.length}:v=1:a=0,format=yuv420p[v]" -map "[v]"`;

    await ffmpeg.exec([...inputOptions, "-y", "output.mp4", filterComplex]);

    const data = await ffmpeg.readFile("output.mp4");
    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" })
      );
    }
  };

  return (
    <div>
      <>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
        <button onClick={createSlideshow}>Create Slideshow</button>
        <video ref={videoRef} controls></video>
        <p ref={messageRef}></p>
      </>
    </div>
  );
};

export default OverlayVideo;
