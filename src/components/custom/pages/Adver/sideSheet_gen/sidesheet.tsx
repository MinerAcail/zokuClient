import { useRef, useEffect, useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import * as d3 from "d3";
import { toPng } from "html-to-image";
import {
  appendIcons,
  numberOfChars,
  splitTextIntoLines,
} from "@/components/custom/useAble/template/helperFunc";
import defaultImageUrl from "../../../../../assets/images/1.jpg";
import "../../../pages/style.css";
import { gql, useMutation } from "@apollo/client";

const imagePaths = Array.from(
  { length: 50 },
  (_, index) => `../../../../../../src/assets/svg/${index + 1}.svg`
);

const UPLOAD_FILE = gql`
  mutation AdvertisementUpload($bgFiles: [Upload!]!, $productId: String!) {
    advertisementUpload(bgFiles: $bgFiles, productId: $productId) {
      overlay
      bg
      combine
    }
  }
`;

interface SheetProps {
  name: string;
  Children: ReactNode;
  price: number;
  brand: string;
  description: string;
  imageUrls: string[];
  productId: string; // Ensure productId is passed correctly
}

function Sidesheet({
  Children,
  productId,
  name,
  price,
  brand,
  description,
  imageUrls,
}: SheetProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [uploadFile] = useMutation(UPLOAD_FILE);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
//   const [bgFiles, setBgFiles] = useState<File[]>([]);
  const [combinedDownloadLink, setCombinedDownloadLink] = useState<string | null>(null);
  const imageUrl = imageUrls[0] || defaultImageUrl;

  useEffect(() => {
    if (isSheetOpen) {
      const timer = setTimeout(() => {
        if (svgRef.current) {
          const svg = d3.select(svgRef.current);
          const height = 660;
          const width = (9 / 16) * height;

          svg
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`);

          svg.selectAll("*").remove();

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

          svg
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "#AAE3EC");

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

          const boxWidth = width * 0.9;
          const boxHeight = height * 0.4;
          const Margin = 40;

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
            .text(name);

          const longText = description || "";
          const longTextLines = splitTextIntoLines(
            longText,
            numberOfChars(width)
          );

          svg
            .selectAll(".long-text")
            .data(longTextLines)
            .enter()
            .append("text")
            .attr("class", "long-text")
            .attr("x", width / 2)
            .attr("y", (d, i) => height * 0.63 + i * 20)
            .text((d) => d);
        }
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isSheetOpen, imageUrls, description, name]);

  const handleOpen = () => setIsSheetOpen(true);
  const handleClose = () => setIsSheetOpen(false);

  const handleSubmit = async () => {
    if (svgRef.current) {
      try {
        const svg = d3.select(svgRef.current);

        // Hide image element for PNG generation
        const imageElement = svg.selectAll("image").filter(function () {
          return d3.select(this).attr("href") === imageUrl;
        });
  
        imageElement.style("display", "none");
  
        const node = svg.node();
        if (node) {
          const width = Math.round((9 / 16) * 1920);
  
          const dataUrl = await toPng(node, {
            pixelRatio: 2,
            width: width,
            height: 1920,
          });
  
          // Re-enable image element
          imageElement.style("display", "");

          // Convert data URL to Blob and File
          fetch(dataUrl)
            .then(response => response.blob())
            .then(blob => {
              const file = new File([blob], "background.png", { type: blob.type });
            //   setBgFiles([file]);
              return uploadFile({
                variables: { bgFiles: [file], productId },
              });
            })
            .then(({ data }) => {
              if (data?.advertisementUpload) {
                const { combine } = data.advertisementUpload;

                const base64ToBlob = (base64: string, contentType: string) => {
                  const byteCharacters = atob(base64);
                  const byteNumbers = new Array(byteCharacters.length);
                  for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                  }
                  const byteArray = new Uint8Array(byteNumbers);
                  return new Blob([byteArray], { type: contentType });
                };

                const combinedBlob = base64ToBlob(combine, "video/mp4");
                const combinedUrl = URL.createObjectURL(combinedBlob);
                setCombinedDownloadLink(combinedUrl);
              }
            })
            .catch(error => {
              console.error("Error processing files:", error);
            });
        }
      } catch (error) {
        console.error("Error generating PNG:", error);
      }
    } else {
      console.error("SVG reference is missing.");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild onClick={handleOpen}>
        {Children}
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>Product Details</SheetTitle>
        </SheetHeader>
        <svg className="m-4" ref={svgRef} style={{ height: "300px" }} />

        <SheetFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          {!combinedDownloadLink &&
          
          <Button onClick={handleSubmit}>Generate Aids</Button> 
          }
          {combinedDownloadLink && (
            <Button onClick={() => {
              const link = document.createElement("a");
              link.href = combinedDownloadLink;
              link.download = "combined_video.mp4";
              link.click();
            }}>
              Download Combined Video
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default Sidesheet;
