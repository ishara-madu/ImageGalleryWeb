import React, { useState, useEffect } from "react";
import { firestore } from "./firebase";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import "../App.css";
import DownloadPopup from "./DownloadPopup";
import getDecryptedUidFromCookie from "./DecryptUid";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getDecryptedUidFromCookie();
  const docRef = doc(firestore, "cartItem", `user-${user}`);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const itemIds = data.iid || [];

          setCartItems((prevItems) => {
            if (prevItems.length > 0) return prevItems;

            return itemIds.map((id) => {
              const existingItem = prevItems.find((item) => item.id === id);
              return existingItem ? existingItem : { id, quantity: 1 };
            });
          });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching cart items: ", error);
      }
    };

    fetchCartItems();
  }, [docRef]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const itemsCollection = collection(firestore, "images");
        const itemsSnapshot = await getDocs(itemsCollection);
        const itemsList = itemsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(itemsList);
      } catch (error) {
        console.error("Error fetching items: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleRemoveFromCart = async (itemId) => {
    const updatedCartItems = cartItems.filter(
      (cartItem) => cartItem.id !== itemId
    );

    const updatedIid = updatedCartItems.map((item) => item.id);

    try {
      await updateDoc(docRef, {
        iid: updatedIid,
      });
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Error removing item: ", error);
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, cartItem) => {
      const item = items.find((i) => i.iid === cartItem.id);
      return total + (item ? item.price * cartItem.quantity : 0);
    }, 0);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    const imgIds = cartItems.map((item) => item.id);
    handleCheckout(imgIds);
  };

  const handleCheckout = async (imgIds) => {
    for (let i = 0; i < imgIds.length; i++) {
      const imgId = imgIds[i];
      const item = items.find((i) => i.iid === imgId);
  
      if (item && item.link) {
        try {
          // Fetch the image data
          const response = await fetch(item.link, { mode: 'cors' });
          const blob = await response.blob();
  
          // Create a URL for the blob
          const url = window.URL.createObjectURL(blob);
          const fileName = `image-${item.id}.png`; // Unique filename with imgId
          
          // Create a temporary link element
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName || 'image.png'; // Set the download attribute to the desired file name
  
          // Append to the body and trigger a click to download
          document.body.appendChild(link);
          link.click();
          
          // Clean up
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url); // Free memory
  
          // Delay between downloads
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
        } catch (err) {
          console.error(`Error downloading image with ID ${imgId}:`, err);
        }
      } else {
        console.error(`Item with ID ${imgId} not found or has no link`);
      }
    }
  };
  
  
  


  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength - 3) + "...";
    }
    return str;
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((cartItem) => {
            const item = items.find((i) => i.iid === cartItem.id);
            return item ? (
              <div key={cartItem.id} className="cart-item">
                <div className="cart-item-left">
                  <img
                    src={item.lowLink || item.ultralowLink || "https://via.placeholder.com/150"}
                    alt={item.iid}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3>{truncateString(item.name, 30)}</h3>
                    <p>Price: {item.price} Credits</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(cartItem.id)}
                  className="remove-cart-button"
                >
                  Remove from Cart
                </button>
              </div>
            ) : null;
          })}
        </div>
        
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <p>
            Total Items:{" "}
            {cartItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0)}
          </p>
          <h4>Total Price: {calculateTotalPrice()} Credits</h4>
          <button className="checkout-button" onClick={(e) => {
          e.stopPropagation(); // Prevent the event from propagating to parent elements
          setShowPopup(true); // Show the download confirmation popup
        }}>
            Download All Images In Cart
          </button>
          {showPopup && (
        <DownloadPopup 
        totPrice ={calculateTotalPrice()}
          popupState={showPopup} 
          setPopupState={setShowPopup} 
          handleDownload={handleDownload}
        />
      )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
