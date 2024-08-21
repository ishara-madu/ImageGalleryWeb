import React, { useState, useEffect } from 'react';
import AddCart from "../images/svg/AddCartIcon.jsx";
import CartCheckedIcon from '../images/svg/CartCheckedIcon.jsx';
import LoadingIcon from '../images/svg/LoadingIcon.jsx'; // Your loading icon
import { firestore } from "./firebase";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import "../App.css"
import getDecryptedUidFromCookie from './DecryptUid.jsx';
import SignUp from '../interfaces/SignUp.jsx';

function AddCartBtn({ imgId, ...props }) {
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const user = getDecryptedUidFromCookie();
  const docRef = doc(firestore, 'cartItem', `user-${user}`);

  useEffect(() => {
    const checkIfChecked = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsChecked(data.iid.includes(imgId));
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };
    checkIfChecked();
  }, [imgId, docRef]);

  const CheckedCount = async () => {
    setIsLoading(true); // Start loading (and rotation)
    try {
      if (!isChecked) {
        await setDoc(docRef, {
          uid: user,
          iid: arrayUnion(imgId),
        }, { merge: true });
        setIsChecked(true);
      }
    } catch (error) {
      console.error("Error Adding document: ", error);
    } finally {
      setIsLoading(false); // Stop loading (and rotation)
    }
  };
  const handleClose = () => {
    setShowSignUp(false);
};
  const handleClick = (e) => {
    e.stopPropagation(); // This prevents the click event from bubbling up
  const decryptedUid = getDecryptedUidFromCookie();
  if (decryptedUid) {
    CheckedCount();
  } else {
    setShowSignUp(true);
  }
  };

  const buttonClass = isChecked ? 'checked' : 'not-checked';

  return (
    <>
    <button className={`image-button ${buttonClass}`} onClick={handleClick} {...props}>
      {isLoading ? <LoadingIcon className="rotate" /> : (isChecked ? <CartCheckedIcon /> : <AddCart height="1.2em" width="1.2em"/>)}
    </button>
    {showSignUp && <SignUp onClose={handleClose} />}
    </>
  );
}

export default AddCartBtn;
