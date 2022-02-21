import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import ResponsiveAppBar from "../../../components/ResponsiveAppBar";
import Image from "next/image";
import keyboard from "../../../utils/initKeyboard";
import {
  EmptyBoardSkin,
  IBoardCell,
  IBoardSkin,
} from "../../../interfaces/BoardSkin";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import { getDocs, query, where } from "firebase/firestore";
import {
  boardSkinsCollection,
  dailyCollection,
  usersCollection,
} from "../../../firebase/clientApp";
import { validWords } from "../../../utils/english_words_original_wordle";
import { Fireworks } from "fireworks/lib/react";

//create your forceUpdate hook
const useForceUpdate = () => {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
};

const Game: NextPage = () => {
  const AuthUser = useAuthUser();
  const router = useRouter();
  const { mode } = router.query;
  const cellsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [cells, setCells] = useState<IBoardCell[]>([]);
  const [boardId, setBoardId] = useState<string>("");
  const [board, setBoard] = useState<IBoardSkin>(EmptyBoardSkin);
  const [wordOfTheDay, setWordOfTheDay] = useState<string>("intelligence");
  const [fireworkX, setFireworkX] = useState<number>(0);
  const [fireworkY, setFireworkY] = useState<number>(0);
  const [runFirework, setRunFirework] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const forceUpdate = useForceUpdate();
  const [practiceWord, setPracticeWord] = useState<string>(
    validWords[Math.floor(Math.random() * validWords.length)]
  );

  const isSolo = mode === "daily" || mode === "practice";

  useEffect(() => {
    const defaultData = Array(30)
      .fill(null)
      .map(() => createEmptyCell());
    setCells(defaultData);
  }, []);

  useEffect(() => {
    const dailyQuery = query(dailyCollection);

    getDocs(dailyQuery).then((querySnapshot) => {
      if (querySnapshot.docs.length === 0) {
        return;
      }

      querySnapshot.forEach((snapshot) => {
        const data = snapshot.data();
        setWordOfTheDay(data.word);
        return;
      });
    });
  }, []);

  useEffect(() => {
    const boardsQuery = query(boardSkinsCollection, where("id", "==", boardId));

    getDocs(boardsQuery).then((querySnapshot) => {
      if (querySnapshot.docs.length === 0) {
        return;
      }

      querySnapshot.forEach((snapshot) => {
        const data = snapshot.data();
        setBoard(data as IBoardSkin);
        return;
      });
    });
  }, [boardId]);

  useEffect(() => {
    const userQuery = query(usersCollection, where("id", "==", AuthUser.id));

    getDocs(userQuery).then((querySnapshot) => {
      if (querySnapshot.docs.length === 0) {
        return;
      }

      querySnapshot.forEach((snapshot) => {
        const data = snapshot.data();
        const boardId = data.board;
        setBoardId(boardId);
        return;
      });
    });
  }, [AuthUser.id]);

  const displayError = (message: string) => {
    const errorAlert = withReactContent(Swal);

    errorAlert
      .fire({
        title: "Error",
        text: message,
        icon: "error",
      })
      .then(() => {});
  };

  const displaySuccess = (message: string) => {
    const errorAlert = withReactContent(Swal);

    errorAlert
      .fire({
        title: "Success",
        text: message,
        icon: "success",
      })
      .then(() => {});
  };

  const createEmptyCell = (): IBoardCell => {
    const newCell: IBoardCell = {
      value: "",
      state: 0,
    };
    return newCell;
  };

  const updateCellValue = (cellIdx: number, value: string) => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    if (alphabet.indexOf(value.toLowerCase()) < 0) {
      displayError("Please use letters only");
      return;
    }

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

  const removeLastFilledCell = () => {
    let lastFilledCellIdx = -1;
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

  const getLatestNotCommittedLineIdx = (): number => {
    for (let i = 0; i < 6; i++) {
      if (cells[i * 5].state === 0) {
        return i;
      }
    }

    return 0;
  };

  const insertFirstEmptyCell = (value: string) => {
    let firstEmptyCellIdx = -1;
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].value) {
        firstEmptyCellIdx = i;
        break;
      }
    }

    let lineIdx = getLatestNotCommittedLineIdx();
    if (firstEmptyCellIdx >= lineIdx * 5 + 5) {
      displayError("You have to submit current line to move on");
      return;
    }

    updateCellValue(firstEmptyCellIdx, value);
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

  const startRevealingSequence = async (
    lineIdx: number,
    guessedWord: string
  ) => {
    // Clone
    const sourceOfTruth = mode === "daily" ? wordOfTheDay : practiceWord;
    const clone = JSON.parse(JSON.stringify(cells)) as IBoardCell[];

    for (let i = 0; i < 5; i++) {
      // Firework
      await startFirework(lineIdx * 5 + i);

      // Update
      if (guessedWord[i] === sourceOfTruth[i]) {
        clone[lineIdx * 5 + i].state = 3;
      } else if (sourceOfTruth.indexOf(guessedWord[i]) > -1) {
        clone[lineIdx * 5 + i].state = 2;
      } else {
        clone[lineIdx * 5 + i].state = 1;
      }
      setCells(clone);
    }

    forceUpdate();
    if (guessedWord === sourceOfTruth) {
      displaySuccess("Congratulations!");
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

    if (validWords.indexOf(guessedWord) < 0) {
      displayError(`${guessedWord.toUpperCase()} is not a valid word.`);
      return;
    }

    startRevealingSequence(lineIdx, guessedWord);
  };

  const onKeyBoardClick = (keyCode: string) => {
    if (finished) {
      return;
    }

    if (keyCode.toLowerCase() === "enter") {
      checkLastFilledLine();
    } else if (keyCode.toLowerCase() === "␡") {
      removeLastFilledCell();
    } else {
      insertFirstEmptyCell(keyCode);
    }
  };

  const getCellBorderWidth = (state: number) => {
    // 0: blank, 1: incorrect, 2: misplaced, 3: correct
    if (state === 0) {
      return board.blankBorderWidth;
    } else if (state === 1) {
      return board.wrongBorderWidth;
    } else if (state === 2) {
      return board.misplacedBorderWidth;
    } else if (state === 3) {
      return board.correctBorderWidth;
    }
  };

  const getCellBorderColor = (state: number) => {
    // 0: blank, 1: incorrect, 2: misplaced, 3: correct
    if (state === 0) {
      return board.blankBorderColor;
    } else if (state === 1) {
      return board.wrongBorderColor;
    } else if (state === 2) {
      return board.misplacedBorderColor;
    } else if (state === 3) {
      return board.correctBorderColor;
    }
  };

  const getCellBackgroundColor = (state: number) => {
    // 0: blank, 1: incorrect, 2: misplaced, 3: correct
    if (state === 0) {
      return board.blankBackgroundColor;
    } else if (state === 1) {
      return board.wrongBackgroundColor;
    } else if (state === 2) {
      return board.misplacedBackgroundColor;
    } else if (state === 3) {
      return board.correctBackgroundColor;
    }
  };

  const getCellTextColor = (state: number) => {
    // 0: blank, 1: incorrect, 2: misplaced, 3: correct
    if (state === 0) {
      return board.blankTextColor;
    } else if (state === 1) {
      return board.wrongTextColor;
    } else if (state === 2) {
      return board.misplacedTextColor;
    } else if (state === 3) {
      return board.correctTextColor;
    }
  };

  const getKeyState = (keyCode: string) => {
    let result = 0;
    cells.forEach((cell) => {
      if (cell.value.toLowerCase() === keyCode.toLowerCase()) {
        if (result < 3 && cell.state === 3) {
          result = cell.state;
        } else if (result < 2 && cell.state === 2) {
          result = cell.state;
        } else if (result < 1 && cell.state === 1) {
          result = cell.state;
        }
      }
    });

    return result;
  };

  const getKeyBorderWidth = (keyCode: string) => {
    // 0: blank, 1: incorrect, 2: misplaced, 3: correct
    const state = getKeyState(keyCode);

    if (state === 0) {
      return board.blankBorderWidth;
    } else if (state === 1) {
      return board.wrongBorderWidth;
    } else if (state === 2) {
      return board.misplacedBorderWidth;
    } else if (state === 3) {
      return board.correctBorderWidth;
    }
  };

  const getKeyBorderColor = (keyCode: string) => {
    // 0: blank, 1: incorrect, 2: misplaced, 3: correct
    const state = getKeyState(keyCode);

    if (state === 0) {
      return board.blankBorderColor;
    } else if (state === 1) {
      return board.wrongBorderColor;
    } else if (state === 2) {
      return board.misplacedBorderColor;
    } else if (state === 3) {
      return board.correctBorderColor;
    }
  };

  const getKeyBackgroundColor = (keyCode: string) => {
    // 0: blank, 1: incorrect, 2: misplaced, 3: correct
    const state = getKeyState(keyCode);

    if (state === 0) {
      return board.blankBackgroundColor;
    } else if (state === 1) {
      return board.wrongBackgroundColor;
    } else if (state === 2) {
      return board.misplacedBackgroundColor;
    } else if (state === 3) {
      return board.correctBackgroundColor;
    }
  };

  const getKeyTextColor = (keyCode: string) => {
    // 0: blank, 1: incorrect, 2: misplaced, 3: correct
    const state = getKeyState(keyCode);

    if (state === 0) {
      return board.blankTextColor;
    } else if (state === 1) {
      return board.wrongTextColor;
    } else if (state === 2) {
      return board.misplacedTextColor;
    } else if (state === 3) {
      return board.correctTextColor;
    }
  };

  return (
    <div className="relative flex w-screen h-screen flex-col items-center">
      <div className="z-50">
        <ResponsiveAppBar></ResponsiveAppBar>
      </div>

      <div className="flex w-full h-full flex-col items-center justify-center z-10 mt-12 bg-pink-light-1">
        {!isSolo && (
          <div className="w-full mb-5 px-5">
            <div className="w-full flex flex-row items-center justify-between">
              <div className="flex flex-row items-center">
                <div className="flex w-12 h-12 mr-3 relative">
                  <Image
                    src={"https://avatars.githubusercontent.com/u/42598512?v=4"}
                    alt="Quang's profile picture"
                    width={1000}
                    height={1000}
                    className="rounded-full"
                  ></Image>
                </div>
                <div className="-mt-6">
                  <span>⬛⬛⬛🟨⬛</span> <span>🟥⬛⬛⬛⬛</span>
                  <span>⬛🟨🟥⬛⬛</span> <span>🟨⬛⬛⬛⬛</span>
                  <span>🟥🟥🟥🟥🟥</span>
                </div>
              </div>

              <div className="flex flex-row items-center">
                <div className="-mt-6">
                  <span>⬛⬛⬛🟨⬛</span> <span>🟥⬛⬛⬛⬛</span>
                  <span>⬛🟨🟥⬛⬛</span> <span>🟨⬛⬛⬛⬛</span>
                  <span>🟥🟥🟥🟥🟥</span>
                </div>
                <div className="flex w-12 h-12 ml-3 relative">
                  <Image
                    src={"https://avatars.githubusercontent.com/u/42598512?v=4"}
                    alt="Quang's profile picture"
                    width={1000}
                    height={1000}
                    className="rounded-full"
                  ></Image>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-row flex-wrap justify-center items-center w-full">
          {cells.map((cell, idx) => (
            <div
              key={idx}
              className={`flex justify-center items-center w-[13vw] h-[13vw] m-2 ${getCellBorderWidth(
                cell.state
              )} ${getCellBorderColor(
                cell.state
              )} xs:w-14 xs:h-14 sm:w-20 sm:h-20`}
            >
              <input
                ref={(el) => (cellsRef.current[idx] = el)}
                type="text"
                className={`flex w-full h-full items-center justify-center text-center text-3xl font-semibold uppercase ${getCellBackgroundColor(
                  cell.state
                )} ${getCellTextColor(cell.state)}`}
                value={cell.value}
                maxLength={1}
                onChange={(e) => updateCellValue(idx, e.target.value)}
                onClick={(e) => onClickCell(idx)}
                readOnly={cell.state !== 0}
                onKeyDown={(e) => e.preventDefault()}
              />
            </div>
          ))}
        </div>

        <div className="w-full flex flex-col items-center my-5 select-none h-auto justify-end">
          <div className="w-full flex justify-center my-[5px]">
            {keyboard[0].map((keyCode) => (
              <div
                key={keyCode.value}
                className={`flex items-center justify-center h-10 xxs:h-14 w-[2rem] sm:w-10 rounded-md text-sm capitalize ${getKeyBorderWidth(
                  keyCode.value
                )} ${getKeyBorderColor(keyCode.value)} ${getKeyBackgroundColor(
                  keyCode.value
                )} ${getKeyTextColor(keyCode.value)} mx-[3.5px]`}
                onClick={() => onKeyBoardClick(keyCode.value)}
              >
                {keyCode.value}
              </div>
            ))}
          </div>
          <div className="w-full flex justify-center my-[5px]">
            {keyboard[1].map((keyCode) => (
              <div
                key={keyCode.value}
                className={`flex items-center justify-center h-10 xxs:h-14 w-[2rem] sm:w-10 rounded-md text-sm capitalize ${getKeyBorderWidth(
                  keyCode.value
                )} ${getKeyBorderColor(keyCode.value)} ${getKeyBackgroundColor(
                  keyCode.value
                )} ${getKeyTextColor(keyCode.value)} mx-[3.5px]`}
                onClick={() => onKeyBoardClick(keyCode.value)}
              >
                {keyCode.value}
              </div>
            ))}
          </div>
          <div className="w-full flex justify-center my-[5px]">
            {keyboard[2].map((keyCode) => (
              <div
                key={keyCode.value}
                className={`flex items-center justify-center h-10 xxs:h-14 ${
                  keyCode.isWide ? "w-12" : "w-[2rem]"
                } sm:w-10 rounded-md ${
                  keyCode.isBigText ? "text-xl" : "text-sm"
                } capitalize ${getKeyBorderWidth(
                  keyCode.value
                )} ${getKeyBorderColor(keyCode.value)} ${getKeyBackgroundColor(
                  keyCode.value
                )} ${getKeyTextColor(keyCode.value)} mx-[3.5px]`}
                onClick={() => onKeyBoardClick(keyCode.value)}
              >
                {keyCode.value}
              </div>
            ))}
          </div>
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

// Note that this is a higher-order function.
// export default withAuthUser()(Game);
export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})();

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Game);