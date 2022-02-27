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
import { updateRankStreak } from "../../../../firebase/streaks";
import {
  initializeUserInfo,
  updateUserPresence,
} from "../../../../firebase/users";
import { useRouter } from "next/router";
import { IRoom } from "../../../../interfaces/IRoom";
import { closeRoomIfWon, queryRoomDetail } from "../../../../firebase/rooms";
import { exitWaitRoom } from "../../../../firebase/waitRoom";
import AppBarLarge from "../../../../components/AppBarLarge";

const RankGame: NextPage = () => {
  const AuthUser = useAuthUser();
  const router = useRouter();
  const { id: roomId } = router.query;
  const [rankWord, setRankWord] = useState<string>("");

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
    if (!AuthUser.id) {
      return;
    }

    initializeUserInfo(AuthUser);
    exitWaitRoom(AuthUser.id);
  }, [AuthUser]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // HACK: remove both player from the queue
      const fetchData = async () => {
        const roomDetail = await queryRoomDetail(roomId as string);

        if (!roomDetail) {
          return;
        }
        await exitWaitRoom(roomDetail.side1);
        await exitWaitRoom(roomDetail.side2);
      };

      fetchData();
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [roomId]);

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
    await updateRankStreak(userId, won, roomDetail);
    await closeRoomIfWon(userId, won, roomDetail);
  };

  return (
    <div className="relative flex flex-1 w-screen h-full flex-col items-center">
      <div className="z-50 lg:hidden">
        <ResponsiveAppBar></ResponsiveAppBar>
      </div>

      <div className="z-50">
        <AppBarLarge></AppBarLarge>
      </div>

      {AuthUser.id && (
        <div className="flex w-full h-full flex-col items-center justify-center z-10 bg-pink-light-1 pt-12 lg:pl-36">
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
