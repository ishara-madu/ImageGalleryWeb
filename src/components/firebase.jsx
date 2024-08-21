import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBi7GRm_jTlNqSheSNHKIfZ34N8dkX1ODE",
  authDomain: "pixeleye-673c0.firebaseapp.com",
  databaseURL: "https://pixeleye-673c0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pixeleye-673c0",
  storageBucket: "pixeleye-673c0.appspot.com",
  messagingSenderId: "708506163952",
  appId: "1:708506163952:web:9ea00cfafe8a9f136ec035",
  measurementId: "G-F4BHEK45WK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };
