// src/components/ImageGallery.js
import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';

const GET_IMAGE_URLS = gql`
  query ImageUrls {
    imageUrls
  }
`;

const ImageGallery = () => {
  const { loading, error, data } = useQuery(GET_IMAGE_URLS);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (data && data.imageUrls) {
      // Adjust URLs to be relative to the /minio proxy
      const adjustedUrls = data.imageUrls.map(url => url.replace('http://minio:9000', '/minio'));
      setImages(adjustedUrls);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="image-gallery">
      {images.map((url, index) => (
        <img key={index} src={url} alt={`Image ${index + 1}`} />
      ))}
    </div>
  );
};

export default ImageGallery;
