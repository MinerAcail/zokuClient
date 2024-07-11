import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import "./style.css";

const AppTemplate: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const foreignObjectRef = useRef<SVGForeignObjectElement | null>(null);
  const imagePaths = Array.from(
    { length: 50 },
    (_, index) => `../../../../src/assets/svg/${index + 1}.svg`
  );
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

      // Add a rectangle as an example content
      svg
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "#FFDCC3");

      // Function to append icons at random positions
      const appendIcons = (urls: string[]) => {
        const placedIcons = [];
        const maxRetries = 10;

        const hasOverlap = (x1, y1, w1, h1, x2, y2, w2, h2) => {
          return !(
            x1 + w1 < x2 ||
            x1 > x2 + w2 ||
            y1 + h1 < y2 ||
            y1 > y2 + h2
          );
        };

        urls.forEach((url) => {
          let randomX, randomY, overlap;
          const iconWidth = width / 4;
          const iconHeight = height / 18;
          let retries = 0;

          do {
            randomX = Math.random() * (width - iconWidth);
            randomY = Math.random() * (height - iconHeight);
            overlap = placedIcons.some((icon) =>
              hasOverlap(
                randomX,
                randomY,
                iconWidth,
                iconHeight,
                icon.x,
                icon.y,
                icon.width,
                icon.height
              )
            );
            retries++;
          } while (overlap && retries < maxRetries);

          if (!overlap) {
            placedIcons.push({
              x: randomX,
              y: randomY,
              width: iconWidth,
              height: iconHeight,
            });

            svg
              .append("image")
              .attr("href", url)
              .attr("x", randomX)
              .attr("y", randomY)
              .attr("width", iconWidth)
              .attr("height", iconHeight)
              .attr("preserveAspectRatio", "xMidYMid slice");
          }
        });
      };

      // Append icons
      appendIcons(imagePaths);

      // Add a box at the top center
      const boxWidth = width * 0.7;
      const boxHeight = height * 0.4;
      const borderRadius = 10;
      const Margin = 40;

      svg
        .append("rect")
        .attr("x", (width - boxWidth) / 2)
        .attr("y", Margin)
        .attr("width", boxWidth)
        .attr("height", boxHeight)
        .attr("rx", borderRadius)
        .attr("ry", borderRadius)
        .attr("fill", "#FF6F61");

      // Add text inside the box
      svg
        .append("text")
        .attr("x", width * 0.8)
        .attr("y", height * 0.1)
        .attr("transform", `rotate(45, ${width * 0.8}, ${height * 0.1})`)
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

      // Add foreignObject to include HTML content inside the SVG
      const foreignObject = svg
        .append("foreignObject")
        .attr("x", 0)
        .attr("y", height / 2)
        .attr("width", width)
        .attr("height", height / 2)
        .attr("class", "text-foreignObject");

      const div = foreignObject.append("xhtml:div")
        .style("width", "100%")
        .style("height", "100%")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("align-items", "center");

      div.html(
        "Athletic Shoes: Designed for sports and physical activities, these include running shoes, basketball shoes, soccer cleats. Casual Shoes: Comfortable and versatile for everyday wear, such as sneakers, loafers, boat shoes, and slip-ons."
      );
    }
  }, [imagePaths]);

  const downloadSVG = () => {
    if (svgRef.current) {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = "visualization.svg";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div>
      <svg ref={svgRef} />
      <button onClick={downloadSVG}>Download SVG</button>
    </div>
  );
};

export default AppTemplate;
