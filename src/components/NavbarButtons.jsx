import React, { useState, useEffect } from "react";
import DownArrow from "../images/svg/DownArrowIcon";
import IconHeart from "../images/svg/IconHeartIcon";
import Cart from "../images/svg/CartIcon";
import { Credit } from "./Credit";
import getDecryptedUidFromCookie from "./DecryptUid";
import SignUp from "../interfaces/SignUp"; // Import SignUp component
import Login from "../interfaces/Login"; // Import Login component

function NavbarButtons({ onLoveClick, onCartClick }) {
  const [creditBalance, setCreditBalance] = useState(0);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showBTN, setShowBTN] = useState(true);
  const user = getDecryptedUidFromCookie();

  useEffect(() => {
    const balance = Credit(user, setCreditBalance);
    return () => balance();
  }, [user]);

  useEffect(() => {
    if (user) {
      setShowBTN(false);
    } else {
      setShowBTN(true);
    }
  }, [user]);
  const handleSignUpClick = () => {
    setShowSignUp(true);
    setShowLogin(false);
  };

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignUp(false);
  };

  const handleClose = () => {
    setShowSignUp(false);
    setShowLogin(false);
  };

  return (
    <>
      {showBTN && (
        <div className="buttons">
          <button className="login" onClick={handleLoginClick}>
            Login
          </button>
          <button className="signup" onClick={handleSignUpClick}>
            Sign Up
          </button>
        </div>
      )}
      {!showBTN && (
        <>
          <p className="credits">
            Credits: {creditBalance}
            <DownArrow />
          </p>

          <div className="line2"></div>
          <IconHeart height="2em" width="2em" onClick={onLoveClick} />
          <Cart onClick={onCartClick} />
        </>
      )}

      {/* <p className="credits">Credits: {creditBalance}
                    <DownArrow/>
                </p>
                
                <div className="line2"></div>
                <IconHeart height="2em" width="2em" onClick={onLoveClick}/>
                <Cart onClick={onCartClick}/> */}
      {/* Render SignUp component if showSignUp is true */}
      {showSignUp && <SignUp onClose={handleClose} />}

      {/* Render Login component if showLogin is true */}
      {showLogin && <Login onClose={handleClose} />}
    </>
  );
}

export default NavbarButtons;
