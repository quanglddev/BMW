import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { gamesCollection } from "../../firebase/clientApp";
import { query, onSnapshot } from "@firebase/firestore";
import ResponsiveAppBar from "../../components/ResponsiveAppBar";
import Muscle from "../public/icons/muscle.svg";
import Wifi from "../public/icons/wifi.svg";
import Friends from "../public/icons/friends.svg";
import Today from "../../public/icons/today2.svg";
import Game from "../../interfaces/IGame";
import { useRouter } from "next/router";
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import {
  initializeUserInfo,
  queryGroupByIds,
  queryUser,
} from "../../firebase/users";
import { exitWaitRoom } from "../../firebase/waitRoom";
import IUser from "../../interfaces/IUser";
import { getAllUserIdsFromRooms, queryAllRooms } from "../../firebase/rooms";
import { IRoom } from "../../interfaces/IRoom";

const Stats: NextPage = () => {
  const AuthUser = useAuthUser();
  const router = useRouter();
  const [user, setUser] = useState<IUser | undefined>();
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [allPeople, setAllPeople] = useState<IUser[]>([]);

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

      const user = await queryUser(AuthUser.id);
      setUser(user);

      const rooms = await queryAllRooms(AuthUser.id);
      setRooms(rooms);

      const ids = getAllUserIdsFromRooms(rooms);
      const allPeople = await queryGroupByIds(ids);
      setAllPeople(allPeople);
    };

    fetchData();
  }, [AuthUser.id]);

  const userIdToEmail = (userId: string): string => {
    const foundUser = allPeople.find((person) => person.id === userId);

    if (!foundUser) {
      return "";
    }

    return foundUser.email;
  };

  return (
    <div className="relative flex w-screen h-full flex-col items-center">
      <div className="z-50">
        <ResponsiveAppBar></ResponsiveAppBar>
      </div>

      {user && (
        <div className="flex w-full h-full flex-col items-center z-10 mt-12 bg-pink-light-1">
          <div className="flex flex-row w-full h-24">
            <div className="flex flex-col items-center justify-center w-1/3 bg-white h-full">
              <div className="text-3xl">{user.longestDailyStreak}</div>
              <div className="text-sm">Highest Daily</div>
            </div>
            <div className="flex flex-col items-center justify-center w-1/3 bg-gray-dark h-full">
              <div className="text-3xl text-white">
                {user.longestPracticeStreak}
              </div>
              <div className="text-sm text-white">Highest Practice</div>
            </div>
            <div className="flex flex-col items-center justify-center w-1/3 bg-white h-full">
              <div className="text-3xl">{user.longestRankStreak}</div>
              <div className="text-sm">Highest Rank</div>
            </div>
          </div>
          <div className="flex flex-row w-full h-24">
            <div className="flex flex-col items-center justify-center w-1/3 bg-gray-dark h-full">
              <div className="text-3xl text-white">
                {user.currentDailyStreak}
              </div>
              <div className="text-sm text-white">Current Daily</div>
            </div>
            <div className="flex flex-col items-center justify-center w-1/3 bg-white h-full">
              <div className="text-3xl">{user.currentPracticeStreak}</div>
              <div className="text-sm">Current Practice</div>
            </div>
            <div className="flex flex-col items-center justify-center w-1/3 bg-gray-dark h-full">
              <div className="text-3xl text-white">
                {user.currentRankStreak}
              </div>
              <div className="text-sm text-white">Current Rank</div>
            </div>
          </div>

          <div className="flex flex-col w-full mt-5">
            <div className="text-lg mx-3">Completed Rank Games</div>
            <table className="w-full mt-2">
              <thead className="w-full bg-red-dark-99">
                <tr className="w-full border-b-2 border-red-dark-99">
                  <th className="pl-3 text-left w-10/12 text-white">Players</th>
                  <th className="text-center w-10/12 text-white">Result</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr
                    key={room.id}
                    className="w-full border-b-2 border-red-dark-99"
                  >
                    <td className="flex flex-col justify-center ml-3 w-10/12 h-24">
                      <div>{userIdToEmail(room.side1)}</div>
                      <div>⚔️</div>
                      <div>{userIdToEmail(room.side2)}</div>
                    </td>
                    <td className="text-center text-xl">
                      {room.winner === user.id ? "✅" : "❌"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Note that this is a higher-order function.
export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})();

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Stats);

// export default Home;
