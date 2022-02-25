import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { gamesCollection } from "../firebase/clientApp";
import { query, onSnapshot } from "@firebase/firestore";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import Muscle from "../public/icons/muscle.svg";
import Wifi from "../public/icons/wifi.svg";
import Friends from "../public/icons/friends.svg";
import Today from "../public/icons/today2.svg";
import Game from "../interfaces/IGame";
import { useRouter } from "next/router";
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import { initializeUserInfo } from "../firebase/users";
import { exitWaitRoom } from "../firebase/waitRoom";

const Home: NextPage = () => {
  const AuthUser = useAuthUser();
  const router = useRouter();
  const [allGames, setAllGames] = useState<Game[]>([]);

  useEffect(() => {
    if (!AuthUser.id) {
      return;
    }

    initializeUserInfo(AuthUser);
    exitWaitRoom(AuthUser.id);
  }, [AuthUser]);

  useEffect(() => {
    const gamesQuery = query(gamesCollection);

    const unsubscribeUser = onSnapshot(
      gamesQuery,
      { includeMetadataChanges: true },
      (querySnapshot) => {
        const result: Game[] = [];

        querySnapshot.forEach((snapshot) => {
          const newGame = snapshot.data() as Game;
          result.push(newGame);
        });

        setAllGames(result);
      }
    );

    return () => {
      unsubscribeUser();
    };
  }, []);

  const currentGames = allGames.filter((game) => !game.ended);

  return (
    <div className="relative flex w-screen h-full flex-col items-center">
      <div className="z-50">
        <ResponsiveAppBar></ResponsiveAppBar>
      </div>

      <div className="flex w-full h-full flex-col items-center z-10 mt-12 bg-pink-light-1">
        <div className="text-black font-semibold text-4xl mx-16 text-center -mt-8">
          <span>Play Wordle</span> <span>for Free</span>{" "}
          <span>on the #1 Site!</span>
        </div>
        <div className="flex flex-row items-center mt-3 text-sm">
          <div className="font-bold text-red-dark-99 text-lg">
            {allGames.length}
          </div>
          <div className="text-gray-600 ml-2">Games Played</div>
        </div>
        <div className="flex flex-row items-center text-sm">
          <div className="font-bold text-lg text-red-dark-99">
            {currentGames.length}
          </div>
          <div className="text-gray-600 ml-2">Playing Now</div>
        </div>

        {/* Daily */}
        <button
          className="flex flex-row w-10/12 h-24 bg-red-dark-99 rounded-xl mt-5 items-center border-b-4 border-red-800 drop-shadow-2xl"
          onClick={() => router.push("/play/game/daily")}
        >
          <Today className="w-16 h-16 ml-3"></Today>
          <div className="flex flex-col ml-3">
            <div className="font-bold text-white text-xl text-left">
              Daily Puzzle
            </div>
            <div className="text-gray-100 text-xs mt-1 text-left">
              The key to success is consistency
            </div>
          </div>
        </button>

        {/* Muscle */}
        <button
          className="flex flex-row w-10/12 h-24 bg-pink-light-1 rounded-xl mt-5 items-center border-b-4 border-gray-500 drop-shadow-2xl"
          onClick={() => router.push("/play/game/practice")}
        >
          <Muscle className="fill-current w-16 h-16 ml-3"></Muscle>
          <div className="flex flex-col ml-3">
            <div className="font-bold text-gray-700 text-xl text-left">
              Practice
            </div>
            <div className="text-gray-500 text-xs mt-1 text-left">
              Practice makes perfect
            </div>
          </div>
        </button>

        {/* Wifi */}
        <button
          className="flex flex-row w-10/12 h-24 bg-pink-light-1 rounded-xl mt-5 items-center border-b-4 border-gray-500 drop-shadow-2xl"
          onClick={() => router.push("/play/game/rank")}
        >
          <Wifi className="fill-current w-16 h-16 ml-3"></Wifi>
          <div className="flex flex-col ml-3">
            <div className="font-bold text-gray-700 text-xl text-left">
              Rank Match
            </div>
            <div className="text-gray-500 text-xs mt-1 text-left">
              Play with someone at your level
            </div>
          </div>
        </button>

        {/* Friends */}
        <button className="flex flex-row w-10/12 h-24 bg-pink-light-1 rounded-xl mt-5 items-center border-b-4 border-gray-500 drop-shadow-2xl">
          <Friends className="fill-current w-16 h-16 ml-3"></Friends>
          <div className="flex flex-col ml-3">
            <div className="font-bold text-gray-700 text-xl text-left">
              Friendly Match
            </div>
            <div className="text-gray-500 text-xs mt-1 text-left">
              Play with your friends
            </div>
          </div>
        </button>
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
})(Home);

// export default Home;
