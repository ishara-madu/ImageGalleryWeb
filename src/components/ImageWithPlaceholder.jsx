import React, { useRef, useEffect, useState } from 'react';

const ImageWithLoading = ({ lowQualityLink, ultalowQualityLink, altText }) => {
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [isHighQualityLoaded, setHighQualityLoaded] = useState(false);

  useEffect(() => {
    // Load high-quality image after 1 second
    const timer = setTimeout(() => {
      const highQualityImage = new Image();
      highQualityImage.src = lowQualityLink;

      highQualityImage.onload = () => {
        setHighQualityLoaded(true);
        if (imgRef.current) {
          imgRef.current.src = lowQualityLink;
          setLoaded(true);
        }
      };

      return () => {
        highQualityImage.onload = null;
      };
    }, 0); // 1 second delay

    return () => {
      clearTimeout(timer); // Clean up timer on component unmount
    };
  }, [lowQualityLink]);

  return (
    <img
      ref={imgRef}
      src={ultalowQualityLink}
      alt={altText}
      style={{
        display: 'block',
        width: '100%',
        minHeight: '200px',
        height: 'auto',
        objectFit: 'cover',
        opacity: isHighQualityLoaded ? 1 : 0.6,
        transition: 'opacity 0.5s ease-in-out'
      }}
      loading="lazy"
    />
  );
};

export default ImageWithLoading;
