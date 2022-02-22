import { useEffect, useState, MouseEvent, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuRadioGroup } from "@szhsin/react-menu";
import IUser from "../interfaces/User";
import {
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  boardSkinsCollection,
  firestore,
  storage,
  usersCollection,
} from "../firebase/clientApp";
import Camera from "../public/icons/camera.svg";
import USA from "../public/icons/usa.svg";
import Vietnam from "../public/icons/vietnam.svg";
import Iron from "../public/icons/iron.svg";
import Bronze from "../public/icons/bronze.svg";
import Silver from "../public/icons/silver.svg";
import Gold from "../public/icons/gold.svg";
import Platinum from "../public/icons/platinum.svg";
import Emerald from "../public/icons/emerald.svg";
import Diamond from "../public/icons/diamond.svg";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuthUser, withAuthUser } from "next-firebase-auth";
import {
  EmptyBoardSkin,
  IBoardCell,
  IBoardSkin,
} from "../interfaces/BoardSkin";
import { queryUser } from "../firebase/users";
import { queryBoardSkin } from "../firebase/boardSkins";
import BoardSkinManager from "../models/BoardSkinManager";
import { displayError } from "../utils/SweetAlertHelper";
import keyboard from "../utils/initKeyboard";
import { validEnglishWords } from "../utils/validEnglishWords";
import { updateStreaks } from "../firebase/streaks";
import GameResultPopup from "./GameResultPopup";
import { IAnnouncement } from "../interfaces/IAnnouncement";
import Fireworks from "fireworks/lib/react";

// Create your forceUpdate hook
const useForceUpdate = () => {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
};

interface Props {
  userId: string;
  word: string;
  mode: string;
}

const Playground = (props: Props) => {
  const { userId, word, mode } = props;
  const forceUpdate = useForceUpdate();
  const cellsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [cells, setCells] = useState<IBoardCell[]>([]);
  const [boardSkin, setBoardSkin] = useState<IBoardSkin>(EmptyBoardSkin);
  const [boardSkinManager, setBoardSkinManager] =
    useState<BoardSkinManager | null>(null);
  const [fireworkX, setFireworkX] = useState<number>(0);
  const [fireworkY, setFireworkY] = useState<number>(0);
  const [runFirework, setRunFirework] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [showAnnouncement, setShowAnnouncement] = useState<boolean>(false);
  const [announcementConfig, setAnnouncementConfig] =
    useState<IAnnouncement | null>(null);

  useEffect(() => {
    const defaultData: IBoardCell[] = Array(30)
      .fill(null)
      .map(() => ({
        value: "",
        state: 0,
      }));

    setCells(defaultData);
    setBoardSkinManager(new BoardSkinManager(defaultData, boardSkin));
  }, [boardSkin]);

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

  const updateCellValue = (cellIdx: number, value: string) => {
    const clone = JSON.parse(JSON.stringify(cells)) as IBoardCell[];
    clone[cellIdx].value = value;
    setCells(clone);
  };

  const onClickCell = (cellIdx: number) => {
    // Determine if cell is clickable
    if (cells[cellIdx].state !== 0) {
      displayError(
        "You can't go back and change the beginning, but you can start where you are and change the ending."
      );
      return;
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

  const displayAnnouncement = (won: boolean) => {
    setIsWon(won);
    setMessage(
      won ? "Great Work!" : `The word is ${sourceOfTruth.toUpperCase()}`
    );
    setTitle(won ? "Victory" : "Defeat");
    setShowAnnouncement(true);
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
      if (guessedWord[i] === word[i]) {
        clone[lineIdx * 5 + i].state = 3;
      } else if (word.indexOf(guessedWord[i]) > -1) {
        clone[lineIdx * 5 + i].state = 2;
      } else {
        clone[lineIdx * 5 + i].state = 1;
      }
      setCells(clone);
    }

    forceUpdate();
    if (guessedWord === word) {
      updateStreaks(userId, mode, true);
      displayAnnouncement(won);
      setFinished(true);
    } else if (lineIdx === 5) {
      updateStreaks(userId, mode, false);
      displayAnnouncement(won);
      setFinished(true);
    }
  };

  const checkLastFilledLine = () => {
    let lineIdx = getLatestNotCommittedLineIdx();

    const cellsOnLine = cells.slice(lineIdx * 5, lineIdx * 5 + 5);
    const guessedWord = cellsOnLine.map((cell) => cell.value).join("");
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

  const removeLastFilledCell = () => {
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

  const insertFirstEmptyCell = (value: string) => {
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

    if (keyCode.toLowerCase() === "enter") {
      checkLastFilledLine();
    } else if (keyCode.toLowerCase() === "⌫") {
      removeLastFilledCell();
    } else {
      insertFirstEmptyCell(keyCode);
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
    <div className="flex w-full h-full flex-col items-center justify-center z-10 bg-pink-light-1">
      <div className="z-40">
        <GameResultPopup
          show={showAnnouncement}
          config={isWon}
        ></GameResultPopup>
      </div>

      <div className="flex flex-row flex-wrap justify-center items-center w-full">
        {cells.map((cell, idx) => (
          <div
            key={idx}
            className={`flex justify-center items-center w-[13vw] h-[13vw] m-2 xs:w-14 xs:h-14 sm:w-20 sm:h-20 drop-shadow-md ${cellOuterClasses(
              cell.state
            )}`}
          >
            <input
              ref={(el) => (cellsRef.current[idx] = el)}
              type="text"
              className={`flex w-full h-full items-center justify-center text-center text-3xl font-semibold uppercase rounded-none ${cellInnerClasses(
                cell.state
              )}`}
              value={cell.value}
              maxLength={1}
              onChange={(e) => updateCellValue(idx, e.target.value)}
              onClick={(e) => onClickCell(idx)}
              readOnly
              onKeyDown={(e) => e.preventDefault()}
            />
          </div>
        ))}
      </div>

      <div className="w-full flex flex-col items-center mt-5 select-none justify-end fixed bottom-0 right-0 left-0">
        <div className="w-full flex justify-center mt-[5px]">
          {keyboard[0].map((keyCode) => (
            <button
              key={keyCode.value}
              className={`flex items-center justify-center h-16 w-8 rounded-md text-sm capitalize font-semibold mx-[3.5px] ${keyClasses(
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
              className={`flex items-center justify-center h-16 w-8 rounded-md text-sm capitalize font-semibold mx-[3.5px] ${keyClasses(
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
              className={`flex items-center justify-center h-16 ${
                keyCode.isWide ? "w-12" : "w-8"
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
