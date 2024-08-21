import React, { useState,useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import ImageWithPlaceholder from './ImageWithPlaceholder';

const Masonry = lazy(() => import('react-masonry-css'));
const LoveBtn = lazy(() => import('./LoveBtn'));
const AddCartBtn = lazy(() => import('./AddCartBtn'));
const DownloadBtn = lazy(() => import('./DownloadBtn'));
const PopupImg = lazy(() => import('./PopupImg'));

const breakpointColumnsObj = {
  default: 4,
  1200: 3,
  800: 2,
  500: 1,
};

function Favorite({ images,hasMoreImages,loadMoreImages, lovedItems, loading, error }) {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const loadMoreRef = useRef(null);

  const handleImageClick = useCallback((image) => {
    setSelectedImage(image);
    setPopupOpen(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setPopupOpen(false);
    setSelectedImage(null);
  }, []);

  const handleImageLoad = useCallback((image) => {
    const img = new Image();
    img.src = image.highQualityLink;
  }, []);

  // Filter images to display only loved images
  const filteredImages = images.filter((image) =>
    lovedItems.some((lovedItem) => lovedItem.iid === image.iid)
  );
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMoreImages && !loading) {
        loadMoreImages();
      }
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreImages, hasMoreImages, loading]);
  return (
    <div>
      <h1 style={{ margin: "15px" }}>Your Favorite Images</h1>
      {loading && <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && filteredImages.length === 0 && (
        <div className="loading-indicator">
          <p>No favorite images to display.</p>
        </div>
      )}

      {!loading && !error && filteredImages.length > 0 && (
        <>
          <Suspense fallback={<div>Loading images...</div>}>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="image-grid"
              columnClassName="image-grid_column"
            >
              {filteredImages.map((image) => (
                <div key={image.id} className="image-item">
                  <ImageWithPlaceholder
                    className="image-with-placeholder"
                    lowQualityLink={image.lowQualityLink}
                    ultalowQualityLink={image.ultralowQualityLink}
                    altText={`Image of ${image.iid}`}
                    loading="lazy"
                    onLoad={() => handleImageLoad(image)}
                  />
                  <div
                    className="image-overlay"
                    onClick={() => handleImageClick(image)}
                  >
                    <Suspense fallback={<div>Loading buttons...</div>}>
                      <LoveBtn
                        style={{ width: "40px", height: "40px" }}
                        imgId={image.iid}
                      />
                      <AddCartBtn
                        style={{ width: "40px", height: "40px" }}
                        imgId={image.iid}
                      />
                      <DownloadBtn
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: "40px", height: "40px" }}
                        imgId={image.iid}
                        imageUrl={image.highQualityLink}
                        fileName={`image-${image.id}.png`}
                      />
                    </Suspense>
                  </div>
                </div>
              ))}
            </Masonry>
          </Suspense>
        </>
      )}

      {isPopupOpen && selectedImage && (
        <Suspense fallback={<div>Loading popup...</div>}>
          <PopupImg
            imageSrc={selectedImage.highQualityLink}
            midQualitySrc={selectedImage.midQualityLink}
            onClose={handleClosePopup}
            index={selectedImage.id}
            imgId={selectedImage.iid}
            name={selectedImage.name}
            showPopup={isPopupOpen}
          />
        </Suspense>
        
      )}
      {hasMoreImages && (
            <div className="loadmore-container" ref={loadMoreRef}>
            <div className="loadmore-indicator">
              <div className="bubble"></div>
              <div className="bubble"></div>
              <div className="bubble"></div>
            </div>
          </div>
          )}
    </div>
  );
}

export default Favorite;
