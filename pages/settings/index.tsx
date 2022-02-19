import { MouseEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import Link from "next/link";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  withAuthUser,
  AuthAction,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import { firestore, usersCollection } from "../../firebase/clientApp";
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
import ResponsiveAppBar from "../../components/ResponsiveAppBar";
import Logo from "../../public/icons/logo.svg";
import SettingsIcon from "../../public/icons/settings.svg";
import Account from "../../public/icons/account.svg";
import Chess from "../../public/icons/chess.svg";
import Friends from "../../public/icons/friends2.svg";
import Unavailable from "../../public/icons/unavailable.svg";
import Close from "../../public/icons/close.svg";
import Camera from "../../public/icons/camera.svg";
import USA from "../../public/icons/usa.svg";
import Diamond from "../../public/icons/diamond.svg";
import Image from "next/image";
import Profile from "../../components/Profile";
import BoardSelection from "../../components/BoardSelection";
import FriendSettings from "../../components/FriendSettings";
import BlockSettings from "../../components/BlockSettings";

const Settings: NextPage = () => {
  // Determine what content to show based on chosen page of settings
  const [options, setOptions] = useState<number>(0);
  const router = useRouter();

  return (
    <div className="relative flex w-screen h-screen flex-col items-center">
      <div className="z-50">
        <ResponsiveAppBar></ResponsiveAppBar>
      </div>

      <div className="flex w-full h-full flex-col items-center z-10 mt-12 bg-pink-light-1">
        {/* Body */}
        <div className="flex flex-row items-center w-full mt-2 relative">
          <SettingsIcon className="h-6 w-6 text-gray-dark-99 fill-current ml-3"></SettingsIcon>
          <div className="text-xl font-bold ml-3">Settings</div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col justify-center absolute left-0 top-24 w-12 bg-white rounded-r-md drop-shadow-xl">
          <div
            className="flex justify-center items-center w-12 h-12 border-b-2 border-red-dark-99"
            onClick={() => setOptions(0)}
          >
            <Account className="w-6 h-6"></Account>
          </div>
          <div
            className="flex justify-center items-center w-12 h-12 border-b-2 border-red-dark-99"
            onClick={() => setOptions(1)}
          >
            <Chess className="w-6 h-6"></Chess>
          </div>
          <div
            className="flex justify-center items-center w-12 h-12 border-b-2 border-red-dark-99"
            onClick={() => setOptions(2)}
          >
            <Friends className="w-6 h-6"></Friends>
          </div>
          <div
            className="flex justify-center items-center w-12 h-12 border-b-2 border-red-dark-99"
            onClick={() => setOptions(3)}
          >
            <Unavailable className="w-6 h-6"></Unavailable>
          </div>
        </div>

        {/* Content */}
        {options === 0 ? <Profile></Profile> : <></>}
        {options === 1 ? <BoardSelection></BoardSelection> : <></>}
        {options === 2 ? <FriendSettings></FriendSettings> : <></>}
        {options === 3 ? <BlockSettings></BlockSettings> : <></>}
      </div>
    </div>
  );
};

// Note that this is a higher-order function.
export default Settings;
// export const getServerSideProps = withAuthUserTokenSSR({
//   whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
// })();

// export default withAuthUser({
//   whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
// })(Settings);
