import { doc, getDocs, query, Timestamp, updateDoc } from "firebase/firestore";
import { puzzleWords } from "../utils/puzzleWords";
import { dailyCollection, firestore } from "./clientApp";
import { IDailyPuzzle } from "../interfaces/IDailyPuzzle";
import IUser from "../interfaces/IUser";

export const queryDailyWord = async (): Promise<IDailyPuzzle | undefined> => {
  const dailyQuery = query(dailyCollection);

  const querySnapshot = await getDocs(dailyQuery);
  if (querySnapshot.docs.length === 0) {
    return;
  }

  const data = querySnapshot.docs[0].data();
  const lastUpdated = new Date(data.lastUpdated.seconds * 1000);
  const today = new Date();

  // HACK: Update the word if new day here, should be done by server in the future
  if (today.getDate() != lastUpdated.getDate()) {
    const newWord = puzzleWords[Math.floor(Math.random() * puzzleWords.length)];
    const foundDocRef = doc(firestore, "daily", "1234567890");
    await updateDoc(foundDocRef, {
      lastUpdated: Timestamp.fromDate(today),
      word: newWord,
    });

    return {
      word: newWord,
      lastUpdated: today,
    };
  }

  return {
    word: data.word,
    lastUpdated,
  };
};

export const checkIfDailyCompleted = async (user: IUser): Promise<boolean> => {
  const loadedDailyWord = await queryDailyWord();

  if (!loadedDailyWord) {
    return false;
  }

  if (
    user.dailyPuzzleCompleted.getFullYear() ===
      loadedDailyWord.lastUpdated.getFullYear() &&
    user.dailyPuzzleCompleted.getMonth() ===
      loadedDailyWord.lastUpdated.getMonth() &&
    user.dailyPuzzleCompleted.getDate() ===
      loadedDailyWord.lastUpdated.getDate()
  ) {
    return true;
  }

  return false;
};
