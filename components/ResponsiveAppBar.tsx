/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
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
import Stats from "../public/icons/stats.svg";
import IUser from "../interfaces/IUser";
import { useAuthUser, withAuthUser } from "next-firebase-auth";
import { queryFriends } from "../firebase/users";

const ResponsiveAppBar = () => {
  const AuthUser = useAuthUser();
  const router = useRouter();
  const [allFriends, setAllFriends] = useState<IUser[]>([]);
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!AuthUser.id) {
        return;
      }

      const friends = await queryFriends(AuthUser.id);
      setAllFriends(friends);
    };

    fetchData();
  }, [AuthUser.id]);

  const navigateTo = (path: string) => {
    router.push(path);
    setSideBarOpen(false);
  };

  // Active in the last 3 minutes
  const onlinePeople = allFriends.filter(
    (friend) =>
      new Date().getTime() - friend.lastActivity!.getTime() <= 3 * 60 * 1000
  );
  const offlinePeople = allFriends.filter(
    (friend) =>
      new Date().getTime() - friend.lastActivity!.getTime() > 3 * 60 * 1000
  );

  return (
    <div className="flex flex-row items-center fixed top-0 left-0 right-0 bg-red-dark-99 h-12">
      {/* Navigation Bar */}
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-row items-center">
          <button className="w-8 h-8 ml-3">
            <Hamburger
              className="fill-current text-pink-light-1 w-full h-full"
              onClick={() => setSideBarOpen(true)}
            ></Hamburger>
          </button>

          <div
            className="flex flex-row items-center"
            onClick={() => navigateTo("/")}
          >
            <Logo className="fill-current w-16 h-16 -ml-1"></Logo>
            <div className="-ml-3 text-lg text-white">BMWordle</div>
          </div>
        </div>
        <div className="flex flex-row items-center">
          <button className="w-8 h-8 mr-3">
            <Help
              className="fill-current text-pink-light-1 w-full h-full"
              onClick={() => navigateTo("/info")}
            ></Help>
          </button>
          {/* <button className="w-6 h-6 mr-3">
            <Settings
              className="fill-current text-black w-full h-full"
              onClick={() => setSideBarOpen(true)}
            ></Settings>
          </button> */}
        </div>
      </div>

      {/* Side Bar */}
      <div
        className={`${
          sideBarOpen ? "flex" : "hidden"
        } flex fixed top-0 left-0 right-0 bottom-0 w-full h-full z-50 flex-row`}
      >
        {/* Quick Options */}
        <div className="flex flex-col bg-pink-light-1 h-full w-6/12">
          <div className="flex flex-col h-full">
            <Close
              className="fill-current text-red-dark-99 h-6 w-6 ml-3 mt-2"
              onClick={() => setSideBarOpen(false)}
            ></Close>

            {/* Daily */}
            <button
              className="flex flex-row items-center w-10/12 h-12 mt-3 ml-3"
              onClick={() => navigateTo("/play/game/daily")}
            >
              <Today className="w-8 h-8"></Today>
              <div className="text-black ml-2">Daily Puzzle</div>
            </button>

            {/* Muscle */}
            <button
              className="flex flex-row items-center w-10/12 h-12 -mt-1 ml-3"
              onClick={() => navigateTo("/play/game/practice")}
            >
              <Muscle className="fill-current w-8 h-8"></Muscle>
              <div className="text-black ml-2">Practice</div>
            </button>

            {/* Wifi */}
            <button
              className="flex flex-row items-center w-10/12 h-12 -mt-1 ml-3"
              onClick={() => navigateTo("/play/game/rank")}
            >
              <Wifi className="fill-current w-8 h-8"></Wifi>
              <div className="text-black ml-2">Rank match</div>
            </button>

            {/* Friends */}
            <button
              className="flex flex-row items-center w-10/12 h-12 -mt-1 ml-3"
              onClick={() => navigateTo("/play/game/friendly")}
            >
              <Friends className="fill-current w-8 h-8"></Friends>
              <div className="text-black ml-2">Friendly match</div>
            </button>

            {/* Stats */}
            <button
              className="flex flex-row items-center w-10/12 h-12 mt-12 ml-3"
              onClick={() => navigateTo("/stats")}
            >
              <Stats className="fill-current w-8 h-8"></Stats>
              <div className="text-black ml-2">Stats</div>
            </button>

            {/* Add friend button */}
            <button
              className="flex items-center justify-center bg-red-dark-99 w-10/12 h-10 rounded ml-3 mt-2"
              onClick={() => navigateTo("/settings/2")}
            >
              <AddFriend className="fill-current text-white w-4 h-4"></AddFriend>
            </button>

            {/* Login/logout button */}
            <button
              className="flex items-center justify-center bg-button-1 w-10/12 h-10 rounded ml-3 mt-3"
              onClick={async () => await AuthUser.signOut()}
            >
              <LogOut className="fill-current text-icon w-5 h-5"></LogOut>
            </button>
          </div>
          <div className="flex flex-col justify-center my-2">
            <button
              className="flex flex-row items-center"
              onClick={() => navigateTo("/settings/0")}
            >
              <Settings className="h-5 w-5 ml-3 fill-current text-gray-700"></Settings>
              <div className="ml-2 text-md text-gray-700">Settings</div>
            </button>

            <button
              className="flex flex-row items-center my-2"
              onClick={() => navigateTo("/info")}
            >
              <Help className="h-5 w-5 ml-3 fill-current text-gray-700"></Help>
              <div className="ml-2 text-md text-gray-700">Help</div>
            </button>
          </div>
        </div>

        {/* Friends */}
        <div className="flex flex-col bg-pink-light-2 h-full w-6/12">
          {/* Online */}
          <div className="font-bold text-xs text-gray-700 ml-2 mt-3">
            ONLINE - {onlinePeople.length}
          </div>

          {onlinePeople.map((friend) => (
            <div
              key={friend.id}
              className="flex flex-row items-center w-10/12 h-12 mt-3 ml-2"
            >
              <div className="flex flex-row w-auto relative">
                <img
                  className="w-8 h-8 rounded-full"
                  src={friend.imageUrl}
                  alt={`${friend.fullName}'s avatar`}
                />
                <div className="bg-green-500 w-4 h-4 rounded-full -bottom-1 absolute -right-1 border-2 border-pink-light-2"></div>
              </div>

              <div className="ml-3 text-black text-md">{friend.fullName}</div>
            </div>
          ))}

          {/* Offline */}
          <div className="font-bold text-xs text-gray-700 ml-2 mt-8">
            OFFLINE - {offlinePeople.length}
          </div>

          {offlinePeople.map((friend) => (
            <div
              key={friend.id}
              className="flex flex-row items-center w-10/12 h-12 mt-3 ml-2 opacity-50"
            >
              <div className="flex flex-row w-auto relative">
                <img
                  className="w-8 h-8 rounded-full"
                  src={friend.imageUrl}
                  alt={`${friend.fullName}'s avatar`}
                />
              </div>

              <div className="ml-3 text-gray-700 text-md">
                {friend.fullName}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withAuthUser()(ResponsiveAppBar);
