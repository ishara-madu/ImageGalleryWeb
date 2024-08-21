import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import NavbarButtons from './components/NavbarButtons';
import Orientation from './components/Orientation';
import Relavance from './components/Relavance';
import Date from './components/Date';
import Container from './components/Container';
import Favorite from './components/Favorite';
import Cart from './components/Cart';
import { collection, query, orderBy, limit, startAfter, onSnapshot, getDocs, doc, where } from 'firebase/firestore';
import { firestore } from './components/firebase';
import useOnlineStatus from './components/useOnlineStatus';
import getDecryptedUidFromCookie from './components/DecryptUid';


const MAX_CACHE_SIZE = 100;

function App() {

  const user = getDecryptedUidFromCookie();


  const [activeComponent, setActiveComponent] = useState('home');
  const [images, setImages] = useState([]);
  const [lovedItems, setLovedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreImages, setHasMoreImages] = useState(true);
  const [error, setError] = useState(null);

  const imageCache = useRef(new Map());
  const isOnline = useOnlineStatus();



  const addToCache = (key, value) => {
    if (imageCache.current.size >= MAX_CACHE_SIZE) {
      const oldestKey = imageCache.current.keys().next().value;
      imageCache.current.delete(oldestKey);
    }
    imageCache.current.set(key, value);
  };

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const imagesQuery = query(
        collection(firestore, 'images'),
        orderBy('uploadTime', 'desc'),
        limit(1)
      );

      const querySnapshot = await getDocs(imagesQuery);
      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);

      const fetchedImages = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const highQualityLink = data.link;

        if (imageCache.current.has(highQualityLink)) {
          return imageCache.current.get(highQualityLink);
        }

        const imageData = {
          id: doc.id,
          highQualityLink: data.link,
          ultralowQualityLink: data.ultralowLink,
          lowQualityLink: data.lowLink,
          midQualityLink: data.midLink,
          uploadTime: data.uploadTime,
          name: data.name,
          iid: data.iid,
        };

        addToCache(highQualityLink, imageData);
        return imageData;
      });

      setImages((prevImages) => [
        ...prevImages,
        ...fetchedImages.filter(
          (newImage) => !prevImages.some((img) => img.id === newImage.id)
        ),
      ]);

      if (querySnapshot.docs.length < 1) {
        setHasMoreImages(false);
      }
    } catch (e) {
      console.error('Error retrieving documents: ', e);
      setError('Failed to load images. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLovedItems = useCallback(() => {
    const loveDocRef = doc(firestore, 'loveItem', `user-${user}`);
    const unsubscribe = onSnapshot(loveDocRef, async (loveDocSnap) => {
      if (loveDocSnap.exists()) {
        const itemIds = loveDocSnap.data().iid || [];
  
        if (itemIds.length > 0) {
          const imagesCollection = collection(firestore, 'images');
          const q = query(imagesCollection, where('iid', 'in', itemIds));
          const querySnapshot = await getDocs(q);
  
          const lovedItemsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          setLovedItems(lovedItemsData);
        } else {
          setLovedItems([]);
        }
      } else {
        setLovedItems([]);
      }
    });
  
    return unsubscribe; // Return the unsubscribe function
  }, [user]);
  

  useEffect(() => {
    fetchImages(); // Just call fetchImages without expecting an unsubscribe function
  }, [fetchImages]);
  

  useEffect(() => {
    if (isOnline) {
      fetchImages(); // Reload images when back online
    }
  }, [isOnline, fetchImages]);

  const loadMoreImages = useCallback(async () => {
    if (!lastVisible) return;

    setLoadingMore(true);
    try {
      const imagesQuery = query(
        collection(firestore, 'images'),
        orderBy('uploadTime', 'desc'),
        startAfter(lastVisible),
        limit(1)
      );
      const querySnapshot = await getDocs(imagesQuery);
      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);

      const fetchedImages = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const highQualityLink = data.link;

          if (imageCache.current.has(highQualityLink)) {
            return imageCache.current.get(highQualityLink);
          }

          const imageData = {
            id: doc.id,
            highQualityLink: data.link,
            ultralowQualityLink: data.ultralowLink,
            lowQualityLink: data.lowLink,
            midQualityLink: data.midLink,
            uploadTime: data.uploadTime,
            name: data.name,
            iid: data.iid,
          };

          addToCache(highQualityLink, imageData);
          return imageData;
        })
      );

      setImages((prevImages) => [
        ...prevImages,
        ...fetchedImages.filter(
          (newImage) => !prevImages.some((img) => img.id === newImage.id)
        ),
      ]);

      if (querySnapshot.docs.length < 1) {
        setHasMoreImages(false);
      }
    } catch (e) {
      console.error('Error retrieving more documents: ', e);
      setError('Failed to load more images. Please try again later.');
    } finally {
      setLoadingMore(false);
    }
  }, [lastVisible]);

  useEffect(() => {
    const unsubscribe = fetchLovedItems();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [fetchLovedItems]);
  

  const showCart = () => setActiveComponent('cart');
  const showFavorite = () => setActiveComponent('favorite');
  const showHome = () => setActiveComponent('home');

  return (
    <div className="wrapper">
      <Navbar onLogoClick={showHome} onLoveClick={showFavorite} onCartClick={showCart}/>
      {activeComponent === 'home' && (
        <div className="filter">
          <Orientation />
          <Relavance />
          <Date />
        </div>
      )}
      <div className="container">
        {activeComponent === 'home' && (
          <Container
            images={images}
            hasMoreImages={hasMoreImages}
            loading={loading}
            error={error}
            loadMoreImages={loadMoreImages}
          />
        )}
        {activeComponent === 'cart' && <Cart />}
        {activeComponent === 'favorite' && (
          <Favorite
            images={images}
            lovedItems={lovedItems}
            loading={loading}
            error={error}
            hasMoreImages={hasMoreImages}
            loadMoreImages={loadMoreImages}
          />
        )}
      </div>
    </div>
  );
}

export default App;
