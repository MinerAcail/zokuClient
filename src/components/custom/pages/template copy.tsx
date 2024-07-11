import React, { useState, useRef, useEffect } from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import {
  CanvasDraw,
  CanvasSetUp,
  GridDraw,
  GridSetUp,
} from "../useAble/template/helperFunc";

const AppTemplate: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const canvasRef = useRef<p5Types | null>(null);
  const imgRef = useRef<p5Types.Image | null>(null);
  const [imgElement, setImgElement] = useState<HTMLCanvasElement | null>(null);

  const scl = 20; // Scale of each grid cell
  let cols: number, rows: number;

  useEffect(() => {
    if (canvasRef.current && image) {
      const p5 = canvasRef.current;
      imgRef.current = p5.loadImage(URL.createObjectURL(image));
    }
  }, [image]);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    const { canvas, canvasWidth, canvasHeight } = CanvasSetUp(
      p5,
      canvasParentRef
    );
    canvasRef.current = p5;
    setImgElement(canvas.elt); // Set the canvas element

    const gridSetup = GridSetUp(p5, canvasWidth, canvasHeight, scl);
    cols = gridSetup.cols;
    rows = gridSetup.rows;

    // Draw the background once in setup
    CanvasDraw(p5);
    GridDraw(p5, cols, rows, scl); // Draw the grid once in setup
  };

  const draw = (p5: p5Types) => {
    p5.textSize(32);
    p5.fill(0);
    p5.text(text, 50, 50);
    // if (imgRef.current) {
    //   p5.image(imgRef.current, 0, 0, p5.width, p5.height);
    // }
    // p5.fill(0);
    // p5.textSize(32);
    // p5.text(text, 10, p5.height - 30);
  };

  const handleGenerate = (event: React.FormEvent) => {
    event.preventDefault();
    if (imgElement) {
      const imgDataUrl = imgElement.toDataURL("image/png");
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
