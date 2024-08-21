import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { decryptData } from "../components/EncryptionDecryption";
import '../App.css'; // Import the CSS file
import { FaClipboard, FaClipboardCheck, FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

function HandleSignIn() {
  const navigate = useNavigate();
  const location = useLocation();

  const [decryptedEmail, setDecryptedEmail] = useState(null);
  const [decryptedPassword, setDecryptedPassword] = useState(null);
  const [popupWindow, setPopupWindow] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null); // State to track which field is copied
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const encryptedUid = decodeURIComponent(params.get("data") || "");
  const uidIv = decodeURIComponent(params.get("iv") || "");
  const encryptedPwd = decodeURIComponent(params.get("password") || "");
  const pwdIv = decodeURIComponent(params.get("passwordIv") || "");
  const encryptedEmail = decodeURIComponent(params.get("email") || "");
  const emailIv = decodeURIComponent(params.get("emailIv") || "");

  useEffect(() => {
    if (encryptedUid && uidIv && encryptedEmail && emailIv && encryptedPwd && pwdIv) {
      try {
        Cookies.set("encryptedUid", encryptedUid, { expires: 7 });
        Cookies.set("encryptionIv", uidIv, { expires: 7 });

        const decryptedEmailValue = decryptData(encryptedEmail, emailIv);
        const decryptedPasswordValue = decryptData(encryptedPwd, pwdIv);
        
        setDecryptedEmail(decryptedEmailValue);
        setDecryptedPassword(decryptedPasswordValue);
        setPopupWindow(true);
      } catch (e) {
        setError(`Error decrypting data: ${e.message}`);
      }
    } else if (encryptedUid && uidIv) {
      try {
        Cookies.set("encryptedUid", encryptedUid, { expires: 7 });
        Cookies.set("encryptionIv", uidIv, { expires: 7 });
        setPopupWindow(false);
        navigate("/");
      } catch (e) {
        setError(`Error storing data in cookies: ${e.message}`);
      }
    }
  }, [encryptedUid, uidIv, encryptedEmail, emailIv, encryptedPwd, pwdIv, navigate]);

  const handleClosePopup = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000); // Clear copied state after 2 seconds
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(prev => !prev);
  };

  return (
    <>
      {error && (
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => setError(null)}>Okay</button>
        </div>
      )}
      {popupWindow && (
        <div className="popup-window">
          <h1>Sign In Details</h1>
          <div className="important-message">
            <p><strong>Important:</strong> Save these details somewhere safe! They are necessary for your future access.</p>
          </div>
          <div className="input-group">
            <input
              type="text"
              value={decryptedEmail || ""}
              readOnly
              placeholder="Email"
            />
            {copied === decryptedEmail ? (
              <FaClipboardCheck
                className="copy-icon"
                title="Copied!"
              />
            ) : (
              <FaClipboard
                className="copy-icon"
                title="Copy"
                onClick={() => handleCopy(decryptedEmail)}
              />
            )}
          </div>
          <div className="input-group">
            <input
              type={passwordVisible ? "text" : "password"}
              value={decryptedPassword || ""}
              readOnly
              placeholder="Password"
            />
            {passwordVisible ? (
              <FaEye
                className="visibility-icon active"
                title="Hide password"
                onClick={togglePasswordVisibility}
              />
            ) : (
              <FaEyeSlash
                className="visibility-icon"
                title="Show password"
                onClick={togglePasswordVisibility}
              />
            )}
            {copied === decryptedPassword ? (
              <FaClipboardCheck
                className="copy-icon"
                title="Copied!"
              />
            ) : (
              <FaClipboard
                className="copy-icon"
                title="Copy"
                onClick={() => handleCopy(decryptedPassword)}
              />
            )}
          </div>
          <button onClick={handleClosePopup}>Go Home</button>
        </div>
      )}
    </>
  );
}

export default HandleSignIn;
