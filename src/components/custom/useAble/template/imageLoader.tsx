import React, { useState } from 'react';

interface ImageUploaderProps {
  onUpload: (files: FileList) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onUpload(event.target.files);
    }
  };

  return (
    <div>
      <input type="file" multiple accept="image/*" onChange={handleFileChange} />
    </div>
  );
};

export default ImageUploader;
