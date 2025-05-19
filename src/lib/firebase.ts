import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCCLSSqRZ0mBLkFrKsjt5kK6fenmSyv2Go",
  authDomain: "taluo-313cc.firebaseapp.com",
  projectId: "taluo-313cc",
  storageBucket: "taluo-313cc.firebasestorage.app",
  messagingSenderId: "52217005453",
  appId: "1:52217005453:web:683bdbccf5d5c7e2d5a9c4",
  measurementId: "G-GKSW58GDXK"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Utility function to check online status
export const isOnline = () => {
  return typeof navigator !== 'undefined' && navigator.onLine;
};

// Wrapper for Firebase operations that checks online status
export const withOnlineCheck = async <T>(operation: () => Promise<T>): Promise<T> => {
  if (!isOnline()) {
    throw new Error('您当前处于离线状态，请检查网络连接后重试。');
  }
  return operation();
};

// Function to clear all reading records
export const clearAllReadings = async () => {
  try {
    return await withOnlineCheck(async () => {
      const fortunesSnapshot = await getDocs(collection(db, 'fortunes'));
      const fortuneDeletes = fortunesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      
      const readingsSnapshot = await getDocs(collection(db, 'readings'));
      const readingDeletes = readingsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      
      await Promise.all([...fortuneDeletes, ...readingDeletes]);
      return true;
    });
  } catch (error) {
    console.error('Error clearing readings:', error);
    return false;
  }
};