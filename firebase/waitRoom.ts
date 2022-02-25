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
  Timestamp,
} from "firebase/firestore";
import { puzzleWords } from "../utils/puzzleWords";
import { IRoom } from "../interfaces/IRoom";
import IUser from "../interfaces/IUser";
import { queryFriends } from "./users";

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

  const userRef = doc(firestore, "users", userId);
  await updateDoc(userRef, {
    rankRoomId: null,
  });
};

export const createJointRoom = async (
  userId: string,
  ids: string[]
): Promise<string> => {
  const availables = [...ids];

  const chosenOpponentId = availables[availables.length - 1];

  // Create a room now
  const roomId = uuidv4();
  const foundRef = doc(firestore, "rooms", roomId);

  await setDoc(
    foundRef,
    {
      id: roomId,
      side1: userId,
      side2: chosenOpponentId,
      side1Board: "",
      side2Board: "",
      word: puzzleWords[Math.floor(Math.random() * puzzleWords.length)],
      side1LastPresence: Timestamp.fromDate(new Date()),
      side2LastPresence: Timestamp.fromDate(new Date()),
    },
    { merge: true }
  );

  // Let the other know
  const opponentRef = doc(firestore, "users", chosenOpponentId);
  await updateDoc(opponentRef, {
    rankRoomId: roomId,
  });

  return roomId;
};

export const createJointFriendRoom = async (
  userId: string,
  ids: string[]
): Promise<string> => {
  const friends = await queryFriends(userId);
  const friendIds = friends.map((friend) => friend.id);

  const availables = [...ids];

  let chosenOpponentId = "";

  for (let i = availables.length - 1; i > -1; i--) {
    if (friendIds.indexOf(availables[i]) > -1) {
      chosenOpponentId = availables[i];
      break;
    }
  }

  if (!chosenOpponentId) {
    return "";
  }

  // Create a room now
  const roomId = uuidv4();
  const foundRef = doc(firestore, "rooms", roomId);

  await setDoc(
    foundRef,
    {
      id: roomId,
      side1: userId,
      side2: chosenOpponentId,
      side1Board: "",
      side2Board: "",
      word: puzzleWords[Math.floor(Math.random() * puzzleWords.length)],
      side1LastPresence: Timestamp.fromDate(new Date()),
      side2LastPresence: Timestamp.fromDate(new Date()),
    },
    { merge: true }
  );

  // Let the other know
  const opponentRef = doc(firestore, "users", chosenOpponentId);
  await updateDoc(opponentRef, {
    rankRoomId: roomId,
  });

  return roomId;
};

export const removeRankRoomId = async (user: IUser) => {
  const ref = doc(firestore, "users", user.id);
  await updateDoc(ref, {
    rankRoomId: null,
  });
};
