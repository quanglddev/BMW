import { DocumentData, getDocs, query, where } from "firebase/firestore";
import IUser from "../interfaces/User";
import { usersCollection } from "./clientApp";

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
  };

  return user;
};

export const queryUser = async (userId: string) => {
  const userQuery = query(usersCollection, where("id", "==", userId));

  const querySnapshot = await getDocs(userQuery);
  if (querySnapshot.docs.length === 0) {
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
