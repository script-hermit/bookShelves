// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDppKASl4pFiYbWK7xI8jsMpTL5N3nIDlQ",
  authDomain: "bookshelves-44ee5.firebaseapp.com",
  projectId: "bookshelves-44ee5",
  storageBucket: "bookshelves-44ee5.appspot.com",
  messagingSenderId: "787962843243",
  appId: "1:787962843243:web:417265ad72575084ad212e",
  measurementId: "G-DYRSG44BG2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;