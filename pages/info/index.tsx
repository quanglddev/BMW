import { useEffect, useState } from "react";
import type { NextPage } from "next";
import ResponsiveAppBar from "../../components/ResponsiveAppBar";
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import AppBarLarge from "../../components/AppBarLarge";
import {
  EmptyBoardSkin,
  IBoardCell,
  IBoardSkin,
} from "../../interfaces/IBoardSkin";
import BoardSkinManager from "../../models/BoardSkinManager";
import { queryUser } from "../../firebase/users";
import { queryBoardSkin } from "../../firebase/boardSkins";

const Info: NextPage = () => {
  const AuthUser = useAuthUser();
  const [boardSkin, setBoardSkin] = useState<IBoardSkin>(EmptyBoardSkin);
  const [cells, setCells] = useState<IBoardCell[]>([]);
  const [boardSkinManager, setBoardSkinManager] =
    useState<BoardSkinManager | null>(null);

  const getRandomCell = (): IBoardCell => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    const randomCharacter =
      alphabet[Math.floor(Math.random() * alphabet.length)];

    const newCell: IBoardCell = {
      value: randomCharacter,
      state: Math.floor(Math.random() * 4),
    };
    return newCell;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!AuthUser.id) {
        return;
      }

      const user = await queryUser(AuthUser.id);

      if (!user) {
        return;
      }

      const boardId = user.board;
      const boardSkin = await queryBoardSkin(boardId);

      if (!boardSkin) {
        return;
      }

      setBoardSkin(boardSkin);

      const randomCells = Array(5)
        .fill(null)
        .map(() => getRandomCell());
      setCells(randomCells);
      setBoardSkinManager(new BoardSkinManager(randomCells, boardSkin));
    };

    fetchData();
  }, [AuthUser.id]);

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

  return (
    <div className="relative flex w-full h-full flex-col items-center">
      <div className="z-50 lg:hidden">
        <ResponsiveAppBar></ResponsiveAppBar>
      </div>

      <div className="z-50">
        <AppBarLarge></AppBarLarge>
      </div>

      <div className="flex w-full h-full flex-col items-center z-10 mt-12 bg-pink-light-1 lg:pl-36 lg:mt-0 max-w-3xl">
        <div className="text-black w-full mt-3 mx-3 px-3">
          Guess the WORDLE in six tries.
        </div>
        <div className="text-black w-full mt-3 mx-3 px-3">
          Each guess must be a valid five-letter word. Hit the enter button to
          submit.
        </div>
        <div className="text-black w-full mt-3 mx-3 px-3">
          After each guess, the color of the tiles will change to show how close
          your guess to the word.
        </div>
        <div className="text-black text-lg font-semibold w-full mt-3 mx-3 px-3">
          Examples
        </div>

        {AuthUser.id && (
          <div className="flex flex-col justify-center items-center w-full">
            <div className="flex w-full flex-col items-center justify-center z-10 bg-pink-light-1 lg:pl-36">
              <div className="flex flex-row w-full h-full justify-center items-center mt-3">
                <div className="flex flex-row flex-wrap justify-center items-center w-full">
                  {cells.map((cell, idx) => (
                    <div
                      key={idx}
                      className={`flex justify-center items-center w-[13vw] h-[13vw] m-2 xs:w-14 xs:h-14 sm:w-20 sm:h-20 drop-shadow-md ${cellOuterClasses(
                        idx === 0 ? 3 : 0
                      )}`}
                    >
                      <input
                        type="text"
                        className={`flex w-full h-full items-center justify-center text-center text-3xl font-semibold uppercase rounded-none ${cellInnerClasses(
                          idx === 0 ? 3 : 0
                        )}`}
                        value={cell.value}
                        maxLength={1}
                        readOnly
                        onKeyDown={(e) => e.preventDefault()}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              The letter{" "}
              <div className="inline font-bold">
                {cells.length > 0 ? cells[0].value.toUpperCase() : ""}
              </div>{" "}
              is in the word and in correct spot.
            </div>

            <div className="flex w-full flex-col items-center justify-center z-10 bg-pink-light-1 lg:pl-36">
              <div className="flex flex-row w-full h-full justify-center items-center mt-3">
                <div className="flex flex-row flex-wrap justify-center items-center w-full">
                  {cells.map((cell, idx) => (
                    <div
                      key={idx}
                      className={`flex justify-center items-center w-[13vw] h-[13vw] m-2 xs:w-14 xs:h-14 sm:w-20 sm:h-20 drop-shadow-md ${cellOuterClasses(
                        idx === 0 ? 2 : 0
                      )}`}
                    >
                      <input
                        type="text"
                        className={`flex w-full h-full items-center justify-center text-center text-3xl font-semibold uppercase rounded-none ${cellInnerClasses(
                          idx === 0 ? 2 : 0
                        )}`}
                        value={cell.value}
                        maxLength={1}
                        readOnly
                        onKeyDown={(e) => e.preventDefault()}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              The letter{" "}
              <div className="inline font-bold">
                {cells.length > 0 ? cells[0].value.toUpperCase() : ""}
              </div>{" "}
              is in the word but in wrong spot.
            </div>

            <div className="flex w-full flex-col items-center justify-center z-10 bg-pink-light-1 lg:pl-36">
              <div className="flex flex-row w-full h-full justify-center items-center mt-3">
                <div className="flex flex-row flex-wrap justify-center items-center w-full">
                  {cells.map((cell, idx) => (
                    <div
                      key={idx}
                      className={`flex justify-center items-center w-[13vw] h-[13vw] m-2 xs:w-14 xs:h-14 sm:w-20 sm:h-20 drop-shadow-md ${cellOuterClasses(
                        idx === 0 ? 1 : 0
                      )}`}
                    >
                      <input
                        type="text"
                        className={`flex w-full h-full items-center justify-center text-center text-3xl font-semibold uppercase rounded-none ${cellInnerClasses(
                          idx === 0 ? 1 : 0
                        )}`}
                        value={cell.value}
                        maxLength={1}
                        readOnly
                        onKeyDown={(e) => e.preventDefault()}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              The letter{" "}
              <div className="inline font-bold">
                {cells.length > 0 ? cells[0].value.toUpperCase() : ""}
              </div>{" "}
              is not in the word.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Note that this is a higher-order function.
export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})();

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Info);

// export default Home;
