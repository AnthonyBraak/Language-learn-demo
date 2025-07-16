import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4rSlUWjwTIRg3euZOAhLRDFxajx1aqW4",
  authDomain: "language-learn-demo.firebaseapp.com",
  projectId: "language-learn-demo",
  storageBucket: "language-learn-demo.firebasestorage.app",
  messagingSenderId: "591135432065",
  appId: "1:591135432065:web:ad166ed2e31d0a41c3dc80"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);