import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import ResponsiveAppBar from "../../../components/ResponsiveAppBar";
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import {
  EmptyDailyPuzzle,
  IDailyPuzzle,
} from "../../../interfaces/IDailyPuzzle";
import { queryDailyWord } from "../../../firebase/daily";
import { initializeUserInfo, queryUser } from "../../../firebase/users";
import Playground from "../../../components/Playground";
import { AnnouncementStatus } from "../../../interfaces/IAnnouncement";
import { updateDailyStreak } from "../../../firebase/streaks";

const DailyGame: NextPage = () => {
  const AuthUser = useAuthUser();
  const router = useRouter();
  const [dailyWord, setDailyWord] = useState<IDailyPuzzle>(EmptyDailyPuzzle);
  const [dailyCompleted, setDailyCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (!AuthUser.id) {
      return;
    }

    initializeUserInfo(AuthUser);
  }, [AuthUser]);

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

      {AuthUser.id && (
        <div className="flex w-full h-full flex-col items-center justify-center z-10 bg-pink-light-1 pt-12">
          <Playground
            userId={AuthUser.id}
            word={dailyWord.word}
            mode="daily"
            defaultShowAnnouncement={dailyCompleted}
            defaultAnnouncementConfig={{
              userId: AuthUser.id,
              status: AnnouncementStatus.success,
              title: "Daily Completed",
              message: `The word is ${dailyWord.word.toUpperCase()}`,
              buttonText: "Go To Practice",
              onMainButtonClick: () => {
                router.push("/play/game/practice");
              },
              onClose: () => {
                router.push("/");
              },
            }}
            onFinished={updateDailyStreak}
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
})(DailyGame);
