import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { EmptyStreaks, IStreaks } from "../interfaces/IStreaks";
import { firestore } from "./clientApp";
import { queryDailyWord } from "./daily";
import { queryUser } from "./users";

export const updateDailyStreak = async (
  userId: string,
  won: boolean
): Promise<void> => {
  const user = await queryUser(userId);
  const dailyWord = await queryDailyWord();

  if (!user || !dailyWord) {
    return;
  }

  const today = new Date();

  if (
    dailyWord.lastUpdated.getFullYear() !==
      user.dailyPuzzleCompleted.getFullYear() ||
    dailyWord.lastUpdated.getMonth() !== user.dailyPuzzleCompleted.getMonth() ||
    dailyWord.lastUpdated.getDate() !== user.dailyPuzzleCompleted.getDate()
  ) {
    // Lose streak
    const foundDocRef = doc(firestore, "users", userId);
    await updateDoc(foundDocRef, {
      currentDailyStreak: won ? 1 : 0,
      longestDailyStreak: Math.max(user.longestDailyStreak, won ? 1 : 0),
      dailyPuzzleCompleted: Timestamp.fromDate(today),
    });
  } else {
    // Add streak
    const foundDocRef = doc(firestore, "users", userId);
    await updateDoc(foundDocRef, {
      currentDailyStreak: won ? user.currentDailyStreak + 1 : 0,
      dailyPuzzleCompleted: Timestamp.fromDate(today),
      longestDailyStreak: Math.max(
        user.longestDailyStreak,
        won ? user.currentDailyStreak + 1 : 0
      ),
    });
  }
};

export const updatePracticeStreak = async (
  userId: string,
  won: boolean
): Promise<void> => {
  const user = await queryUser(userId);

  if (!user) {
    return;
  }

  // Add streak
  const foundDocRef = doc(firestore, "users", userId);
  await updateDoc(foundDocRef, {
    currentPracticeStreak: won ? user.currentPracticeStreak + 1 : 0,
    longestPracticeStreak: Math.max(
      user.longestPracticeStreak,
      won ? user.currentPracticeStreak + 1 : 0
    ),
  });
};
