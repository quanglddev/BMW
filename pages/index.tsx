import { useEffect, useState } from "react";
import type { NextPage } from "next";
import {
  firestore,
  gamesCollection,
  usersCollection,
} from "../firebase/clientApp";
import {
  collection,
  QueryDocumentSnapshot,
  DocumentData,
  query,
  where,
  limit,
  getDocs,
  onSnapshot,
} from "@firebase/firestore";

import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import Bluetooth from "../public/icons/bluetooth.svg";
import Wifi from "../public/icons/wifi.svg";
import Friends from "../public/icons/friends.svg";
import Today from "../public/icons/today2.svg";
import Game from "../interfaces/Game";

const Home: NextPage = () => {
  const [allGames, setAllGames] = useState<Game[]>([]);
  // const AuthUser = useAuthUser();
  // const [friends, setFriends] = useState<QueryDocumentSnapshot<DocumentData>[]>(
  //   []
  // );
  // const [loading, setLoading] = useState<boolean>(true);

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
    <div className="relative flex w-screen h-screen flex-col items-center">
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
        <div className="flex flex-row w-10/12 h-24 bg-red-dark-99 rounded-xl mt-5 items-center border-b-4 border-red-800 drop-shadow-2xl">
          <Today className="w-16 h-16 ml-3"></Today>
          <div className="flex flex-col ml-3">
            <div className="font-bold text-white text-xl">Daily Puzzle</div>
            <div className="text-gray-100 text-xs mt-1">
              Consistency is more important than perfection
            </div>
          </div>
        </div>

        {/* Bluetooth */}
        <div className="flex flex-row w-10/12 h-24 bg-pink-light-1 rounded-xl mt-5 items-center border-b-4 border-gray-500 drop-shadow-2xl">
          <Bluetooth className="fill-current w-16 h-16 ml-3"></Bluetooth>
          <div className="flex flex-col ml-3">
            <div className="font-bold text-gray-700 text-xl">Local Match</div>
            <div className="text-gray-500 text-xs mt-1">
              Play with someone near you
            </div>
          </div>
        </div>

        {/* Wifi */}
        <div className="flex flex-row w-10/12 h-24 bg-pink-light-1 rounded-xl mt-5 items-center border-b-4 border-gray-500 drop-shadow-2xl">
          <Wifi className="fill-current w-16 h-16 ml-3"></Wifi>
          <div className="flex flex-col ml-3">
            <div className="font-bold text-gray-700 text-xl">Rank Match</div>
            <div className="text-gray-500 text-xs mt-1">
              Play with someone at your level
            </div>
          </div>
        </div>

        {/* Friends */}
        <div className="flex flex-row w-10/12 h-24 bg-pink-light-1 rounded-xl mt-5 items-center border-b-4 border-gray-500 drop-shadow-2xl">
          <Friends className="fill-current w-16 h-16 ml-3"></Friends>
          <div className="flex flex-col ml-3">
            <div className="font-bold text-gray-700 text-xl">
              Friendly Match
            </div>
            <div className="text-gray-500 text-xs mt-1">
              Play with your friends
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// // Note that this is a higher-order function.
export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})();

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);

// export default Home;
