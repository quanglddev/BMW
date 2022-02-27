import { useEffect, useState } from "react";
import type { NextPage } from "next";
import ResponsiveAppBar from "../../../../components/ResponsiveAppBar";
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import {
  EmptyBoardSkin,
  IBoardCell,
  IBoardSkin,
} from "../../../../interfaces/IBoardSkin";
import { queryBoardSkin } from "../../../../firebase/boardSkins";
import {
  firebaseDataToUser,
  queryUser,
  updateUserPresence,
} from "../../../../firebase/users";
import BoardSkinManager from "../../../../models/BoardSkinManager";
import LoadingPopup from "../../../../components/LoadingPopup";
import {
  createJointFriendRoom,
  exitWaitRoom,
  joinWaitRoom,
  removeRankRoomId,
} from "../../../../firebase/waitRoom";
import { onSnapshot, query, where } from "firebase/firestore";
import {
  usersCollection,
  waitRoomCollection,
} from "../../../../firebase/clientApp";
import { useRouter } from "next/router";
import Close from "../../../../public/icons/close.svg";
import AppBarLarge from "../../../../components/AppBarLarge";

const FriendlyMatchmaking: NextPage = () => {
  const AuthUser = useAuthUser();
  const router = useRouter();
  const [boardSkin, setBoardSkin] = useState<IBoardSkin>(EmptyBoardSkin);
  const [cells, setCells] = useState<IBoardCell[]>([]);
  const [boardSkinManager, setBoardSkinManager] =
    useState<BoardSkinManager | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!AuthUser.id) {
        return;
      }

      updateUserPresence(AuthUser.id);
    }, 15 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [AuthUser.id]);

  useEffect(() => {
    const waitRoomQuery = query(waitRoomCollection);

    const unsubscribe = onSnapshot(waitRoomQuery, async (querySnapshot) => {
      if (!AuthUser.id) {
        return;
      }

      if (querySnapshot.docs.length === 0) {
        return [];
      }

      const data = querySnapshot.docs[0].data();
      const ids = data.ids as string[];

      const user = await queryUser(AuthUser.id);

      if (user && user.rankRoomId) {
        removeRankRoomId(user);
        router.push(`/play/game/friendly/${user.rankRoomId}`);
      }

      if (!ids || ids.length === 0) {
        await joinWaitRoom(AuthUser.id);
      }

      let cloneIds = [...ids];
      cloneIds = cloneIds.filter((id) => id !== AuthUser.id);

      if (cloneIds.length > 0) {
        const roomId = await createJointFriendRoom(AuthUser.id, cloneIds);
        if (!roomId) {
          return;
        }

        router.push(`/play/game/friendly/${roomId}`);
      }
    });

    return () => {
      unsubscribe();

      if (!AuthUser.id) {
        return;
      }

      exitWaitRoom(AuthUser.id);
    };
  }, [AuthUser.id, router]);

  useEffect(() => {
    const userQuery = query(usersCollection, where("id", "==", AuthUser.id));

    const unsubscribe = onSnapshot(userQuery, async (querySnapshot) => {
      if (!AuthUser.id) {
        return;
      }

      if (querySnapshot.docs.length === 0) {
        return [];
      }

      const data = querySnapshot.docs[0].data();

      const user = firebaseDataToUser(data);

      if (user && user.rankRoomId) {
        removeRankRoomId(user);
        router.push(`/play/game/friendly/${user.rankRoomId}`);
      }
    });

    return () => {
      unsubscribe();

      if (!AuthUser.id) {
        return;
      }

      exitWaitRoom(AuthUser.id);
    };
  }, [AuthUser.id, router]);

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

      const randomCells = Array(30)
        .fill(null)
        .map(() => getRandomCell());
      setCells(randomCells);
      setBoardSkinManager(new BoardSkinManager(randomCells, boardSkin));
    };

    fetchData();
  }, [AuthUser.id]);

  const onCancelMatchmaking = async (userId: string) => {
    await exitWaitRoom(userId);
    router.push("/");
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

  return (
    <div className="relative flex flex-1 w-screen h-screen flex-col items-center">
      <div className="z-50 lg:hidden">
        <ResponsiveAppBar></ResponsiveAppBar>
      </div>

      <div className="z-50">
        <AppBarLarge></AppBarLarge>
      </div>

      <div className="z-40">
        <LoadingPopup></LoadingPopup>
      </div>

      {AuthUser.id && (
        <div className="flex w-full h-full flex-col items-center justify-center z-10 bg-pink-light-1 pt-12 lg:pl-36">
          <div className="flex flex-row w-full h-full justify-center items-center mt-3">
            <div className="flex flex-row flex-wrap justify-center items-center w-full">
              {cells.map((cell, idx) => (
                <div
                  key={idx}
                  className={`flex justify-center items-center w-[13vw] h-[13vw] m-2 xs:w-14 xs:h-14 sm:w-20 sm:h-20 drop-shadow-md ${cellOuterClasses(
                    cell.state
                  )}`}
                >
                  <input
                    type="text"
                    className={`flex w-full h-full items-center justify-center text-center text-3xl font-semibold uppercase rounded-none ${cellInnerClasses(
                      cell.state
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
      )}

      {AuthUser.id && (
        <div className="flex items-center justify-center w-full h-12 bg-white z-50 fixed bottom-0 right-0 left-0">
          <button
            className="w-8 h-8"
            onClick={() => onCancelMatchmaking(AuthUser.id!)}
          >
            <Close className="fill-current w-full h-full text-red-dark-99"></Close>
          </button>
        </div>
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
})(FriendlyMatchmaking);
