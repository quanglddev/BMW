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
import { firestore, usersCollection } from "../../../firebase/clientApp";
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
import ResponsiveAppBar from "../../../components/ResponsiveAppBar";
import Logo from "../../../public/icons/logo.svg";
import SettingsIcon from "../../../public/icons/settings.svg";
import Account from "../../../public/icons/account.svg";
import Chess from "../../../public/icons/chess.svg";
import Friends from "../../../public/icons/friends2.svg";
import Unavailable from "../../../public/icons/unavailable.svg";
import Close from "../../../public/icons/close.svg";
import Camera from "../../../public/icons/camera.svg";
import USA from "../../../public/icons/usa.svg";
import Diamond from "../../../public/icons/diamond.svg";
import Image from "next/image";
import Profile from "../../../components/Profile";
import BoardSelection from "../../../components/BoardSelection";
import FriendSettings from "../../../components/FriendSettings";
import BlockSettings from "../../../components/BlockSettings";
import keyboard from "../../../utils/initKeyboard";

const Game: NextPage = () => {
  // Determine what content to show based on chosen page of settings
  const [values, setValues] = useState<(number | null)[]>(Array(30).fill(null));
  const router = useRouter();

  return (
    <div className="relative flex w-screen h-screen flex-col items-center">
      <div className="z-50">
        <ResponsiveAppBar></ResponsiveAppBar>
      </div>

      <div className="flex w-full h-full flex-col items-center justify-center z-10 mt-12 bg-pink-light-1">
        <div className="w-full mb-5 px-5">
          <div className="w-full flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <div className="flex w-12 h-12 mr-3 relative">
                <Image
                  src={"https://avatars.githubusercontent.com/u/42598512?v=4"}
                  alt="Quang's profile picture"
                  width={1000}
                  height={1000}
                  className="rounded-full"
                ></Image>
              </div>
              <div className="-mt-6">
                <span>⬛⬛⬛🟨⬛</span> <span>🟥⬛⬛⬛⬛</span>
                <span>⬛🟨🟥⬛⬛</span> <span>🟨⬛⬛⬛⬛</span>
                <span>🟥🟥🟥🟥🟥</span>
              </div>
            </div>

            <div className="flex flex-row items-center">
              <div className="-mt-6">
                <span>⬛⬛⬛🟨⬛</span> <span>🟥⬛⬛⬛⬛</span>
                <span>⬛🟨🟥⬛⬛</span> <span>🟨⬛⬛⬛⬛</span>
                <span>🟥🟥🟥🟥🟥</span>
              </div>
              <div className="flex w-12 h-12 ml-3 relative">
                <Image
                  src={"https://avatars.githubusercontent.com/u/42598512?v=4"}
                  alt="Quang's profile picture"
                  width={1000}
                  height={1000}
                  className="rounded-full"
                ></Image>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row flex-wrap justify-center items-center w-full">
          {values.map((value, idx) => (
            <div
              key={idx}
              className="flex justify-center items-center w-[13vw] h-[13vw] m-2 border-2 border-red-dark-99 xs:w-14 xs:h-14 sm:w-20 sm:h-20"
            >
              <input
                type="text"
                className="flex w-full h-full items-center justify-center text-center text-3xl font-semibold uppercase bg-pink-light-1 text-red-dark-99"
                value={value ? value : ""}
                maxLength={1}
                onChange={(e) => setValues(Array(30).fill(e.target.value))}
              />
            </div>
          ))}
        </div>

        <div className="w-full flex flex-col items-center my-5 select-none h-auto justify-end">
          <div className="w-full flex justify-center my-[5px]">
            {keyboard[0].map((keyCode) => (
              <div
                key={keyCode.value}
                className="flex items-center justify-center h-10 xxs:h-14 w-[2rem] sm:w-10 rounded-md text-sm capitalize border-2 border-red border-red-dark-99 bg-white mx-[3.5px]"
              >
                {keyCode.value}
              </div>
            ))}
          </div>
          <div className="w-full flex justify-center my-[5px]">
            {keyboard[1].map((keyCode) => (
              <div
                key={keyCode.value}
                className="flex items-center justify-center h-10 xxs:h-14 w-[2rem] sm:w-10 rounded-md text-sm capitalize border-2 border-red border-red-dark-99 bg-white mx-[3.5px]"
              >
                {keyCode.value}
              </div>
            ))}
          </div>
          <div className="w-full flex justify-center my-[5px]">
            {keyboard[2].map((keyCode) => (
              <div
                key={keyCode.value}
                className={`flex items-center justify-center h-10 xxs:h-14 ${
                  keyCode.isWide ? "w-12" : "w-[2rem]"
                } sm:w-10 rounded-md ${
                  keyCode.isBigText ? "text-xl" : "text-sm"
                } capitalize border-2 border-red border-red-dark-99 bg-white mx-[3.5px]`}
              >
                {keyCode.value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Note that this is a higher-order function.
export default Game;
// export const getServerSideProps = withAuthUserTokenSSR({
//   whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
// })();

// export default withAuthUser({
//   whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
// })(Settings);
