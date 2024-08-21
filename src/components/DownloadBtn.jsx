import React, { useState } from 'react';
import Download from '../images/svg/DownloadIcon';
import "../App.css";
import DownloadPopup from './DownloadPopup';
import getDecryptedUidFromCookie from './DecryptUid';
import SignUp from '../interfaces/SignUp';

function DownloadBtn({ imageUrl, imgId, fileName, ...props }) {
  const [showPopup, setShowPopup] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const handleDownload = (e) => {
    e.stopPropagation(); // Ensure the event is stopped from propagating to parent elements

    fetch(imageUrl, { mode: 'cors' })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || 'image.png'; // Use provided filename or default to 'image.png'
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); // Free memory
      })
      .catch(err => console.error('Error downloading image:', err));
  };

  const handleClose = () => {
    setShowSignUp(false);
};
const handleClick = (e) => {
  e.stopPropagation(); // This prevents the click event from bubbling up
  const decryptedUid = getDecryptedUidFromCookie();
  if (decryptedUid) {
    setShowPopup(true);
  } else {
    setShowSignUp(true);
  }
};
  return (
    <div>
      <button 
        className="image-button" 
        {...props} 
        onClick={
          handleClick
        }
      >
        {props.value}
        <Download />
      </button>

      {showPopup && (
        <DownloadPopup 
          popupState={showPopup} 
          setPopupState={setShowPopup} 
          imgId={imgId} 
          handleDownload={handleDownload}
        />
      )}
      {showSignUp && <SignUp onClose={handleClose} />}

    </div>
  );
}

export default DownloadBtn;
