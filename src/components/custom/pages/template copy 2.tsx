import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const AppTemplate: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [svgUrl, setSvgUrl] = useState<string | null>(null);
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.create('svg')
      .attr('width', 800)
      .attr('height', 500);

    // Draw text
    svg.append('text')
      .attr('x', 50)
      .attr('y', 50)
      .text(text);

    // Optionally handle uploaded image
    if (image) {
      const reader = new FileReader();
      reader.onload = (e) => {
        svg.append('image')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', 200)
          .attr('height', 200)
          .attr('href', e.target?.result as string);
        
        // Save the generated SVG and PNG as URLs
        const svgString = new XMLSerializer().serializeToString(svg.node());
        const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
        setSvgUrl(svgDataUrl);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions to match SVG
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            const pngDataUrl = URL.createObjectURL(blob);
            setPngUrl(pngDataUrl);
          }, 'image/png');
        };
        img.src = svgDataUrl;
      };
      reader.readAsDataURL(image);
    } else {
      // If no image uploaded, save SVG only
      const svgString = new XMLSerializer().serializeToString(svg.node());
      const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
      setSvgUrl(svgDataUrl);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set canvas dimensions to match SVG
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          const pngDataUrl = URL.createObjectURL(blob);
          setPngUrl(pngDataUrl);
        }, 'image/png');
      };
      img.src = svgDataUrl;
    }

    // Clean up SVG elements
    return () => {
      svg.selectAll('*').remove();
    };
  }, [text, image]);

  return (
    <div>
      <h1>Template Generator with D3.js</h1>
      <form>
        <div>
          <label>Enter Text:</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Upload Image (optional):</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </div>
      </form>
      {svgUrl && (
        <div>
          <h2>SVG Preview</h2>
          <img src={svgUrl} alt="Generated Template SVG" />
          <a href={svgUrl} download="template.svg">
            Download SVG
          </a>
        </div>
      )}
      {pngUrl && (
        <div>
          <h2>PNG Preview</h2>
          <img src={pngUrl} alt="Generated Template PNG" />
          <a href={pngUrl} download="template.png">
            Download PNG
          </a>
        </div>
      )}
    </div>
  );
};

export default AppTemplate;
