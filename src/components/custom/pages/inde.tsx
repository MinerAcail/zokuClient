import React, { useState, useRef, useEffect } from 'react';
import Sketch from 'react-p5';
import p5Types from 'p5';

const AppTemplate: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const canvasRef = useRef<p5Types | null>(null);
  const imgRef = useRef<p5Types.Image | null>(null);
  const [imgElement, setImgElement] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && image) {
      const p5 = canvasRef.current;
      imgRef.current = p5.loadImage(URL.createObjectURL(image));
    }
  }, [image]);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    const canvasWidth = 540; // Desired width
    const canvasHeight = (canvasWidth * 16) / 9; // Calculate height based on 9:16 aspect ratio
    const canvas = p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
    canvasRef.current = p5;
    setImgElement(canvas.elt); // Set the canvas element
  };

  const draw = (p5: p5Types) => {
    p5.background(200);
    p5.textSize(32);
    p5.fill(0);
    p5.text(text, 50, 50);
    if (imgRef.current) {
      const targetWidth = 300; // Desired width for the image
      const targetHeight = (targetWidth * 16) / 9; // Calculate height based on 9:16 aspect ratio
      const targetX = 50; // X position to start drawing the image
      const targetY = 100; // Y position to start drawing the image

      // Get the aspect ratio of the original image
      const originalAspectRatio = imgRef.current.width / imgRef.current.height;

      let displayWidth, displayHeight;

      // Determine whether to fit based on width or height
      if (originalAspectRatio > 9 / 16) {
        // Image is wider than 9:16, fit by width
        displayWidth = targetWidth;
        displayHeight = targetWidth / originalAspectRatio;
      } else {
        // Image is taller than 9:16, fit by height
        displayHeight = targetHeight;
        displayWidth = targetHeight * originalAspectRatio;
      }

      p5.image(imgRef.current, targetX, targetY, displayWidth, displayHeight);
    }
  };

  const handleGenerate = (event: React.FormEvent) => {
    event.preventDefault();
    if (imgElement) {
      const imgDataUrl = imgElement.toDataURL('image/png');
      setOutput(imgDataUrl);
    }
  };

  return (
    <div>
      <h1>Template Generator with p5.js</h1>
      <Sketch setup={setup} draw={draw} />
      <form onSubmit={handleGenerate}>
        <div>
          <label>Enter Text:</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} required />
        </div>
        <div>
          <label>Upload Image (optional):</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        </div>
        <button type="submit">Generate Template</button>
      </form>
      {output && (
        <div>
          <img src={output} alt="Generated Template" />
          <a href={output} download="template.png">
            Download Image
          </a>
        </div>
      )}
    </div>
  );
};

export default AppTemplate;
