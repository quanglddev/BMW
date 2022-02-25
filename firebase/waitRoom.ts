import { v4 as uuidv4 } from "uuid";
import { firestore, waitRoomCollection } from "./clientApp";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDocs,
  query,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { puzzleWords } from "../utils/puzzleWords";
import { IRoom } from "../interfaces/IRoom";
import IUser from "../interfaces/IUser";

export const queryWaitRoom = async (): Promise<string[]> => {
  const waitRoomQuery = query(waitRoomCollection);

  const querySnapshot = await getDocs(waitRoomQuery);
  if (querySnapshot.docs.length === 0) {
    return [];
  }

  const data = querySnapshot.docs[0].data();
  const ids = data.ids as string[];

  return ids;
};

export const joinWaitRoom = async (userId: string): Promise<void> => {
  const foundDocRef = doc(firestore, "waitRoom", "1234567890");
  await updateDoc(foundDocRef, {
    ids: arrayUnion(userId),
  });
};

export const exitWaitRoom = async (userId: string): Promise<void> => {
  const foundDocRef = doc(firestore, "waitRoom", "1234567890");
  await updateDoc(foundDocRef, {
    ids: arrayRemove(userId),
  });
};

export const createJointRoom = async (
  userId: string,
  ids: string[]
): Promise<string> => {
  const myselfIdx = ids.findIndex((id) => id === userId);

  if (!myselfIdx) {
    return "";
  }

  const availables = [...ids];
  availables.splice(myselfIdx, 1);

  const chosenOpponentId =
    availables[Math.floor(Math.random() * availables.length)];

  // Remove opponent immediately
  const foundDocRef = doc(firestore, "waitRoom", "1234567890");
  await updateDoc(foundDocRef, {
    ids: arrayRemove(chosenOpponentId),
  });
  await updateDoc(foundDocRef, {
    ids: arrayRemove(userId),
  });

  // Create a room now
  const roomId = uuidv4();
  const foundRef = doc(firestore, "rooms", roomId);
  const newRoom: IRoom = {
    id: roomId,
    side1: userId,
    side2: chosenOpponentId,
    side1Board: "",
    side2Board: "",
    word: puzzleWords[Math.floor(Math.random() * puzzleWords.length)],
    side1LastPresence: new Date(),
    side2LastPresence: new Date(),
  };

  await setDoc(foundRef, newRoom, { merge: true });

  // Let the other know
  const opponentRef = doc(firestore, "users", chosenOpponentId);
  await updateDoc(opponentRef, {
    rankRoomId: roomId,
  });

  return newRoom.id;
};

export const removeRankRoomId = async (user: IUser) => {
  const ref = doc(firestore, "users", user.id);
  await updateDoc(ref, {
    rankRoomId: null,
  });
};
