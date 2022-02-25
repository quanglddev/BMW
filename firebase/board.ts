import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { IBoardCell } from "../interfaces/IBoardSkin";
import { IRoom } from "../interfaces/IRoom";
import { puzzleWords } from "../utils/puzzleWords";
import { firestore } from "./clientApp";
import { queryDailyWord } from "./daily";
import { queryUser } from "./users";

export const stringToCells = (encodedBoard: string): IBoardCell[] => {
  const result: IBoardCell[] = [];
  for (let i = 0; i < encodedBoard.length; i += 2) {
    result.push({
      value: encodedBoard[i] === " " ? "" : encodedBoard[i],
      state: parseInt(encodedBoard[i + 1], 10),
    });
  }

  for (let i = result.length; i < 30; i++) {
    result.push({
      value: "",
      state: 0,
    });
  }
  return result;
};

export const cellsToString = (cells: IBoardCell[]) => {
  // Encode every cell by 2 characters (first is cell value and second is cell state)
  let result = "";
  cells.forEach((cell) => {
    result += cell.value === "" ? " " : cell.value;
    result += `${cell.state}`;
  });
  return result;
};

export const updateBoard = async (
  mode: string,
  cells: IBoardCell[],
  userId: string,
  roomDetail?: IRoom
) => {
  const userDocRef = doc(firestore, "users", userId);

  const encodedBoard = cellsToString(cells);
  const today = new Date();

  if (mode === "daily") {
    await updateDoc(userDocRef, {
      ongoingDailyGuess: encodedBoard,
      dailyGuessLastAttempt: Timestamp.fromDate(today),
    });
  } else if (mode === "practice") {
    await updateDoc(userDocRef, {
      ongoingPracticeGuess: encodedBoard,
    });
  } else if (mode === "rank" && roomDetail) {
    if (roomDetail.side1 === userId) {
      const userDocRef = doc(firestore, "rooms", roomDetail.id);
      await updateDoc(userDocRef, {
        side1Board: encodedBoard,
      });
    } else if (roomDetail.side2 === userId) {
      const userDocRef = doc(firestore, "rooms", roomDetail.id);
      await updateDoc(userDocRef, {
        side2Board: encodedBoard,
      });
    }
  }
};

export const wipeBoard = async (mode: string, userId: string) => {
  const userDocRef = doc(firestore, "users", userId);

  const defaultData = Array(30)
    .fill(null)
    .map(() => ({
      value: "",
      state: 0,
    }));

  const encodedBoard = cellsToString(defaultData);

  if (mode === "daily") {
    await updateDoc(userDocRef, {
      ongoingDailyGuess: encodedBoard,
    });
  } else if (mode === "practice") {
    await updateDoc(userDocRef, {
      ongoingPracticeGuess: encodedBoard,
    });
  }
};

export const checkEncodedBoardFinished = (encodedBoard: string) => {
  let countBlankState = 0;
  let countCorrectState = 0;

  for (let i = 0; i < encodedBoard.length; i += 2) {
    const state = parseInt(encodedBoard[i + 1], 10);
    if (state === 0) {
      countBlankState += 1;
    }
    if (state === 3) {
      countCorrectState += 1;
      if (countCorrectState === 5) {
        return true;
      }
    }
  }

  return countBlankState === 0;
};

export const wipeBoardIfNewDay = async (
  mode: string,
  cells: IBoardCell[],
  userId: string
) => {
  if (mode === "daily") {
    const loadedDailyWord = await queryDailyWord();

    if (!loadedDailyWord) {
      return;
    }

    const user = await queryUser(userId);

    if (!user) {
      return;
    }

    if (
      user.dailyGuessLastAttempt.getFullYear() ===
        loadedDailyWord.lastUpdated.getFullYear() &&
      user.dailyGuessLastAttempt.getMonth() ===
        loadedDailyWord.lastUpdated.getMonth() &&
      user.dailyGuessLastAttempt.getDate() ===
        loadedDailyWord.lastUpdated.getDate()
    ) {
      // Same day don't delete
    } else {
      const encodedBoard = cellsToString(cells);
      if (checkEncodedBoardFinished(encodedBoard)) {
        await wipeBoard(mode, userId);
      }
    }
  }
};

export const wipeBoardIfNewPracticeWord = async (
  mode: string,
  userId: string
) => {
  if (mode === "practice") {
    const user = await queryUser(userId);

    if (!user) {
      return;
    }

    if (
      user.currentPracticeWord.toLowerCase() !==
      user.previousPracticeWord.toLowerCase()
    ) {
      const encodedBoard = user.ongoingPracticeGuess;
      if (checkEncodedBoardFinished(encodedBoard)) {
        await wipeBoard(mode, userId);
      }
    }
  }
};

export const generateNewPracticeWordIfEmpty = async (
  userId: string,
  forceGenerate: boolean = false
): Promise<string> => {
  const userDocRef = doc(firestore, "users", userId);

  const user = await queryUser(userId);

  if (!user) {
    return "";
  }

  if (user.currentPracticeWord) {
    // Already have a word
    if (!forceGenerate) {
      return user.currentPracticeWord;
    }
  }

  const newWord = puzzleWords[Math.floor(Math.random() * puzzleWords.length)];

  await updateDoc(userDocRef, {
    currentPracticeWord: newWord,
    previousPracticeWord: user.currentPracticeWord,
  });

  return newWord;
};

const getLatestNotCommittedLineIdx = (cells: IBoardCell[]): number => {
  for (let i = 0; i < 6; i++) {
    if (cells[i * 5].state === 0) {
      return i;
    }
  }

  return 0;
};

const getGuessedWord = (cells: IBoardCell[]): string => {
  let lineIdx = getLatestNotCommittedLineIdx(cells);

  if (cells.length === 0) {
    return "";
  }

  if (lineIdx - 1 < 0) {
    return "";
  }

  // Line with committed text if any
  lineIdx = lineIdx - 1;

  const cellsOnLine = cells.slice(lineIdx * 5, lineIdx * 5 + 5);
  const guessedWord = cellsOnLine.map((cell) => cell.value).join("");
  return guessedWord;
};

export const isPracticeWordFinished = async (
  userId: string
): Promise<boolean> => {
  // Check if word is found
  const user = await queryUser(userId);

  if (!user) {
    return false;
  }

  const encodedBoard = user.ongoingPracticeGuess;
  const guessedWord = getGuessedWord(stringToCells(encodedBoard));

  if (guessedWord.toLowerCase() === user.currentPracticeWord.toLowerCase()) {
    return true;
  }

  // Check if the user failed
  return checkEncodedBoardFinished(encodedBoard);
};
