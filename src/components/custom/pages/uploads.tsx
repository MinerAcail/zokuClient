import React, { ChangeEvent } from 'react';
import { gql, useMutation } from '@apollo/client';

const UPLOAD_FILES = gql`
  mutation($files: [UploadFile!]!) {
    overLayUpload(files: $files) {
      id
      name
      content
    }
  }
`;

const UploadFiles: React.FC = () => {
  const [uploadFiles] = useMutation(UPLOAD_FILES);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        const fileArray = Array.from(files);
        const { data } = await uploadFiles({ variables: { file: fileArray } });
        console.log('Files uploaded successfully:', data);
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    }
  };

  return (
    <div>
      <div></div>
      <input
        type="file"
        multiple
        required
        onChange={handleFileChange}
      />
    </div>
  );
};

export default UploadFiles;
