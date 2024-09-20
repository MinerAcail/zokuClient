import React from 'react';

// Utility function to convert HEX to RGB
const hexToRGB = (hex: string): { r: number; g: number; b: number } => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

// Utility function to convert RGB to HEX
const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (x: number) => x.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Function to generate gradient colors
const generateGradient = (startColor: string, numSteps: number): string[] => {
  const { r: startR, g: startG, b: startB } = hexToRGB(startColor);
  const gradient: string[] = [];

  const rIncrement = (255 - startR) / (numSteps - 1);
  const gIncrement = (255 - startG) / (numSteps - 1);
  const bIncrement = (255 - startB) / (numSteps - 1);

  for (let i = 0; i < numSteps; i++) {
    const r = Math.round(startR + i * rIncrement );
    const g = Math.round(startG + i * gIncrement);
    const b = Math.round(startB + i * bIncrement );
    gradient.push(rgbToHex(r, g, b));
  }

  return gradient;
};

// Define the props interface for GradientDisplay
interface GradientDisplayProps {
  startColor: string;
  numSteps: number;
}

// React Component to display the gradient
export const GradientDisplay: React.FC<GradientDisplayProps> = ({ startColor, numSteps }) => {
  const gradientColors = generateGradient(startColor, numSteps);

  return (
    <div style={{ display: 'flex', height: '100px' }}>
      {gradientColors.map((color, index) => (
        <div
          key={index}
          style={{
            backgroundColor: color,
            flex: 1,
            height: '100%',
            borderRight: index < gradientColors.length - 1 ? '1px solid white' : 'none',
          }}
        />
      ))}
    </div>
  );
};


