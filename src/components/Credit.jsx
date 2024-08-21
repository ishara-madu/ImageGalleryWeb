import { firestore } from "./firebase"; // Ensure firebase is correctly configured
import { collection, query, where, onSnapshot, doc,getDocs, updateDoc } from "firebase/firestore";

export const Credit = (uid, callback) => {
    try {
      const usersCollection = collection(firestore, 'users');
      const q = query(usersCollection, where("uid", "==", uid));
      
      // Listen to real-time updates with onSnapshot
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          callback(userData.credits || 0);
        } else {
          console.log("No document with the specified UID found!");
          callback(0); // If no document is found, return 0
        }
      });
  
      // Return the unsubscribe function to stop listening when needed
      return unsubscribe;
    } catch (error) { 
      console.error("Error fetching user credit balance: ", error);
      callback(0); // Return 0 in case of an error
    }
  };
  
  
  export const UpdateCredit = async (uid, callback) => {
    try {
      const usersCollection = collection(firestore, 'users');
      const q = query(usersCollection, where("uid", "==", uid));
      
      // Fetch the document once
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        
        callback(userData.credits || 0, async (newCredits) => {
          const userRef = doc(firestore, 'users', userDoc.id);
          try {
            await updateDoc(userRef, { credits: newCredits });
            console.log("Credit balance updated successfully.");
          } catch (error) {
            console.error("Error updating credit balance: ", error);
          }
        });
      } else {
        console.log("No document with the specified UID found!");
        callback(0, () => {}); // If no document is found, return 0 and provide a dummy update function
      }
    } catch (error) {
      console.error("Error fetching user credit balance: ", error);
      callback(0, () => {}); // Return 0 and provide a dummy update function in case of an error
    }
  };


  export const Price = (iid, callback) => {
    try {
      const usersCollection = collection(firestore, 'images');
      const q = query(usersCollection, where("iid", "==", iid));
      
      // Listen to real-time updates with onSnapshot
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          callback(userData.price || 0);
        } else {
          console.log("No document with the specified UID found!");
          callback(0); // If no document is found, return 0
        }
      });
  
      // Return the unsubscribe function to stop listening when needed
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching user credit balance: ", error);
      callback(0); // Return 0 in case of an error
    }
  };