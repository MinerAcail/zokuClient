import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { toPng } from "html-to-image";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import loadFfmpeg from "../useAble/template/ffmpegLoader";
import fallbackImage from "../../../assets/images/3.jpg";
import "./style.css";
import {
  appendIcons,
  numberOfChars,
  splitTextIntoLines,
} from "../useAble/template/helperFunc";

const AppTemplate: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [media, setMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string>("image");
  const [ffmpeg, setFfmpeg] = useState<FFmpeg | null>(null);
  const [outputVideoUrl, setOutputVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const imagePaths = Array.from(
    { length: 50 },
    (_, index) => `../../../../src/assets/svg/${index + 1}.svg`
  );

  useEffect(() => {
    const initializeFfmpeg = async () => {
      try {
        const ffmpegInstance = await loadFfmpeg();
        setFfmpeg(ffmpegInstance);
      } catch (error) {
        console.error("Failed to initialize ffmpeg", error);
      }
    };
    initializeFfmpeg();
  }, []);

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);

      // Define the dimensions and aspect ratio (vertical 16:9)
      const height = 660;
      const width = (9 / 16) * height;

      // Set the SVG dimensions
      svg
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);

      // Clear any previous content
      svg.selectAll("*").remove();

      // Add a <style> tag inside the SVG
      svg.append("style").text(`
        .long-text {
          font-size: 15px;
          font-family: Arial, sans-serif;
          font-weight: bold;
          fill: red;
          text-anchor: middle;
          dominant-baseline: middle;
        }
        .image {
          border-radius: 20px;
        }
      `);

      // Add a rectangle as an example content
      svg
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "#FFDCC3");

      // Append icons
      appendIcons(svg, imagePaths, width, height);

      // Add a box at the top center
      const boxWidth = width * 0.9;
      const boxHeight = height * 0.4;
      const borderRadius = 10;
      const Margin = 40;

      // Append uploaded image or fallback to a colored rectangle
      if (mediaType === "image") {
        svg
          .append("image")
          .attr("x", (width - boxWidth) / 2)
          .attr("y", Margin)
          .attr("width", boxWidth)
          .attr("height", boxHeight)
          .attr("class", "image")
          .attr("style", "border-radius: 10px;") // Apply border-radius
          .attr("preserveAspectRatio", "xMidYMid slice") // Preserve aspect ratio
          .attr("href", media || fallbackImage);
      }

      svg
        .append("text")
        .attr("x", width / 2 + boxWidth / 3.6)
        .attr("y", boxHeight / 4)
        .attr(
          "transform",
          `rotate(45, ${width / 2 + boxWidth / 4}, ${Margin + boxHeight / 4})`
        )
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("font-family", "Arial, sans-serif")
        .attr("font-weight", "bold")
        .attr("fill", "#FFFFFF")
        .text("Product Tag");

      svg
        .append("text")
        .attr("x", width * 0.5)
        .attr("y", height * 0.5)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("font-family", "Arial, sans-serif")
        .attr("font-weight", "bold")
        .attr("fill", "#FFFFFF")
        .text("Flip-Flops Boot");

      const longText = `
        Athletic Shoes: Designed for sports and physical activities,to avoid errors, but we cannot warrant full correctness of all content. While using W3Schools, you agree to have read oijfw and accepted these include running shoes, basketball shoes, soccer cleats. Casual Shoes: Comfortable and versatile for everyday wear, such as sneakers, loafers, boat shoes, and slip-ons.
      `;

      const longTextLines = splitTextIntoLines(longText, numberOfChars(width));

      // Add long text inside the SVG as multiple lines
      svg
        .selectAll(".long-text")
        .data(longTextLines)
        .enter()
        .append("text")
        .attr("class", "long-text")
        .attr("x", width / 2)
        .attr("y", (d, i) => height * 0.55 + i * 20) // Adjust the y position for each line
        .text((d) => d);
    }
  }, [media, mediaType, imagePaths]);

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type.startsWith("video") ? "video" : "image";
      setMediaType(fileType);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setMedia(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadAsPng = async () => {
    if (svgRef.current) {
      const node = svgRef.current;
      if (node) {
        const dataUrl = await toPng(node, {
          pixelRatio: 10,
        });
        const link = document.createElement("a");
        link.download = "zukotem.png";
        link.href = dataUrl;
        link.click();
      }
    }
  };

  const overlaySvgOnVideo = async () => {
    if (!ffmpeg || !media || mediaType !== "video" || !svgRef.current) return;

    setLoading(true);

    // Convert SVG to PNG
    const svgNode = svgRef.current;
    const pngDataUrl = await toPng(svgNode, { pixelRatio: 10 });
    const pngBlob = await fetch(pngDataUrl).then(res => res.blob());
    const pngArrayBuffer = await pngBlob.arrayBuffer();
    const pngUint8Array = new Uint8Array(pngArrayBuffer);

    // Load the video file
    const videoResponse = await fetch(media);
    const videoArrayBuffer = await videoResponse.arrayBuffer();
    const videoUint8Array = new Uint8Array(videoArrayBuffer);

    // Write the files to ffmpeg FS
    ffmpeg.FS('writeFile', 'input.mp4', videoUint8Array);
    ffmpeg.FS('writeFile', 'overlay.png', pngUint8Array);

    // Execute FFmpeg command to overlay PNG on video
    await ffmpeg.run(
      '-i', 'input.mp4',
      '-i', 'overlay.png',
      '-filter_complex', '[1][0]scale2ref=w=iw:h=ih[ovr][base];[base][ovr]overlay=x=W-w-10:y=H-h-10',
      'output.mp4'
    );

    // Read the result
    const data = ffmpeg.FS('readFile', 'output.mp4');
    const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
    const videoUrl = URL.createObjectURL(videoBlob);
    setOutputVideoUrl(videoUrl);

    setLoading(false);
  };

  return (
    <div>
      <label>Upload Media (optional):</label>
      <input
        type="file"
        accept="image/*, video/*"
        onChange={handleMediaUpload}
      />
      <div style={{ position: "relative", width: "fit-content", margin: "auto" }}>
        <svg ref={svgRef} style={{ display: mediaType === "image" ? "block" : "none" }} />
        {mediaType === "video" && media && (
          <video
            src={media}
            controls
            style={{
              position: "absolute",
              top: 40,
              left: "50%",
              transform: "translateX(-50%)",
              width: "90%",
              height: "40%",
              borderRadius: "10px"
            }}
          />
        )}
      </div>
      <button onClick={downloadAsPng}>Download PNG</button>
      {mediaType === "video" && (
        <button onClick={overlaySvgOnVideo} disabled={loading}>
          {loading ? 'Processing...' : 'Overlay SVG on Video'}
        </button>
      )}
      {outputVideoUrl && (
        <div>
          <h3>Output Video:</h3>
          <video src={outputVideoUrl} controls width="500" />
          <a href={outputVideoUrl} download="output.mp4">Download Output Video</a>
        </div>
      )}
    </div>
  );
};

export default AppTemplate;
