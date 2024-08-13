import React, { ChangeEvent, useState } from "react";
import { gql, useMutation } from "@apollo/client";

const UPLOAD_FILE = gql`
  mutation AdvertisementUpload($bgFiles: [Upload!]!, $productId: String!) {
    advertisementUpload(bgFiles: $bgFiles, productId: $productId) {
      overlay
      bg
      combine
    }
  }
`;

interface UploadFileProps {
  productId: string;
}

const AdverUploadFile: React.FC<UploadFileProps> = ({ productId }) => {
  const [uploadFile] = useMutation(UPLOAD_FILE);
  const [bgFiles, setBgFiles] = useState<File[]>([]);
  const [bgDownloadLink, setBgDownloadLink] = useState<string | null>(null);
  const [overlayDownloadLink, setOverlayDownloadLink] = useState<string | null>(
    null
  );
  const [combinedDownloadLink, setCombinedDownloadLink] = useState<
    string | null
  >(null);

  const handleBgFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setBgFiles(Array.from(files));
    }
  };

  const handleSubmit = async () => {
    if (bgFiles.length > 0) {
      try {
        const { data } = await uploadFile({
          variables: { bgFiles, productId },
        });

        if (data?.advertisementUpload) {
          const { bg, overlay, combine } = data.advertisementUpload;

          // Utility function to convert base64 to Blob
          const base64ToBlob = (base64: string, contentType: string) => {
            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            return new Blob([byteArray], { type: contentType });
          };

          const bgBlob = base64ToBlob(bg, "video/mp4");
          const bgUrl = URL.createObjectURL(bgBlob);
          setBgDownloadLink(bgUrl);

          const overlayBlob = base64ToBlob(overlay, "video/mp4");
          const overlayUrl = URL.createObjectURL(overlayBlob);
          setOverlayDownloadLink(overlayUrl);

          const combinedBlob = base64ToBlob(combine, "video/mp4");
          const combinedUrl = URL.createObjectURL(combinedBlob);
          setCombinedDownloadLink(combinedUrl);
        }
      } catch (error) {
        console.error("Error uploading files:", error);
      }
    } else {
      console.error("Background files are required.");
    }
  };

  return (
    <div>
      <div>Upload your background images:</div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleBgFileChange}
      />
      <button onClick={handleSubmit}>Submit</button>
      {bgDownloadLink && (
        <div>
          <a href={bgDownloadLink} download="background_video.mp4">
            Download Background Video
          </a>
        </div>
      )}
      {overlayDownloadLink && (
        <div>
          <a href={overlayDownloadLink} download="overlay_video.mp4">
            Download Overlay Video
          </a>
        </div>
      )}
      {combinedDownloadLink && (
        <div>
          <a href={combinedDownloadLink} download="combined_video.mp4">
            Download Combined Video
          </a>
        </div>
      )}
    </div>
  );
};

export default AdverUploadFile;
