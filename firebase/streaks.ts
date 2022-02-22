import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { EmptyStreaks, IStreaks } from "../interfaces/IStreaks";
import { firestore } from "./clientApp";
import { queryDailyWord } from "./daily";
import { queryUser } from "./users";

const updateDailyStreak = async (
  userId: string,
  won: boolean
): Promise<IStreaks | undefined> => {
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
      dailyPuzzleCompleted: Timestamp.fromDate(today),
    });

    return {
      longestDailyStreak: user.longestDailyStreak,
      longestPracticeStreak: user.longestPracticeStreak,
      longestRankStreak: user.longestRankStreak,
      currentDailyStreak: won ? 1 : 0,
      currentPracticeStreak: user.currentPracticeStreak,
      currentRankStreak: user.currentRankStreak,
    };
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
    return {
      longestDailyStreak: Math.max(
        user.longestDailyStreak,
        won ? user.currentDailyStreak + 1 : 0
      ),
      longestPracticeStreak: user.longestPracticeStreak,
      longestRankStreak: user.longestRankStreak,
      currentDailyStreak: won ? user.currentDailyStreak + 1 : 0,
      currentPracticeStreak: user.currentPracticeStreak,
      currentRankStreak: user.currentRankStreak,
    };
  }
};

const updatePracticeStreak = async (
  userId: string,
  won: boolean
): Promise<IStreaks | undefined> => {
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

  return {
    longestDailyStreak: user.longestDailyStreak,
    longestPracticeStreak: Math.max(
      user.longestPracticeStreak,
      won ? user.currentPracticeStreak + 1 : 0
    ),
    longestRankStreak: user.longestRankStreak,
    currentDailyStreak: user.currentDailyStreak,
    currentPracticeStreak: won ? user.currentPracticeStreak + 1 : 0,
    currentRankStreak: user.currentRankStreak,
  };
};

export const updateStreaks = async (
  userId: string,
  mode: string,
  won: boolean
) => {
  if (mode === "daily") {
    const stats = await updateDailyStreak(userId, won);
    return stats;
  } else if (mode === "practice") {
    const stats = await updatePracticeStreak(userId, won);
    return stats;
  }
};
