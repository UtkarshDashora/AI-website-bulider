import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "genwabai.firebaseapp.com",
  projectId: "genwabai",
  storageBucket: "genwabai.firebasestorage.app",
  messagingSenderId: "650616982902",
  appId: "1:650616982902:web:520f8f31902e4e24847e57"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };