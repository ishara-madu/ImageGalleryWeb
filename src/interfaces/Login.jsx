import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../components/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider } from "firebase/auth";
import { FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa";
import "./SignUp.css";
import { encryptData } from "../components/EncryptionDecryption";

// Initialize providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();

function Login({onClose}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      navigate("/"); // Redirect to home or main page
    } catch (error) {
      console.error("Login error: ", error);
      if (error.code === 'auth/user-not-found') {
        setError("No account found with this email.");
      } else if (error.code === 'auth/wrong-password') {
        setError("Incorrect password. Please try again.");
      } else {
        setError("Login error: " + error.message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const uid = user.uid;

      const encrypted = encryptData(uid);
      navigate(`/handle-signin?data=${encodeURIComponent(encrypted.encryptedData)}&iv=${encodeURIComponent(encrypted.iv)}`);
    } catch (error) {
      console.error("Google Sign-In error: ", error);
      setError("An error occurred during Google Sign-In. Please try again.");
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      const uid = user.uid;

      const encrypted = encryptData(uid);
      navigate(`/handle-signin?data=${encodeURIComponent(encrypted.encryptedData)}&iv=${encodeURIComponent(encrypted.iv)}`);
    } catch (error) {
      console.error("Facebook Sign-In error: ", error);
      setError("An error occurred during Facebook Sign-In. Please try again.");
    }
  };

  const handleTwitterSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, twitterProvider);
      const user = result.user;
      const uid = user.uid;

      const encrypted = encryptData(uid);
      navigate(`/handle-signin?data=${encodeURIComponent(encrypted.encryptedData)}&iv=${encodeURIComponent(encrypted.iv)}`);
    } catch (error) {
      console.error("Twitter Sign-In error: ", error);
      setError("An error occurred during Twitter Sign-In. Please try again.");
    }
  };

  return (
    <div className="signup-wrapper" onClick={ onClose }>
      <div className="hero" onClick={e => e.stopPropagation()}>
        <div className="label-header">
          <div className="label-header-head">
            <h1>Login to Your Account</h1>
          </div>
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-container">
            <div className="error-message-div">
              {error && <p className="error-message">{error}</p>}
            </div>
            <div className="section">
              <input
                type="email"
                name="email"
                id="login_email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="section">
              <input
                type="password"
                name="password"
                id="login_pass"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="section">
              <input type="submit" name="submit" id="submit" value="Login" />
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
            <div class="section">
                    <p><b><a href="#">Forget password?</a></b></p>
                </div>
            <div className="section">
              <p className="login-footer">
                Don't have an account?{" "}
                <b>
                  <a href="/signup">Sign Up Here</a>
                </b>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
