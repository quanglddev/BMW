import { useEffect, useState } from "react";
import type { NextPage } from "next";
import ResponsiveAppBar from "../../../../components/ResponsiveAppBar";
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import Playground from "../../../../components/Playground";
import {
  updatePracticeStreak,
  updateRankStreak,
} from "../../../../firebase/streaks";
import { initializeUserInfo } from "../../../../firebase/users";
import { generateNewPracticeWordIfEmpty } from "../../../../firebase/board";
import { useRouter } from "next/router";
import { onSnapshot, query, where } from "firebase/firestore";
import { roomsCollection } from "../../../../firebase/clientApp";
import { IRoom } from "../../../../interfaces/IRoom";
import { closeRoomIfWon, queryRoomDetail } from "../../../../firebase/rooms";

const RankGame: NextPage = () => {
  const AuthUser = useAuthUser();
  const router = useRouter();
  const { id: roomId } = router.query;
  const [rankWord, setRankWord] = useState<string>("");

  useEffect(() => {
    if (!AuthUser.id) {
      return;
    }

    initializeUserInfo(AuthUser);
  }, [AuthUser]);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchData = async () => {
      if (!AuthUser.id) {
        return;
      }

      if (!roomId) {
        return;
      }

      const room = await queryRoomDetail(roomId as string);
      if (!room) {
        return;
      }
      setRankWord(room.word);
    };

    fetchData();
  }, [router.isReady, AuthUser.id, roomId]);

  const onFinished = async (
    userId: string,
    won: boolean,
    roomDetail: IRoom | undefined
  ) => {
    if (!roomDetail) {
      return;
    }
    updateRankStreak(userId, won, roomDetail);
    closeRoomIfWon(userId, won, roomDetail);
  };

  return (
    <div className="relative flex flex-1 w-screen h-full flex-col items-center">
      <div className="z-50">
        <ResponsiveAppBar></ResponsiveAppBar>
      </div>

      {AuthUser.id && (
        <div className="flex w-full h-full flex-col items-center justify-center z-10 bg-pink-light-1 pt-12">
          <Playground
            userId={AuthUser.id}
            word={rankWord}
            mode="rank"
            roomId={roomId as string}
            onFinished={(userId, won, roomDetail) =>
              onFinished(userId, won, roomDetail)
            }
          ></Playground>
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
})(RankGame);
