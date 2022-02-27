import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
const storage = getStorage();

const gamesCollection = collection(firestore, "games");
const usersCollection = collection(firestore, "users");
const boardSkinsCollection = collection(firestore, "boardSkins");
const dailyCollection = collection(firestore, "daily");
const waitRoomCollection = collection(firestore, "waitRoom");
const roomsCollection = collection(firestore, "rooms");

export {
  firestore,
  storage,
  usersCollection,
  gamesCollection,
  boardSkinsCollection,
  dailyCollection,
  waitRoomCollection,
  roomsCollection,
};
