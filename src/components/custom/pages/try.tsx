// src/components/D3Component.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import backgroundIcon from '../../../assets/svg/2.svg';

import { toPng } from 'html-to-image';

const D3Component: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const height = 660;
    const width = (9 / 16) * height;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background-image', `url(${backgroundIcon})`)
      .style('background-size', 'cover')
      .style('background-repeat', 'no-repeat')
      .style('background-position', 'center');

    // Your D3 code to manipulate the SVG
    svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', 50)
      .style('fill', 'blue');
  }, []);

  const downloadAsPng = async () => {
    if (svgRef.current) {
      const node = svgRef.current;
      if (node) {
        const dataUrl = await toPng(node,{
            pixelRatio: 10,
  
        });
        const link = document.createElement('a');
        link.download = 'chart.png';
        link.href = dataUrl;
        link.click();
      }
    }
  };

  return (
    <div>
      <svg ref={svgRef}></svg>
      <button onClick={downloadAsPng}>Download as PNG</button>
    </div>
  );
};

export default D3Component;
