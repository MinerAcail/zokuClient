import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { toPng } from "html-to-image";
import "./style.css";
import {
  appendIcons,
  numberOfChars,
  splitTextIntoLines,
} from "../useAble/template/helperFunc";

import defaultImageUrl from "../../../assets/images/2.jpg";

const AppTemplate: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const imagePaths = Array.from(
    { length: 50 },
    (_, index) => `../../../../src/assets/svg/${index + 1}.svg`
  );

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);

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
          font-family: Sans-Serif;
          font-weight: bold;
          fill: #0E4E56;
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
        .attr("fill", "#AAE3EC");

      // Append icons
      appendIcons(svg, imagePaths, width, height);

      svg
        .append("text")
        .attr("x", width * 0.34)
        .attr("y", height * 0.079)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("font-family", "fantasy")
        .attr("font-weight", "bold")
        .attr("fill", "#261A43")
        .text("papa's_boot@Zuko.com");

      // Add a box at the top center
      const boxWidth = width * 0.9;
      const boxHeight = height * 0.4;
      const Margin = 40;

      // Determine the image URL (uploaded or default)
      const imageUrl = image ? URL.createObjectURL(image) : defaultImageUrl;

      // Append uploaded image or fallback to a colored rectangle
      svg
        .append("image")
        .attr("x", (width - boxWidth) / 2)
        .attr("y", Margin * 2)
        .attr("width", boxWidth)
        .attr("height", boxHeight)
        .attr("class", "image")
        .attr("style", "border-radius: 10px;") // Apply border-radius
        .attr("preserveAspectRatio", "xMidYMid slice") // Preserve aspect ratio
        .attr("href", imageUrl);

      // Add text inside the box todo
      // svg
      //   .append("text")
      //   .attr("x", width / 2 + boxWidth / 3.6)
      //   .attr("y", boxHeight / 4)
      //   .attr(
      //     "transform",
      //     `rotate(45, ${width / 2 + boxWidth / 4}, ${Margin + boxHeight / 4})`
      //   )
      //   .attr("dy", ".35em")
      //   .attr("text-anchor", "middle")
      //   .attr("font-size", "20px")
      //   .attr("font-family", "Arial, sans-serif")
      //   .attr("font-weight", "bold")
      //   .attr("fill", "#FFFFFF")
      //   .text("Product Tag");

      svg
        .append("text")
        .attr("x", width * 0.5)
        .attr("y", height * 0.58)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("font-size", "21px")
        .attr("font-family", "Cursive")
        .attr("font-weight", "bold")
        .attr("fill", "#261A43")
        .text("Adidas Essential 3-Stripes T-Shirt");

      const longText = `
      The Adidas Essential 3-Stripes T-Shirt combines comfort with sporty style. Made from soft cotton jersey, it features the iconic 3-Stripes on the sleeves and a classic crewneck design. Perfect for everyday wear or workouts, this versatile tee offers a relaxed fit and Adidas branding on the chest
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
        .attr("y", (d, i) => height * 0.63 + i * 20) // Adjust the y position for each line
        .text((d) => d);
    }
  }, [image, imagePaths]);

  const downloadAsPng = async () => {
    if (svgRef.current) {
      const node = svgRef.current;
      if (node) {
        // Calculate the width based on the desired height and aspect ratio
        const width = Math.round((9 / 16) * 1920);
        console.log(`${width}:${1920}`);

        // Generate the PNG with the calculated dimensions
        const dataUrl = await toPng(node, {
          pixelRatio: 2, // Adjust pixel ratio for desired resolution
          width: width,
          height: 1920,
        });

        // Create a download link for the PNG
        const link = document.createElement("a");
        link.download = "zukotem.png";
        link.href = dataUrl;
        link.click();
      }
    }
  };

  return (
    <div>
      <label>Upload Image (optional):</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />
      <svg ref={svgRef} style={{ height: "300px" }} />
      <button onClick={downloadAsPng}>Download png</button>
    </div>
  );
};

export default AppTemplate;
