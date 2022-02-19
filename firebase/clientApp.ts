import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";

initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
});

const firestore = getFirestore();

const gamesCollection = collection(firestore, "games");
const usersCollection = collection(firestore, "users");

export { firestore, usersCollection, gamesCollection };
