import { useEffect, useState, useRef, MouseEvent } from "react";
import {
  EmptyBoardSkin,
  IBoardCell,
  IBoardSkin,
} from "../interfaces/IBoardSkin";
import { firebaseDataToUser, queryUser } from "../firebase/users";
import { queryBoardSkin } from "../firebase/boardSkins";
import BoardSkinManager from "../models/BoardSkinManager";
import { displayError } from "../utils/SweetAlertHelper";
import keyboard from "../utils/initKeyboard";
import { validEnglishWords } from "../utils/validEnglishWords";
import GameResultPopup from "./GameResultPopup";
import { AnnouncementStatus, IAnnouncement } from "../interfaces/IAnnouncement";
import Fireworks from "fireworks/lib/react";
import { useRouter } from "next/router";
import { onSnapshot, query, where } from "firebase/firestore";
import { roomsCollection, usersCollection } from "../firebase/clientApp";
import {
  stringToCells,
  updateBoard,
  wipeBoardIfNewDay,
  wipeBoardIfNewPracticeWord as wipeBoardIfNewPracticeWordAndFinished,
} from "../firebase/board";
import { IRoom } from "../interfaces/IRoom";
import {
  playerDisconnected,
  getEncodedBoard,
  updatePresenceOnRoom,
  firebaseToRoomDetail,
  getOpponentEncodedBoard,
} from "../firebase/rooms";
import useKeypress from "../utils/useKeypress";

// Create your forceUpdate hook
const useForceUpdate = () => {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
};

interface Props {
  userId: string;
  word: string;
  mode: string;
  roomId?: string;
  defaultShowAnnouncement?: boolean;
  defaultAnnouncementConfig?: IAnnouncement;
  onFinished: (userId: string, won: boolean, roomDetail?: IRoom) => void;
}

const Playground = (props: Props) => {
  const {
    userId,
    word,
    mode,
    roomId,
    defaultShowAnnouncement,
    defaultAnnouncementConfig,
    onFinished,
  } = props;
  const router = useRouter();
  const forceUpdate = useForceUpdate();
  const cellsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [cells, setCells] = useState<IBoardCell[]>([]);
  const [opponentCells, setOpponentCells] = useState<IBoardCell[]>([]);
  const [boardSkin, setBoardSkin] = useState<IBoardSkin>(EmptyBoardSkin);
  const [boardSkinManager, setBoardSkinManager] =
    useState<BoardSkinManager | null>(null);
  const [opponentBoardSkinManager, setOpponentBoardSkinManager] =
    useState<BoardSkinManager | null>(null);
  const [fireworkX, setFireworkX] = useState<number>(0);
  const [fireworkY, setFireworkY] = useState<number>(0);
  const [runFirework, setRunFirework] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [roomDetail, setRoomDetail] = useState<IRoom | undefined>();
  const [showMyBoard, setShowMyBoard] = useState<boolean>(true);

  const [showAnnouncement, setShowAnnouncement] = useState<boolean>(false);
  const [announcementConfig, setAnnouncementConfig] =
    useState<IAnnouncement | null>();

  useKeypress((e: KeyboardEvent) => {
    e.preventDefault();

    if (finished) {
      return;
    }

    setShowMyBoard(true);

    if (e.key.toLowerCase() === "enter") {
      onEnterClicked();
    } else if (e.key.toLowerCase() === "backspace") {
      onDeleteClicked();
    } else {
      onInsertLetter(e.key);
    }
  });

  useEffect(() => {
    if (!userId) {
      return;
    }

    if (mode !== "daily") {
      return;
    }

    const userQuery = query(usersCollection, where("id", "==", userId));

    const unsubscribeStats = onSnapshot(
      userQuery,
      { includeMetadataChanges: true },
      (querySnapshot) => {
        if (querySnapshot.docs.length === 0) {
          return;
        }

        const user = firebaseDataToUser(querySnapshot.docs[0].data());

        const dailyGuess = user.ongoingDailyGuess;

        const newCells: IBoardCell[] = stringToCells(dailyGuess);

        setCells(newCells);
        wipeBoardIfNewDay(mode, newCells, userId);
        setBoardSkinManager(new BoardSkinManager(newCells, boardSkin));
      }
    );

    return () => {
      unsubscribeStats();
    };
  }, [userId, mode, boardSkin]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    if (mode !== "practice") {
      return;
    }

    const userQuery = query(usersCollection, where("id", "==", userId));

    const unsubscribe = onSnapshot(
      userQuery,
      { includeMetadataChanges: true },
      (querySnapshot) => {
        if (querySnapshot.docs.length === 0) {
          return;
        }

        const user = firebaseDataToUser(querySnapshot.docs[0].data());

        const practiceGuess = user.ongoingPracticeGuess;

        const newCells: IBoardCell[] = stringToCells(practiceGuess);

        setCells(newCells);
        setBoardSkinManager(new BoardSkinManager(newCells, boardSkin));
      }
    );

    return () => {
      unsubscribe();
    };
  }, [userId, mode, boardSkin]);

  useEffect(() => {
    if (mode !== "practice") {
      return;
    }

    wipeBoardIfNewPracticeWordAndFinished(mode, userId);
  }, [mode, userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    if (mode !== "rank" && mode !== "friendly") {
      return;
    }

    const roomQuery = query(roomsCollection, where("id", "==", roomId));

    const unsubscribe = onSnapshot(
      roomQuery,
      { includeMetadataChanges: true },
      async (querySnapshot) => {
        if (querySnapshot.docs.length === 0) {
          return;
        }

        const newRoomDetails = firebaseToRoomDetail(
          querySnapshot.docs[0].data()
        );

        // There's a winner
        if (
          newRoomDetails.finishedTime &&
          newRoomDetails.winner &&
          !announcementConfig
        ) {
          // Determine winner loser
          const winning = newRoomDetails.winner === userId;
          onFinished(userId, winning, newRoomDetails);
          const config: IAnnouncement = {
            userId,
            status: winning
              ? AnnouncementStatus.success
              : AnnouncementStatus.failure,
            title: winning ? "Victory" : "Defeat",
            message: winning
              ? `Win by time! (${word.toUpperCase()})`
              : `Lose by time. (${word.toUpperCase()})`,
            buttonText: "New Rank Match",
            onMainButtonClick: () => {
              router.push("/play/game/rank");
            },
            onClose: () => {
              router.push("/");
            },
          };
          setAnnouncementConfig(config);
          setFinished(true);
        }

        setRoomDetail(newRoomDetails);

        const encodedBoard = getEncodedBoard(userId, newRoomDetails);
        const opponentEncodedBoard = getOpponentEncodedBoard(
          userId,
          newRoomDetails
        );
        const newCells: IBoardCell[] = stringToCells(encodedBoard);
        const newOpponentCells: IBoardCell[] =
          stringToCells(opponentEncodedBoard);

        setCells(newCells);
        setOpponentCells(newOpponentCells);
        wipeBoardIfNewDay(mode, newCells, userId);
        setBoardSkinManager(new BoardSkinManager(newCells, boardSkin));
        setOpponentBoardSkinManager(
          new BoardSkinManager(newOpponentCells, boardSkin)
        );

        // There's a disconnection
        const disconnected = await playerDisconnected(userId, newRoomDetails);
        if (disconnected && !announcementConfig) {
          const winning = userId !== disconnected;

          if (winning) {
            // The one that DOESN'T disconnect can continue to play
            return;
          }

          onFinished(userId, winning, newRoomDetails);
          const config: IAnnouncement = {
            userId,
            status: winning
              ? AnnouncementStatus.success
              : AnnouncementStatus.failure,
            title: winning ? "Victory" : "Defeat",
            message: winning
              ? `Win by disconnect. (${word.toUpperCase()})`
              : `Lose by disconnect. (${word.toUpperCase()})`,
            buttonText: "New Rank Match",
            onMainButtonClick: () => {
              router.push("/play/game/rank");
            },
            onClose: () => {
              router.push("/");
            },
          };
          setAnnouncementConfig(config);
          setFinished(true);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [
    userId,
    mode,
    boardSkin,
    roomId,
    onFinished,
    router,
    word,
    announcementConfig,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!roomId) {
        return;
      }
      if (finished) {
        clearInterval(interval);
      }
      updatePresenceOnRoom(userId, roomId);
    }, 10 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [userId, roomId, finished]);

  useEffect(() => {
    const fetchData = async () => {
      const user = await queryUser(userId);

      if (!user) {
        return;
      }

      const boardSkin = await queryBoardSkin(user.board);
      if (!boardSkin) {
        return;
      }

      setBoardSkin(boardSkin);
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    setBoardSkinManager(new BoardSkinManager(cells, boardSkin));
  }, [cells, boardSkin]);

  useEffect(() => {
    setOpponentBoardSkinManager(new BoardSkinManager(opponentCells, boardSkin));
  }, [opponentCells, boardSkin]);

  useEffect(() => {
    if (!announcementConfig) {
      setShowAnnouncement(false);
      return;
    }
    setShowAnnouncement(true);
  }, [announcementConfig]);

  const updateCellValue = (cellIdx: number, value: string) => {
    const clone = JSON.parse(JSON.stringify(cells)) as IBoardCell[];
    clone[cellIdx].value = value;
    updateBoard(mode, clone, userId, roomDetail);
  };

  const onClickCell = (
    e: MouseEvent<HTMLInputElement, globalThis.MouseEvent>,
    mode: string,
    cellIdx: number
  ) => {
    e.preventDefault();

    // Determine if cell is clickable
    if (mode !== "rank" && mode != "friendly") {
      // Too time-consuming for player
      if (cells[cellIdx].state !== 0) {
        displayError(
          "You can't go back and change the beginning, but you can start where you are and change the ending."
        );
        return;
      }
    } else {
      setShowMyBoard(!showMyBoard);
    }
  };

  const getLatestNotCommittedLineIdx = (): number => {
    for (let i = 0; i < 6; i++) {
      if (cells[i * 5].state === 0) {
        return i;
      }
    }

    return 0;
  };

  const startFirework = async (cellIdx: number) => {
    const bounding = cellsRef.current[cellIdx]!.getBoundingClientRect();
    const x = bounding.x + bounding.width / 2;
    const y = bounding.y + bounding.height / 2 + window.scrollY;
    setFireworkX(x);
    setFireworkY(y);
    setRunFirework(true);
    await new Promise((r) => setTimeout(r, 400));
    setRunFirework(false);
  };

  const resetGame = () => {
    const defaultData = Array(30)
      .fill(null)
      .map(() => ({
        value: "",
        state: 0,
      }));
    updateBoard(mode, defaultData, userId, roomDetail);
    setAnnouncementConfig(null);
    setShowAnnouncement(false);
    setFinished(false);
  };

  const displayAnnouncement = (won: boolean) => {
    if (mode === "daily") {
      const config: IAnnouncement = {
        userId,
        status: won ? AnnouncementStatus.success : AnnouncementStatus.failure,
        title: won ? "Victory" : "Defeat",
        message: won
          ? `Great Work! (${word.toUpperCase()})`
          : `The word is ${word.toUpperCase()}`,
        buttonText: "Practice Now",
        onMainButtonClick: () => {
          router.push("/play/game/practice");
        },
        onClose: () => {
          router.push("/");
        },
      };

      setAnnouncementConfig(config);
    } else if (mode === "practice") {
      const config: IAnnouncement = {
        userId,
        status: won ? AnnouncementStatus.success : AnnouncementStatus.failure,
        title: won ? "Victory" : "Defeat",
        message: won
          ? `Great Work! (${word.toUpperCase()})`
          : `The word is ${word.toUpperCase()}`,
        buttonText: "New Game",
        onMainButtonClick: () => {
          resetGame();
        },
        onClose: () => {
          router.push("/");
        },
      };

      setAnnouncementConfig(config);
    } else if (mode === "rank") {
      const config: IAnnouncement = {
        userId,
        status: won ? AnnouncementStatus.success : AnnouncementStatus.failure,
        title: won ? "Victory" : "Defeat",
        message: won
          ? `You Won! (${word.toUpperCase()})`
          : `The word is ${word.toUpperCase()}`,
        buttonText: "New Rank Match",
        onMainButtonClick: () => {
          router.push("/play/game/rank");
        },
        onClose: () => {
          router.push("/");
        },
      };
      setAnnouncementConfig(config);
    } else if (mode === "friendly") {
      const config: IAnnouncement = {
        userId,
        status: won ? AnnouncementStatus.success : AnnouncementStatus.failure,
        title: won ? "Victory" : "Defeat",
        message: won
          ? `You Won! (${word.toUpperCase()})`
          : `The word is ${word.toUpperCase()}`,
        buttonText: "New Friendly Match",
        onMainButtonClick: () => {
          router.push("/play/game/friendly");
        },
        onClose: () => {
          router.push("/");
        },
      };
      setAnnouncementConfig(config);
    }
  };

  const checkIfFinished = (guessedWord: string) => {
    let filledLineIdx = getLatestNotCommittedLineIdx();

    if (guessedWord === word) {
      onFinished(userId, true, roomDetail);
      displayAnnouncement(true);
      setFinished(true);
    } else if (filledLineIdx === 5) {
      onFinished(userId, false, roomDetail);
      displayAnnouncement(false);
      setFinished(true);
    }
  };

  const isCellGreen = (guessedWord: string, idx: number): boolean => {
    return guessedWord[idx].toLowerCase() === word[idx].toLowerCase();
  };

  const isCellYellow = (guessedWord: string, idx: number): boolean => {
    let letterOccurrenceIdx: number[] = [];
    for (let i = 0; i < word.length; i++) {
      if (word[i].toLowerCase() === guessedWord[idx].toLowerCase()) {
        letterOccurrenceIdx.push(i);
      }
    }

    for (let _idx of letterOccurrenceIdx) {
      if (guessedWord[_idx].toLowerCase() !== word[_idx].toLowerCase()) {
        return true;
      }
    }

    return false;
  };

  const startRevealingSequence = async (
    lineIdx: number,
    guessedWord: string
  ) => {
    // Clone
    const clone = JSON.parse(JSON.stringify(cells)) as IBoardCell[];

    for (let i = 0; i < 5; i++) {
      // Firework
      await startFirework(lineIdx * 5 + i);

      // Update
      if (isCellGreen(guessedWord, i)) {
        clone[lineIdx * 5 + i].state = 3;
      } else if (isCellYellow(guessedWord, i)) {
        clone[lineIdx * 5 + i].state = 2;
      } else {
        clone[lineIdx * 5 + i].state = 1;
      }
      updateBoard(mode, clone, userId, roomDetail);
      forceUpdate();
    }
    forceUpdate();

    checkIfFinished(guessedWord);
  };

  const getGuessedWord = (): string => {
    let lineIdx = getLatestNotCommittedLineIdx();

    if (cells.length === 0) {
      return "";
    }

    const cellsOnLine = cells.slice(lineIdx * 5, lineIdx * 5 + 5);
    const guessedWord = cellsOnLine.map((cell) => cell.value).join("");
    return guessedWord;
  };

  const onEnterClicked = () => {
    let lineIdx = getLatestNotCommittedLineIdx();

    const guessedWord = getGuessedWord();
    if (guessedWord.length !== 5) {
      displayError("You need to fill out the line");
      return;
    }

    if (validEnglishWords.indexOf(guessedWord) < 0) {
      displayError(`${guessedWord.toUpperCase()} is not a valid word.`);
      return;
    }

    startRevealingSequence(lineIdx, guessedWord);
  };

  const onDeleteClicked = () => {
    let lastFilledCellIdx = cells.length;
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].value) {
        lastFilledCellIdx = i;
        break;
      }
    }

    if (lastFilledCellIdx - 1 < 0) {
      return;
    }

    let lineIdx = getLatestNotCommittedLineIdx();
    if (lastFilledCellIdx - 1 >= lineIdx * 5) {
      updateCellValue(lastFilledCellIdx - 1, "");
    }
  };

  const onInsertLetter = (value: string) => {
    let firstEmptyCellIdx = -1;
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].value) {
        firstEmptyCellIdx = i;
        break;
      }
    }

    if (firstEmptyCellIdx === -1 || firstEmptyCellIdx >= cells.length) {
      return;
    }

    let lineIdx = getLatestNotCommittedLineIdx();
    if (firstEmptyCellIdx >= lineIdx * 5 + 5) {
      displayError("You have to submit current line to move on");
      return;
    }

    updateCellValue(firstEmptyCellIdx, value);
  };

  const onKeyBoardClick = (keyCode: string) => {
    if (finished) {
      return;
    }

    setShowMyBoard(true);

    if (keyCode.toLowerCase() === "enter") {
      onEnterClicked();
    } else if (keyCode.toLowerCase() === "⌫") {
      onDeleteClicked();
    } else {
      onInsertLetter(keyCode);
    }
  };

  const cellOuterClasses = (state: number): string => {
    if (!boardSkinManager) {
      return "";
    }

    const result: string[] = [];
    const class1 = boardSkinManager.getCellBorderWidth(state);
    const class2 = boardSkinManager.getCellBorderColor(state);
    result.push(class1 ? class1 : "");
    result.push(class2 ? class2 : "");
    return result.join(" ");
  };

  const cellInnerClasses = (state: number): string => {
    if (!boardSkinManager) {
      return "";
    }

    const result: string[] = [];
    const class1 = boardSkinManager.getCellBackgroundColor(state);
    const class2 = boardSkinManager.getCellTextColor(state);
    result.push(class1 ? class1 : "");
    result.push(class2 ? class2 : "");
    return result.join(" ");
  };

  const keyClasses = (value: string) => {
    if (!boardSkinManager) {
      return "";
    }

    const result: string[] = [];
    const class1 = boardSkinManager.getKeyBorderWidth(value);
    const class2 = boardSkinManager.getKeyBorderColor(value);
    const class3 = boardSkinManager.getKeyBackgroundColor(value);
    const class4 = boardSkinManager.getKeyTextColor(value);
    result.push(class1 ? class1 : "");
    result.push(class2 ? class2 : "");
    result.push(class3 ? class3 : "");
    result.push(class4 ? class4 : "");
    return result.join(" ");
  };

  return (
    <div className="flex w-full h-full flex-col items-center justify-center z-10 bg-pink-light-1 md:flex-row">
      <div className="z-40">
        {showAnnouncement && announcementConfig && (
          <GameResultPopup
            show={showAnnouncement}
            config={announcementConfig}
          ></GameResultPopup>
        )}
        {defaultShowAnnouncement && defaultAnnouncementConfig && (
          <GameResultPopup
            show={defaultShowAnnouncement}
            config={defaultAnnouncementConfig}
          ></GameResultPopup>
        )}
      </div>

      <div className="flex flex-row flex-wrap justify-center items-center w-full max-w-xs sm:max-w-sm md:w-7/12">
        {cells.map((cell, idx) => (
          <div className="relative" key={idx}>
            {(mode === "rank" || mode === "friendly") &&
              idx < opponentCells.length && (
                <div
                  className={`absolute mt-3 top-0 flex justify-center items-center w-12 h-12 sm:w-14 sm:h-14 m-2 drop-shadow-md cursor-not-allowed ${
                    showMyBoard ? "z-0" : "z-20"
                  } ${cellOuterClasses(opponentCells[idx].state)}`}
                >
                  <input
                    type="text"
                    className={`flex w-full h-full items-center justify-center text-center text-3xl font-semibold uppercase rounded-none cursor-not-allowed ${cellInnerClasses(
                      opponentCells[idx].state
                    )}`}
                    value={""}
                    maxLength={1}
                    onClick={(e) => onClickCell(e, mode, idx)}
                    readOnly
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </div>
              )}
            <div
              className={`relative flex justify-center items-center w-12 h-12 sm:w-14 sm:h-14 m-2 drop-shadow-md cursor-not-allowed ${
                showMyBoard ? "z-20" : "z-0"
              } ${cellOuterClasses(cell.state)}`}
            >
              <input
                ref={(el) => (cellsRef.current[idx] = el)}
                type="text"
                className={`flex w-full h-full items-center justify-center text-center text-3xl font-semibold uppercase rounded-none cursor-not-allowed ${cellInnerClasses(
                  cell.state
                )}`}
                value={cell.value}
                maxLength={1}
                onChange={(e) => updateCellValue(idx, e.target.value)}
                onClick={(e) => onClickCell(e, mode, idx)}
                readOnly
                onKeyDown={(e) => e.preventDefault()}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="w-full flex flex-col items-center mt-5 select-none justify-end fixed bottom-0 right-0 left-0 md:w-5/12 md:relative">
        <div className="w-full flex justify-center mt-[5px]">
          {keyboard[0].map((keyCode) => (
            <button
              key={keyCode.value}
              className={`flex items-center justify-center h-16 w-8 md:h-12 md:w-6 rounded-md text-sm capitalize font-semibold mx-[3.5px] hover:bg-slate-100 ${keyClasses(
                keyCode.value
              )}`}
              onClick={() => onKeyBoardClick(keyCode.value)}
            >
              {keyCode.value}
            </button>
          ))}
        </div>
        <div className="w-full flex justify-center mt-[5px]">
          {keyboard[1].map((keyCode) => (
            <button
              key={keyCode.value}
              className={`flex items-center justify-center h-16 w-8 md:h-12 md:w-6 rounded-md text-sm capitalize font-semibold mx-[3.5px] hover:bg-slate-100 ${keyClasses(
                keyCode.value
              )}`}
              onClick={() => onKeyBoardClick(keyCode.value)}
            >
              {keyCode.value}
            </button>
          ))}
        </div>
        <div className="w-full flex justify-center my-[5px]">
          {keyboard[2].map((keyCode) => (
            <button
              key={keyCode.value}
              className={`flex items-center justify-center h-16 md:h-12 ${
                keyCode.isWide ? "w-12" : "w-8 md:w-6"
              } rounded-md ${
                keyCode.isBigText ? "text-xl" : "text-sm"
              } capitalize font-semibold mx-[3.5px] ${keyClasses(
                keyCode.value
              )}`}
              onClick={() => onKeyBoardClick(keyCode.value)}
            >
              {keyCode.value}
            </button>
          ))}
        </div>
      </div>
      {runFirework && (
        <Fireworks
          count={1}
          interval={400}
          calc={(props, i) => ({
            ...props,
            x: fireworkX,
            y: fireworkY,
            canvasWidth: 50,
            canvasHeight: 50,
          })}
        />
      )}
    </div>
  );
};
export default Playground;
