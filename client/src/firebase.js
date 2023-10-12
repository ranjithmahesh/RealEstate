// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import.meta.env.VITE_FIREBASE_API_KEY;
const firebaseConfig = {
  apiKey: "AIzaSyA2Hil4JUOXY4cJPo6SKPQdnmj4z4SLh74",
  authDomain: "realstate-project-ee222.firebaseapp.com",
  projectId: "realstate-project-ee222",
  storageBucket: "realstate-project-ee222.appspot.com",
  messagingSenderId: "1044307004225",
  appId: "1:1044307004225:web:8c4458b51828e22562afc0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
