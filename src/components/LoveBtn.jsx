import React, { useState, useEffect } from "react";
import { firestore } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import IconHeart from "../images/svg/IconHeartIcon";
import IconHeartFilled from "../images/svg/IconHeartFilledIcon";
import getDecryptedUidFromCookie from "./DecryptUid";
import SignUp from "../interfaces/SignUp";

function LoveBtn({ imgId, ...props }) {
  const [isLiked, setIsLiked] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const user = getDecryptedUidFromCookie();
  const docRef = doc(firestore, "loveItem", `user-${user}`);

  // Check if the image ID is already in the list
  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsLiked(data.iid.includes(imgId));
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    checkIfLiked();
  }, [imgId, docRef]);

  const btnCount = async () => {
    try {
      if (isLiked) {
        // If the image ID is already in the array, remove it
        await updateDoc(docRef, {
          iid: arrayRemove(imgId),
        });
        setIsLiked(false);
      } else {
        // If the image ID is not in the array, add it
        await setDoc(
          docRef,
          {
            uid: user,
            iid: arrayUnion(imgId),
          },
          { merge: true }
        );
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };
  const handleClose = () => {
    setShowSignUp(false);
};
const handleClick = (e) => {
  e.stopPropagation(); // This prevents the click event from bubbling up
  const decryptedUid = getDecryptedUidFromCookie();
  if (decryptedUid) {
    btnCount();
  } else {
    setShowSignUp(true);
  }
};

  const buttonClass = isLiked ? "liked" : "not-liked";

  return (
    <>
    <button
      className={`image-button ${buttonClass}`}
      onClick={handleClick}
      {...props}
    >
      {isLiked ? (
        <IconHeartFilled />
      ) : (
        <IconHeart height="1.2em" width="1.2em" />
      )}
    </button>
    {showSignUp && <SignUp onClose={handleClose} />}
    </>
  );
}

export default LoveBtn;
