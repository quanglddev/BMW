/* eslint-disable @next/next/no-img-element */
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Logo from "../public/icons/logo.svg";
import Hamburger from "../public/icons/hamburger.svg";
import Close from "../public/icons/close.svg";
import Muscle from "../public/icons/muscle.svg";
import Wifi from "../public/icons/wifi.svg";
import Friends from "../public/icons/friends.svg";
import AddFriend from "../public/icons/addFriend.svg";
import LogOut from "../public/icons/logout.svg";
import Settings from "../public/icons/settings.svg";
import Help from "../public/icons/help.svg";
import Today from "../public/icons/today.svg";
import Circle from "../public/icons/circle.svg";
import { getDocs, query, where } from "firebase/firestore";
import { usersCollection } from "../firebase/clientApp";
import IUser from "../interfaces/User";
import { useAuthUser, withAuthUser } from "next-firebase-auth";

interface Props {
  show: boolean;
  isVictory: boolean;
  stats: [number, number, number, number, number, number];
  setShow: Dispatch<SetStateAction<boolean>>;
  message: string;
  title: string;
  reset: () => void;
}

const GameResultPopup = (props: Props) => {
  const { show, isVictory, stats, setShow, message, title, reset } = props;
  const longestDailyStreak = stats[0];
  const longestPracticeStreak = stats[1];
  const longestRankStreak = stats[2];
  const currentDailyStreak = stats[3];
  const currentPracticeStreak = stats[4];
  const currentRankStreak = stats[5];
  const router = useRouter();

  const onNavigateTo = (path: string) => {
    router.push(path);
    setShow(false);
    if (path === "/play/game/practice") {
      reset();
    }
  };

  return (
    <div className="flex flex-row items-center fixed top-0 left-0 right-0 bg-red-dark-99 h-12">
      {/* Side Bar */}
      <div
        className={`${
          show ? "flex" : "hidden"
        } flex fixed top-0 left-0 right-0 bottom-0 w-full h-full z-50 flex-row`}
      >
        <div className="flex w-full h-full bg-black opacity-50 absolute top-0 left-0 right-0 bottom-0 z-40"></div>
        <div className="flex justify-center items-center w-full h-full z-50">
          <div className="flex justify-center h-80 w-10/12 bg-white drop-shadow-2xl rounded-2xl relative overflow-hidden">
            <Circle
              className={`fill-current absolute -top-364 w-400 h-400 ${
                isVictory ? "text-red-dark-99" : "text-gray-dark-99"
              } z-40`}
            ></Circle>
            <div className="z-50 font-sans font-semibold text-3xl text-white mt-3 absolute">
              {title}
            </div>
            <div className="z-50 font-sans font-semibold text-md text-gray-300 mt-12 absolute">
              {message}
            </div>
            <button
              className="absolute top-3 right-3 w-6 h-6 z-50"
              onClick={() => setShow(false)}
            >
              <Close className="fill-current w-full h-full text-gray-300"></Close>
            </button>

            <div className="flex flex-col items-center mt-28 w-full">
              <div className="flex flex-row items-center justify-around w-full">
                <div className="flex flex-col justify-center items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-green-classic text-white text-sm font-sans font-semibold">
                    {longestDailyStreak}
                  </div>
                  <div>|</div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-green-classic text-white text-sm font-sans font-semibold">
                    {currentDailyStreak}
                  </div>
                  <div className="text-xs mt-2">Daily Streak</div>
                </div>

                <div className="flex flex-col justify-center items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-yellow-classic text-white text-sm font-sans font-semibold">
                    {longestPracticeStreak}
                  </div>
                  <div>|</div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-yellow-classic text-white text-sm font-sans font-semibold">
                    {currentPracticeStreak}
                  </div>
                  <div className="text-xs mt-2">Practice Streak</div>
                </div>

                <div className="flex flex-col justify-center items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-red-dark-99 text-white text-sm font-sans font-semibold">
                    {longestRankStreak}
                  </div>
                  <div>|</div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-red-dark-99 text-white text-sm font-sans font-semibold">
                    {currentRankStreak}
                  </div>
                  <div className="text-xs mt-2">Rank Streak</div>
                </div>
              </div>
              <button
                className={`flex flex-row w-10/12 h-12 bg-red-dark-99 rounded-xl mt-5 items-center justify-center border-b-2 border-red-800 drop-shadow-2xl mb-5`}
                onClick={() => onNavigateTo("/play/game/practice")}
              >
                <div className="font-bold text-white font-sans text-xl">
                  Practice
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResultPopup;
