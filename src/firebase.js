import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC5l7Gq1ooB-HlJgveOrEklgpjhrKNikWo",
  authDomain: "cifra-nasa.firebaseapp.com",
  projectId: "cifra-nasa",
  storageBucket: "cifra-nasa.firebasestorage.app",
  messagingSenderId: "843530351902",
  appId: "1:843530351902:web:a54db61477a4b0c666050f",
  measurementId: "G-TKM9M2097K"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);