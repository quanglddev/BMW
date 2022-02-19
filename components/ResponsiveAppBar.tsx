/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useRouter } from "next/router";
import Logo from "../public/icons/logo.svg";
import Hamburger from "../public/icons/hamburger.svg";
import Close from "../public/icons/close.svg";
import Bluetooth from "../public/icons/bluetooth.svg";
import Wifi from "../public/icons/wifi.svg";
import Friends from "../public/icons/friends.svg";
import AddFriend from "../public/icons/addFriend.svg";
import LogOut from "../public/icons/logout.svg";
import Settings from "../public/icons/settings.svg";
import Help from "../public/icons/help.svg";

const ResponsiveAppBar = () => {
  const router = useRouter();
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-row items-center fixed top-0 left-0 right-0 bg-red-dark-99 h-12">
      {/* Navigation Bar */}
      <Hamburger
        className="fill-current text-pink-light-1 w-8 h-8 ml-3"
        onClick={() => setSideBarOpen(true)}
      ></Hamburger>

      <div className="flex flex-row items-center">
        <Logo className="fill-current w-16 h-16 -ml-1"></Logo>
        <div className="-ml-3 text-lg text-white">BMWordle</div>
      </div>

      {/* Side Bar */}
      <div
        className={`${
          sideBarOpen ? "flex" : "hidden"
        } flex fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-50 flex-row`}
      >
        {/* Quick Options */}
        <div className="flex flex-col bg-pink-light-1 h-full w-6/12">
          <div className="flex flex-col h-full">
            <Close
              className="fill-current text-red-dark-99 h-6 w-6 ml-3 mt-2"
              onClick={() => setSideBarOpen(false)}
            ></Close>

            {/* Bluetooth */}
            <div className="flex flex-row items-center w-10/12 h-12 mt-3 ml-3">
              <Bluetooth className="fill-current w-8 h-8"></Bluetooth>
              <div className="text-black ml-2">Local match</div>
            </div>

            {/* Wifi */}
            <div className="flex flex-row items-center w-10/12 h-12 -mt-1 ml-3">
              <Wifi className="fill-current w-8 h-8"></Wifi>
              <div className="text-black ml-2">Rank match</div>
            </div>

            {/* Friends */}
            <div className="flex flex-row items-center w-10/12 h-12 -mt-1 ml-3">
              <Friends className="fill-current w-8 h-8"></Friends>
              <div className="text-black ml-2">Friendly match</div>
            </div>

            {/* Add friend button */}
            <div className="flex items-center justify-center bg-red-dark-99 w-10/12 h-10 rounded ml-3 mt-2">
              <AddFriend className="fill-current text-white w-4 h-4"></AddFriend>
            </div>

            {/* Login/logout button */}
            <div className="flex items-center justify-center bg-button-1 w-10/12 h-10 rounded ml-3 mt-3">
              <LogOut className="fill-current text-icon w-5 h-5"></LogOut>
            </div>
          </div>
          <div className="flex flex-col justify-center my-2">
            <div
              className="flex flex-row items-center"
              onClick={() => router.push("/settings")}
            >
              <Settings className="h-5 w-5 ml-3 fill-current text-gray-700"></Settings>
              <div className="ml-2 text-md text-gray-700">Settings</div>
            </div>

            <div className="flex flex-row items-center my-2">
              <Help className="h-5 w-5 ml-3 fill-current text-gray-700"></Help>
              <div className="ml-2 text-md text-gray-700">Help</div>
            </div>
          </div>
        </div>

        {/* Friends */}
        <div className="flex flex-col bg-pink-light-2 h-full w-6/12">
          {/* Online */}
          <div className="font-bold text-xs text-gray-700 ml-2 mt-3">
            ONLINE - 2
          </div>
          <div className="flex flex-row items-center w-10/12 h-12 mt-3 ml-2">
            <div className="flex flex-row w-auto relative">
              <img
                className="w-8 h-8 rounded-full"
                src="https://avatars.githubusercontent.com/u/42598512?v=4"
                alt="Quang's avatar"
              />
              <div className="bg-green-500 w-4 h-4 rounded-full -bottom-1 absolute -right-1 border-2 border-pink-light-2"></div>
            </div>

            <div className="ml-3 text-black text-md">Quang Luong</div>
          </div>

          {/* Offline */}
          <div className="font-bold text-xs text-gray-700 ml-2 mt-8">
            OFFLINE - 5
          </div>
          <div className="flex flex-row items-center w-10/12 h-12 mt-3 ml-2 opacity-50">
            <div className="flex flex-row w-auto relative">
              <img
                className="w-8 h-8 rounded-full"
                src="https://avatars.githubusercontent.com/u/42598512?v=4"
                alt="Quang's avatar"
              />
            </div>

            <div className="ml-3 text-gray-700 text-md">Quang Luong</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResponsiveAppBar;
