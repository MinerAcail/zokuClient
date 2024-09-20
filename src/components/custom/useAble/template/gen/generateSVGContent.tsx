import * as d3 from "d3";
// import { Themes } from "@/components/custom/theme/utils/themeUtils";
import { splitTextIntoLines, numberOfChars } from "@/components/custom/useAble/template/helperFunc";
import { ThemeName, Themes } from "@/components/custom/theme/utils/themeUtils";

export const generateSVGContent = (
  svgElement: SVGSVGElement,
  imageUrl: string,
  name: string,
  description: string,
  theme: ThemeName,
  imagePaths: string[]
) => {
    
  const svg = d3.select(svgElement);
  const height = 660;
  const width = (9 / 16) * height;

  const { primaryColor, backgroundColor, textColor } =
    Themes[theme] || Themes["blue"];

  svg
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`);

  svg.selectAll("*").remove();

  // Call function to append CSS styles
  appendStyles(svg, primaryColor);

  svg
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .attr("fill", backgroundColor);

  appendIcons(svg, imagePaths, width, height);

  // Call function to append contact info text
  appendText(svg, width * 0.34, height * 0.079, "papa's_boot@Zuko.com", "18px", "fantasy", "bold", textColor);

  const boxWidth = width * 0.9;
  const boxHeight = height * 0.4;
  const Margin = 40;

  // Call function to append the main image
  appendUrlImages(svg, imageUrl, boxWidth, boxHeight, Margin, width);

  // Call function to append the name text
  appendText(svg, width * 0.5, height * 0.58, name, "21px", "Cursive", "bold", textColor);

  // Call function to append long text
  appendLongText(svg, description, width, height);
};// Function to append CSS styles to the SV
const appendStyles = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  primaryColor: string
) => {
  svg.append("style").text(`
    .long-text {
      font-size: 15px;
      font-family: Sans-Serif;
      font-weight: bold;
      fill: ${primaryColor};
      text-anchor: middle;
      dominant-baseline: middle;
    }
    .image {
      border-radius: 20px;
    }
  `);
};

// Function to append long text to the SVG
const appendLongText = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  description: string,
  width: number,
  height: number
) => {
  const longTextLines = splitTextIntoLines(description || "", numberOfChars(width));

  svg
    .selectAll(".long-text")
    .data(longTextLines)
    .enter()
    .append("text")
    .attr("class", "long-text")
    .attr("x", width / 2)
    .attr("y", (d, i) => height * 0.63 + i * 20)
    .text((d) => d);
};

// Function to append icons a   t random positions
export const appendIcons = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  urls: string[],
  width: number,
  height: number
) => {
  interface Icon {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  const placedIcons: Icon[] = [];
  const maxRetries = 18;

  const hasOverlap = (
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number
  ): boolean => {
    return !(x1 + w1 < x2 || x1 > x2 + w2 || y1 + h1 < y2 || y1 > y2 + h2);
  };

  urls.forEach((url) => {
    let randomX: number;
    let randomY: number;
    let overlap: boolean;
    const iconWidth = width / 10;
    const iconHeight = height / 13;
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
    
// Function to append the main image
export const appendUrlImages = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  imageUrl: string,
  boxWidth: number,
  boxHeight: number,
  Margin: number,
  width: number
) => {
  svg
    .append("image")
    .attr("x", (width - boxWidth) / 2)
    .attr("y", Margin * 2)
    .attr("width", boxWidth)
    .attr("height", boxHeight)
    .attr("class", "image")
    .attr("style", "border-radius: 10px;")
    .attr("preserveAspectRatio", "xMidYMid slice")
    .attr("href", imageUrl);
};

// Function to append a text element to the SVG
const appendText = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  x: number,
  y: number,
  text: string,
  fontSize: string,
  fontFamily: string,
  fontWeight: string,
  fill: string
) => {
  svg
    .append("text")
    .attr("x", x)
    .attr("y", y)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("font-size", fontSize)
    .attr("font-family", fontFamily)
    .attr("font-weight", fontWeight)
    .attr("fill", fill)
    .text(text);
};
