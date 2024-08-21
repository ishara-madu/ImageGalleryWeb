import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../components/firebase";
import { FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import "./SignUp.css";
import { encryptData } from "../components/EncryptionDecryption";

// Initialize providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();

// Define default credit balance
const DEFAULT_CREDIT = 100;

function SignUp({ onClose }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Generate random password
  const generateRandomPassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email } = formData;
    const password = generateRandomPassword();
    const encryptedPassword = encryptData(password); // Encrypt the generated password
    const encryptedEmail = encryptData(email); // Encrypt the email

    try {
        // Create user with generated password
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const uid = userCredential.user.uid;

        await setDoc(doc(firestore, "users", uid), {
            email,
            username: formData.username,
            uid,
            credits: DEFAULT_CREDIT,
        });

        const encryptedUid = encryptData(uid);

        // Send passwordless sign-in link with encrypted email and password included in the URL
        const actionCodeSettings = {
            url: `http://localhost:3000/handle-signin?data=${encodeURIComponent(
                encryptedUid.encryptedData
            )}&iv=${encodeURIComponent(encryptedUid.iv)}&password=${encodeURIComponent(
                encryptedPassword.encryptedData
            )}&passwordIv=${encodeURIComponent(encryptedPassword.iv)}&email=${encodeURIComponent(
                encryptedEmail.encryptedData
            )}&emailIv=${encodeURIComponent(encryptedEmail.iv)}`,
            handleCodeInApp: true,
        };
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem("emailForSignIn", email);
        alert(
            `Sign-up successful! A password has been generated and sent to your email. Please check your email to complete the process.`
        );
    } catch (error) {
        console.error("Sign-up error: ", error);
        setError("Sign-up error: " + error.message);
    }
};

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const uid = user.uid;

      await setDoc(doc(firestore, "users", uid), {
        email: user.email,
        username: user.displayName,
        uid,
        credits: DEFAULT_CREDIT,
      });

      alert("Google Sign-In successful!");

      const encrypted = encryptData(uid);

      // Redirect to the main screen
      navigate(
        `/handle-signin?data=${encodeURIComponent(
          encrypted.encryptedData
        )}&iv=${encodeURIComponent(encrypted.iv)}`
      );
    } catch (error) {
      console.error("Google Sign-In error: ", error);
      setError("An error occurred during Google Sign-In. Please try again.");
    }
  };

  // Handle Facebook Sign-In
  const handleFacebookSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      const uid = user.uid;

      await setDoc(doc(firestore, "users", uid), {
        email: user.email,
        username: user.displayName,
        uid,
        credits: DEFAULT_CREDIT,
      });

      alert("Facebook Sign-In successful!");

      const encrypted = encryptData(uid);

      // Redirect to the main screen
      navigate(
        `/handle-signin?data=${encodeURIComponent(
          encrypted.encryptedData
        )}&iv=${encodeURIComponent(encrypted.iv)}`
      );
    } catch (error) {
      console.error("Facebook Sign-In error: ", error);
      setError("An error occurred during Facebook Sign-In. Please try again.");
    }
  };

  // Handle Twitter Sign-In
  const handleTwitterSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, twitterProvider);
      const user = result.user;
      const uid = user.uid;

      await setDoc(doc(firestore, "users", uid), {
        email: user.email,
        username: user.displayName,
        uid,
        credits: DEFAULT_CREDIT,
      });

      alert("Twitter Sign-In successful!");

      const encrypted = encryptData(uid);

      // Redirect to the main screen
      navigate(
        `/handle-signin?data=${encodeURIComponent(
          encrypted.encryptedData
        )}&iv=${encodeURIComponent(encrypted.iv)}`
      );
    } catch (error) {
      console.error("Twitter Sign-In error: ", error);
      setError("An error occurred during Twitter Sign-In. Please try again.");
    }
  };

  return (
    <div
      className="signup-wrapper"
      onClick={(e) => {
        e.stopPropagation();
        if (onClose) {
          onClose();
        }
      }}
    >
      <div className="hero" onClick={(e) => e.stopPropagation()}>
        <div className="label-header">
          <div className="label-header-head">
            <h1>Join with us</h1>
          </div>
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-container">
            <div className="error-message-div">
              {error && <p className="error-message">{error}</p>}
            </div>
            <div className="section">
              <input
                type="text"
                name="username"
                id="sign_username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="section">
              <input
                type="email"
                name="email"
                id="sign_email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="section">
              <input type="submit" name="submit" id="submit" value="Sign Up" />
            </div>
            <div className="social-section">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="google-signin-button"
              >
                <FaGoogle />
              </button>
              <button
                type="button"
                onClick={handleFacebookSignIn}
                className="facebook-signin-button"
              >
                <FaFacebook />
              </button>
              <button
                type="button"
                onClick={handleTwitterSignIn}
                className="twitter-signin-button"
              >
                <FaTwitter />
              </button>
            </div>

            <div className="section">
              <p className="login-footer">
                Already have an account?{" "}
                <b>
                  <a href="/login">Login Here</a>
                </b>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
