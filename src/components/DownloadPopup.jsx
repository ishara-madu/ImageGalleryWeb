import React, { useState, useEffect } from 'react';
import { Price, Credit, UpdateCredit } from './Credit';
import "../App.css";
import getDecryptedUidFromCookie from './DecryptUid';
function DownloadPopup({ setPopupState, handleDownload, imgId, totPrice }) {
  const [priceBalance, setPriceBalance] = useState(0);
  const [creditBalance, setCreditBalance] = useState(0);

  const user = getDecryptedUidFromCookie();

  const handleAccept = (e) => {
    e.stopPropagation(); // Prevent event propagation
    UpdateCredit(user, (currentCredits, updateCredits) => {
      const newCredits = currentCredits - priceBalance;
      updateCredits(newCredits);
      setCreditBalance(newCredits);
    });
    handleDownload(e);
    setPopupState(false); // Close the popup after download
  };

  const handleCancel = (e) => {
    e.stopPropagation(); // Prevent event propagation
    setPopupState(false); // Close the popup without downloading
  };

  useEffect(() => {
    Credit(user, setCreditBalance);
  }, [user]);

  useEffect(() => {
    if (imgId === undefined) {
      setPriceBalance(totPrice);
    } else {
      Price(imgId, setPriceBalance);
    }
  }, [imgId, totPrice]);

  return (
    <div className="download-popup">
      <div className="download-popup-content">
        <h3>Order Summary</h3>
        <div className="popup-details">
          <p><strong>Available Balance:</strong> {creditBalance} credits</p>
          <p><strong>Image Price:</strong> {priceBalance} credits</p>
          <p><strong>Final Balance:</strong> {creditBalance - priceBalance} credits</p>
        </div>
        <div className="price-popup-actions">
          <button className="popup-button accept" onClick={handleAccept}>
            Proceed with Download
          </button>
          <button className="popup-button cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DownloadPopup;
