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
import {
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  boardSkinsCollection,
  dailyCollection,
  firestore,
  usersCollection,
} from "../../../firebase/clientApp";
import { puzzleWords } from "../../../utils/puzzleWords";
import { validEnglishWords } from "../../../utils/validEnglishWords";
import { Fireworks } from "fireworks/lib/react";
import GameResultPopup from "../../../components/GameResultPopup";
import {
  EmptyDailyPuzzle,
  IDailyPuzzle,
} from "../../../interfaces/IDailyPuzzle";
import { queryDailyWord } from "../../../firebase/daily";
import { queryUser } from "../../../firebase/users";

const DailyGame: NextPage = () => {
  const AuthUser = useAuthUser();
  const router = useRouter();
  const [dailyWord, setDailyWord] = useState<IDailyPuzzle>(EmptyDailyPuzzle);
  const [showAnnouncement, setShowAnnouncement] = useState<boolean>(false);
  const [dailyCompleted, setDailyCompleted] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!AuthUser.id) {
        return;
      }

      const loadedDailyWord = await queryDailyWord();

      if (!loadedDailyWord) {
        return;
      }

      setDailyWord(loadedDailyWord);

      const user = await queryUser(AuthUser.id);

      if (!user) {
        return;
      }

      if (
        user.dailyPuzzleCompleted.getFullYear() ===
          loadedDailyWord.lastUpdated.getFullYear() &&
        user.dailyPuzzleCompleted.getMonth() ===
          loadedDailyWord.lastUpdated.getMonth() &&
        user.dailyPuzzleCompleted.getDate() ===
          loadedDailyWord.lastUpdated.getDate()
      ) {
        setDailyCompleted(true);
      }
    };

    fetchData();
  }, [AuthUser.id]);

  return (
    <div className="relative flex flex-1 w-screen h-full flex-col items-center">
      <div className="z-50">
        <ResponsiveAppBar></ResponsiveAppBar>
      </div>
      <div className="z-40">
        <GameResultPopup
          show={showAnnouncement}
          isVictory={isWon}
          stats={stats}
          setShow={setShowAnnouncement}
          message={message}
          title={title}
          reset={resetGame}
        ></GameResultPopup>
      </div>

      <div className="flex w-full h-full flex-col items-center justify-center z-10 pt-12 bg-pink-light-1">
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
              )} xs:w-14 xs:h-14 sm:w-20 sm:h-20 drop-shadow-md`}
            >
              <input
                ref={(el) => (cellsRef.current[idx] = el)}
                type="text"
                className={`flex w-full h-full items-center justify-center text-center text-3xl font-semibold uppercase rounded-none ${getCellBackgroundColor(
                  cell.state
                )} ${getCellTextColor(cell.state)}`}
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
                className={`flex items-center justify-center h-16 w-8 rounded-md text-sm capitalize font-semibold ${getKeyBorderWidth(
                  keyCode.value
                )} ${getKeyBorderColor(keyCode.value)} ${getKeyBackgroundColor(
                  keyCode.value
                )} ${getKeyTextColor(keyCode.value)} mx-[3.5px]`}
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
                className={`flex items-center justify-center h-16 w-8 rounded-md text-sm capitalize font-semibold ${getKeyBorderWidth(
                  keyCode.value
                )} ${getKeyBorderColor(keyCode.value)} ${getKeyBackgroundColor(
                  keyCode.value
                )} ${getKeyTextColor(keyCode.value)} mx-[3.5px]`}
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
                } capitalize font-semibold ${getKeyBorderWidth(
                  keyCode.value
                )} ${getKeyBorderColor(keyCode.value)} ${getKeyBackgroundColor(
                  keyCode.value
                )} ${getKeyTextColor(keyCode.value)} mx-[3.5px]`}
                onClick={() => onKeyBoardClick(keyCode.value)}
              >
                {keyCode.value}
              </button>
            ))}
          </div>
        </div>
      </div>
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
})(DailyGame);
