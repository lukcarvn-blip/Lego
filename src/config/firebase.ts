import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDKP49g_tAtl8o-I1EXaCDY0b4drSV0WPw",
  authDomain: "lukcar.firebaseapp.com",
  projectId: "lukcar",
  storageBucket: "lukcar.firebasestorage.app",
  messagingSenderId: "216839769386",
  appId: "1:216839769386:web:7b1552838e5d215451e253",
  measurementId: "G-X2NWJN7NFV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
