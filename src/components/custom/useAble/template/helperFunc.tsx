import { toPng } from "html-to-image";
// Function to split long text into lines
export const splitTextIntoLines = (text: string, maxChars: number) => {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    if ((currentLine + word).length <= maxChars) {
      currentLine += word + " ";
    } else {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    }
  });

  lines.push(currentLine.trim());
  return lines;
};

export function numberOfChars(width) {
  // Calculate the number of characters that can fit within the width
  const averageCharWidth = 7.5; // Average width of a character in pixels
  const numberOfChars = Math.floor((width / averageCharWidth) * 0.9); // Number of characters

  return numberOfChars;
}

// Function to append icons at random positions
export const appendIcons = (
  svg,
  urls: string[],
  width: number,
  height: number
) => {
  const placedIcons = [];
  const maxRetries = 18;

  const hasOverlap = (x1, y1, w1, h1, x2, y2, w2, h2) => {
    return !(x1 + w1 < x2 || x1 > x2 + w2 || y1 + h1 < y2 || y1 > y2 + h2);
  };

  urls.forEach((url) => {
    let randomX, randomY, overlap;
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

export const downloadPNG = async (svgRef) => {
  if (svgRef.current) {
    const svgElement = svgRef.current;

    // Get SVG dimensions
    const width = parseInt(svgElement.getAttribute("width"));
    const height = parseInt(svgElement.getAttribute("height"));

    // Set the scale factor for higher resolution
    const scaleFactor = 15; // Increase this value for higher resolution

    // Create a canvas element with increased dimensions
    const canvas = document.createElement("canvas");
    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;

    const context = canvas.getContext("2d");
    context?.scale(scaleFactor, scaleFactor);

    // Convert SVG to base64 data URL
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      // Clear canvas before drawing
      context?.clearRect(0, 0, canvas.width, canvas.height);

      // Draw image on canvas with scaled dimensions
      context?.drawImage(image, 0, 0, width, height);

      // Convert canvas to PNG base64 data URL
      const pngData = canvas.toDataURL("image/png");

      // Trigger download
      const downloadLink = document.createElement("a");
      downloadLink.href = pngData;
      downloadLink.download = "visualization.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Clean up the URL object
      URL.revokeObjectURL(svgUrl);
    };

    image.src = svgUrl;

    // Convert external SVG images to data URLs and embed them
    const images = svgElement.querySelectorAll("image");
    for (const image of images) {
      const href = image.getAttribute("href");
      if (href && href.startsWith("http")) {
        const response = await fetch(href);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          const dataURI = `data:image/svg+xml;base64,${btoa(base64data)}`;
          image.setAttribute("href", dataURI);
        };
        reader.readAsBinaryString(blob);
      }
    }
  }
};

export const downloadAsPng = async (svgRef, resolution = 10) => {
  if (svgRef.current) {
    const node = svgRef.current.parentElement; // Assuming svgRef is an SVG element
    if (node) {
      try {
        const dataUrl = await toPng(node, { pixelRatio: resolution }); // Specify pixelRatio option
        const link = document.createElement("a");
        link.download = "chart.png"; // Set default download filename
        link.href = dataUrl; // Set the data URL as href
        link.click(); // Trigger the download
      } catch (error) {
        console.error("Error generating PNG:", error);
      }
    }
  }
};

export const handleMediaUpload = (
  event: React.ChangeEvent<HTMLInputElement>,
  setMediaType,
  setMedia
) => {
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
