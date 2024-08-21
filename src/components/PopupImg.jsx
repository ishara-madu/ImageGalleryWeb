import React, { useEffect, useState, useCallback } from "react";
import LoveBtn from "./LoveBtn";
import AddCartBtn from "./AddCartBtn";
import DownloadBtn from "./DownloadBtn";
import AddWatermark from "./AddWatermark"; // Ensure to import your watermark component or utility
import CloseIcon from "../images/svg/CloseIcon";
import ShareIcon from "../images/svg/ShareIcon";
import InfoIcon from "../images/svg/InfoIcon";
import ReportIcon from "../images/svg/ReportIconIcon";
import ShareBtn from "./ShareBtn";
import InfoPopup from "./Info";

function PopupImg({
  imageSrc,
  midQualitySrc,
  onClose,
  index,
  imgId,
  name,
  showPopup,
}) {
  const [watermarkedImage, setWatermarkedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("center center");

  useEffect(() => {
    if (showPopup) {
      const generateWatermarkedImage = async () => {
        setLoading(true);
        const watermarked = await AddWatermark(midQualitySrc, "PIXEL EYE");
        setWatermarkedImage(watermarked);
        setLoading(false);
      };

      generateWatermarkedImage();
    }
  }, [midQualitySrc, showPopup]);

  const handleDownloadMouseEnter = useCallback((e) => {
    e.target.style.background = "var(--green-hover)";
  }, []);

  const handleDownloadMouseLeave = useCallback((e) => {
    e.target.style.background = "var(--green)";
  }, []);

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // X coordinate within the image
    const y = e.clientY - rect.top; // Y coordinate within the image

    setTransformOrigin(`${x}px ${y}px`);
    setIsZoomed(!isZoomed); // Toggle zoom state
  };

  if (!showPopup) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>
          <CloseIcon />
        </button>
        <div className="popup-header">
          <div className="popup-user-info">
            <div className="popup-user-avatar"></div>
            <div>
              <div className="popup-user-name">Ishara Madushanka</div>
              <div className="popup-user-status">Available For Hire</div>
            </div>
          </div>
          <div className="popup-btn">
            <LoveBtn
              style={{ opacity: 1, width: "40px", height: "40px" }}
              imgId={imgId}
            />
            <AddCartBtn
              style={{ opacity: 1, width: "40px", height: "40px" }}
              imgId={imgId}
            />
            <DownloadBtn
              value="Download &nbsp;"
              style={{
                opacity: 1,
                width: "170px",
                height: "40px",
                background: "var(--green)",
              }}
              imageUrl={imageSrc} // Pass the original URL for downloading
              imgId={imgId}
              fileName={`image-${index}.png`}
              onMouseEnter={handleDownloadMouseEnter}
              onMouseLeave={handleDownloadMouseLeave}
            />
          </div>
        </div>
        <div className="popup-image">
          {loading ? (
            <div className="loading-spinner">Loading...</div> // You can replace this with a spinner component or animation
          ) : (
            <img
              src={watermarkedImage}
              alt="Popup"
              loading="lazy"
              onClick={handleImageClick} // Handle click to zoom
              style={{
                cursor: isZoomed ? "zoom-out" : "zoom-in",
                transform: isZoomed ? "scale(1.5)" : "scale(1)", // Adjusted zoom factor to 1.5
                transition: "transform 0.4s ease", // Smooth transition
                transformOrigin: transformOrigin, // Set the transform origin based on click position
              }}
            />
          )}
        </div>
        <div className="popup-description">{name}</div>
        <div className="popup-actions">
          <ShareBtn />
          <InfoPopup/>
          <button className="popup-action-button">
            <ReportIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopupImg;
