import {
  doc,
  DocumentData,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
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
    rankRoomId: data.rankRoomId,
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
      board: "aN452fkDiaG8P2lPTSOr",
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

export const queryGroupByIds = async (ids: string[]) => {
  const result: IUser[] = [];

  // Limit 10: https://firebase.google.com/docs/firestore/query-data/queries#in_not-in_and_array-contains-any
  for (let i = 0; i < ids.length; i += 10) {
    const range = ids.slice(i, i + 10);
    const customQuery = query(usersCollection, where("id", "in", range));

    const querySnapshot = await getDocs(customQuery);

    querySnapshot.forEach((snapshot) => {
      const data = snapshot.data();
      const newUser = firebaseDataToUser(data);
      result.push(newUser);
    });
  }

  return result;
};

export const updateUserPresence = async (userId: string) => {
  const foundDocRef = doc(firestore, "users", userId);
  const current = new Date();

  await updateDoc(foundDocRef, {
    lastActivity: Timestamp.fromDate(current),
  });
};
