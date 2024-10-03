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

import defaultImageUrl from "../../../../../assets/images/1.jpg";
import "../../../pages/style.css";
import { gql, useMutation } from "@apollo/client";
import {
  
  useTheme,
} from "@/components/custom/theme/context/themeContext";
import ThemeSwitcher from "@/components/custom/theme/ThemeSwitcher";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateSVGContent } from "@/components/custom/useAble/template/gen/generateSVGContent";

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
  price?: number;
  brand?: string;
  description: string;
  imageUrls: string[];
  productId: string; // Ensure productId is passed correctly
}

function Sidesheet({
  Children,
  productId,
  name,
  description,
  imageUrls,
}: SheetProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const svgRef1 = useRef<SVGSVGElement | null>(null);
  const svgRef2 = useRef<SVGSVGElement | null>(null);
  const { theme } = useTheme();
  const [uploadFile] = useMutation(UPLOAD_FILE);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [combinedDownloadLink, setCombinedDownloadLink] = useState<
    string | null
  >(null);
  const imageUrl = imageUrls[0] || defaultImageUrl;
  const imageUrl1 = imageUrls[1] || defaultImageUrl;
  const imageUrl2 = imageUrls[2] || defaultImageUrl;

 

  useEffect(() => {
    if (isSheetOpen) {
      const timer = setTimeout(() => {
        
        if (svgRef.current) {
          generateSVGContent(
            svgRef.current,
            imageUrl,
            name,
            description,
            theme,
            imagePaths
          );
        }

        if (svgRef1.current) {
          generateSVGContent(
            svgRef1.current,
            imageUrl1,
            name,
            description,
            theme,
            imagePaths
          );
        }
        if (svgRef2.current) {
          generateSVGContent(
            svgRef2.current,
            imageUrl2,
            name,
            description,
            theme,
            imagePaths
          );
        }
        
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isSheetOpen, imageUrls, description, name, theme]);

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
            .then((response) => response.blob())
            .then((blob) => {
              const file = new File([blob], "background.png", {
                type: blob.type,
              });
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
            .catch((error) => {
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
          <SheetTitle>Colof</SheetTitle>
          <ThemeSwitcher />
        </SheetHeader>
        <ScrollArea className="rounded-md border h-80 overflow-auto">
  <svg className="m-4" ref={svgRef} style={{ height: "300px" }} />
  <svg className="m-4" ref={svgRef1} style={{ height: "300px" }} />
  <svg className="m-4" ref={svgRef2} style={{ height: "300px" }} />

</ScrollArea>


        <SheetFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          {!combinedDownloadLink && (
            <Button onClick={handleSubmit}>Generate Aids</Button>
          )}
          {combinedDownloadLink && (
            <Button
              onClick={() => {
                const link = document.createElement("a");
                link.href = combinedDownloadLink;
                link.download = "combined_video.mp4";
                link.click();
                
              }}
            >
              Download Combined Video
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default Sidesheet;
