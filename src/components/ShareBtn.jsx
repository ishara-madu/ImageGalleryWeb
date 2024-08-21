import React, { useState } from "react";
import ShareIcon from "../images/svg/ShareIcon";
import { FaPinterest, FaTwitter, FaLinkedin, FaFacebook, FaTumblr } from 'react-icons/fa';
import "../App.css";

function ShareBtn({ className = '' }) {
    const [isPopupVisible, setPopupVisible] = useState(false);

    const togglePopup = () => {
        setPopupVisible(!isPopupVisible);
    };

    const shareOnSocialMedia = (platform) => {
        const url = window.location.href;
        let shareUrl;

        switch (platform) {
            case 'pinterest':
                shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'tumblr':
                shareUrl = `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodeURIComponent(url)}`;
                break;
            default:
                return;
        }

        window.open(shareUrl, '_blank', 'noopener,noreferrer');
    };

    const copyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert("URL copied to clipboard!");
        });
    };

    return (
        <div className="share-btn-container">
            <button
                className={`popup-action-button ${className}`}
                onClick={togglePopup}
            >
                <ShareIcon />
                &nbsp;Share
            </button>

            {isPopupVisible && (
                <>
                    <div className="centered-modal-overlay" onClick={togglePopup}></div>
                    <div className="centered-modal-content">
                        <div className="modal-header">
                            <h1>Share this with your Community</h1>
                            <button className="close-button" onClick={togglePopup}>×</button>
                        </div>
                        <div className="social-icons">
                            <button onClick={() => shareOnSocialMedia('pinterest')}>
                                <FaPinterest className="social-icon pinterest" />
                            </button>
                            <button onClick={() => shareOnSocialMedia('twitter')}>
                                <FaTwitter className="social-icon twitter" />
                            </button>
                            <button onClick={() => shareOnSocialMedia('linkedin')}>
                                <FaLinkedin className="social-icon linkedin" />
                            </button>
                            <button onClick={() => shareOnSocialMedia('facebook')}>
                                <FaFacebook className="social-icon facebook" />
                            </button>
                            <button onClick={() => shareOnSocialMedia('tumblr')}>
                                <FaTumblr className="social-icon tumblr" />
                            </button>
                        </div>
                        <div className="copy-link-section">
                            <p>Set a link back to this photo</p>
                            <div className="copy-link-input">
                                <input type="text" value="Photo by Lap Dinh Quoc from Pixel Eye" readOnly />
                                <button onClick={copyLink}>Copy</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default ShareBtn;
