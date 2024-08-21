import React, { useState } from "react";
import "../App.css";
import InfoIcon from "../images/svg/InfoIcon";

function InfoPopup({ className = '', info }) {
    const [isPopupVisible, setPopupVisible] = useState(false);

    const togglePopup = () => {
        setPopupVisible(!isPopupVisible);
    };

    return (
        <div className="info-popup-container">
            <button
                className={`popup-action-button ${className}`}
                onClick={togglePopup}
            >
                <InfoIcon />
                &nbsp;Info
            </button>

            {isPopupVisible && (
                <>
                    <div className="centered-modal-overlay" onClick={togglePopup}></div>
                    <div className="centered-modal-content">
                        <div className="modal-header">
                            <h1>Information</h1>
                            <button className="close-button" onClick={togglePopup}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>{info}</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default InfoPopup;
