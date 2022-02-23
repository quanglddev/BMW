import {
  doc,
  DocumentData,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { AuthUserContext } from "next-firebase-auth";
import IUser from "../interfaces/IUser";
import { firestore, usersCollection } from "./clientApp";

export const firebaseDataToUser = (data: DocumentData): IUser => {
  const user: IUser = {
    id: data.id,
    fullName: data.fullName,
    email: data.email,
    imageUrl: data.imageUrl,
    isPlaying: data.isPlaying,
    lastActivity: new Date(data.lastActivity.seconds * 1000),
    buddies: data.buddies,
    country: data.country,
    aboutMe: data.aboutMe,
    board: data.board,
    inFriendRequests: data.inFriendRequests,
    outFriendRequests: data.outFriendRequests,
    currentDailyStreak: data.currentDailyStreak,
    longestDailyStreak: data.longestDailyStreak,
    dailyPuzzleCompleted: new Date(data.dailyPuzzleCompleted.seconds * 1000),
    currentPracticeStreak: data.currentPracticeStreak,
    longestPracticeStreak: data.longestPracticeStreak,
    currentRankStreak: data.currentRankStreak,
    longestRankStreak: data.longestRankStreak,
    ongoingDailyGuess: data.ongoingDailyGuess,
    dailyGuessLastAttempt: new Date(data.dailyGuessLastAttempt.seconds * 1000),
    currentPracticeWord: data.currentPracticeWord,
    previousPracticeWord: data.previousPracticeWord,
    ongoingPracticeGuess: data.ongoingPracticeGuess,
  };

  return user;
};

export const initializeUserInfo = async (authUser: AuthUserContext) => {
  if (!authUser.id) {
    return;
  }

  const user = await queryUser(authUser.id);

  if (user) {
    // If user already exist, don't overwrite
    return;
  }

  const foundDocRef = doc(firestore, "users", authUser.id);
  await setDoc(
    foundDocRef,
    {
      id: authUser.id,
      fullName: authUser.displayName ?? "",
      email: authUser.email ?? "",
      imageUrl:
        authUser.photoURL ?? "https://ui-avatars.com/api/?background=random",
      isPlaying: false,
      lastActivity: Timestamp.fromDate(new Date(0)),
      buddies: [],
      country: "United States",
      aboutMe: "",
      board: "7Pp3tkwa3IT0QqwuHVAj",
      inFriendRequests: [],
      outFriendRequests: [],
      currentDailyStreak: 0,
      longestDailyStreak: 0,
      dailyPuzzleCompleted: Timestamp.fromDate(new Date(0)),
      currentPracticeStreak: 0,
      longestPracticeStreak: 0,
      currentRankStreak: 0,
      longestRankStreak: 0,
      ongoingDailyGuess: "",
      dailyGuessLastAttempt: new Date(0),
      currentPracticeWord: "",
      previousPracticeWord: "",
      ongoingPracticeGuess: "",
    },
    { merge: true }
  );
};

export const queryUser = async (userId: string) => {
  const userQuery = query(usersCollection, where("id", "==", userId));

  const querySnapshot = await getDocs(userQuery);
  if (querySnapshot.docs.length === 0) {
    // Initialize user info
    return;
  }

  const data = querySnapshot.docs[0].data();

  const user = firebaseDataToUser(data);
  return user;
};

export const queryFriends = async (userId: string): Promise<IUser[]> => {
  const result: IUser[] = [];

  const friendsQuery = query(
    usersCollection,
    where("buddies", "array-contains", userId)
  );

  const querySnapshot = await getDocs(friendsQuery);

  querySnapshot.forEach((snapshot) => {
    const data = snapshot.data();
    const newFriend = firebaseDataToUser(data);
    result.push(newFriend);
  });

  return result;
};

export const queryFriendRequests = async (userId: string): Promise<IUser[]> => {
  const result: IUser[] = [];

  const friendRequestsQuery = query(
    usersCollection,
    where("outFriendRequests", "array-contains", userId)
  );

  const querySnapshot = await getDocs(friendRequestsQuery);

  querySnapshot.forEach((snapshot) => {
    const data = snapshot.data();
    const newFriend = firebaseDataToUser(data);
    result.push(newFriend);
  });

  return result;
};
