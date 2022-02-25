import { useEffect, useState } from "react";
import type { NextPage } from "next";
import ResponsiveAppBar from "../../../components/ResponsiveAppBar";
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import Playground from "../../../components/Playground";
import { updatePracticeStreak } from "../../../firebase/streaks";
import { initializeUserInfo } from "../../../firebase/users";
import { generateNewPracticeWordIfEmpty } from "../../../firebase/board";
import { exitWaitRoom } from "../../../firebase/waitRoom";

const PracticeGame: NextPage = () => {
  const AuthUser = useAuthUser();
  const [practiceWord, setPracticeWord] = useState<string>("");

  useEffect(() => {
    if (!AuthUser.id) {
      return;
    }

    initializeUserInfo(AuthUser);
    exitWaitRoom(AuthUser.id);
  }, [AuthUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (!AuthUser.id) {
        return;
      }
      const newWord = await generateNewPracticeWordIfEmpty(AuthUser.id);
      setPracticeWord(newWord);
    };

    fetchData();
  }, [AuthUser.id]);

  const onFinished = async (userId: string, won: boolean) => {
    updatePracticeStreak(userId, won);
    const newWord = await generateNewPracticeWordIfEmpty(userId, true);
    setPracticeWord(newWord);
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
            word={practiceWord}
            mode="practice"
            onFinished={(userId, won) => onFinished(userId, won)}
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
})(PracticeGame);
