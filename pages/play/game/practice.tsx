import { useEffect, useState } from "react";
import type { NextPage } from "next";
import ResponsiveAppBar from "../../../components/ResponsiveAppBar";
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import { puzzleWords } from "../../../utils/puzzleWords";
import Playground from "../../../components/Playground";
import { updatePracticeStreak } from "../../../firebase/streaks";
import { initializeUserInfo } from "../../../firebase/users";

const PracticeGame: NextPage = () => {
  const AuthUser = useAuthUser();
  const [practiceWord, setPracticeWord] = useState<string>(
    puzzleWords[Math.floor(Math.random() * puzzleWords.length)]
  );

  useEffect(() => {
    if (!AuthUser.id) {
      return;
    }

    initializeUserInfo(AuthUser);
  }, [AuthUser]);

  const onFinished = (userId: string, won: boolean) => {
    updatePracticeStreak(userId, won);
    setPracticeWord(
      puzzleWords[Math.floor(Math.random() * puzzleWords.length)]
    );
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
