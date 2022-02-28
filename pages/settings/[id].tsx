import { useRouter } from "next/router";
import type { NextPage } from "next";
import ResponsiveAppBar from "../../components/ResponsiveAppBar";
import SettingsIcon from "../../public/icons/settings.svg";
import Account from "../../public/icons/account.svg";
import Chess from "../../public/icons/chess.svg";
import Friends from "../../public/icons/friends2.svg";
import Profile from "../../components/Profile";
import BoardSelection from "../../components/BoardSelection";
import FriendSettings from "../../components/FriendSettings";
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import { useEffect } from "react";
import { initializeUserInfo, updateUserPresence } from "../../firebase/users";
import { exitWaitRoom } from "../../firebase/waitRoom";
import AppBarLarge from "../../components/AppBarLarge";

const Settings: NextPage = () => {
  const AuthUser = useAuthUser();
  const router = useRouter();
  const { id } = router.query;
  const option = parseInt(id as string, 10);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!AuthUser.id) {
        return;
      }

      updateUserPresence(AuthUser.id);
    }, 15 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [AuthUser.id]);

  useEffect(() => {
    if (!AuthUser.id) {
      return;
    }

    initializeUserInfo(AuthUser);
    exitWaitRoom(AuthUser.id);
  }, [AuthUser]);

  return (
    <div className="relative flex w-screen h-full flex-col items-center">
      <div className="z-50 lg:hidden">
        <ResponsiveAppBar></ResponsiveAppBar>
      </div>

      <div className="z-50">
        <AppBarLarge></AppBarLarge>
      </div>

      <div className="flex w-full h-full flex-col items-center z-10 mt-12 bg-pink-light-1 lg:pl-36">
        {/* Body */}
        <div className="flex flex-row items-center w-full mt-2 relative lg:ml-36">
          <SettingsIcon className="h-6 w-6 text-gray-dark-99 fill-current ml-3"></SettingsIcon>
          <div className="text-xl font-bold ml-3">Settings</div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col justify-center absolute left-0 lg:left-36 lg:top-0 top-24 w-12 bg-white rounded-r-md drop-shadow-xl">
          <div
            className="flex justify-center items-center w-12 h-12 border-b-2 border-red-dark-99"
            onClick={() => router.push("/settings/0")}
          >
            <Account className="w-6 h-6"></Account>
          </div>
          <div
            className="flex justify-center items-center w-12 h-12 border-b-2 border-red-dark-99"
            onClick={() => router.push("/settings/1")}
          >
            <Chess className="w-6 h-6"></Chess>
          </div>
          <div
            className="flex justify-center items-center w-12 h-12 border-b-2 border-red-dark-99"
            onClick={() => router.push("/settings/2")}
          >
            <Friends className="w-6 h-6"></Friends>
          </div>
          {/* <div
            className="flex justify-center items-center w-12 h-12 border-b-2 border-red-dark-99"
            onClick={() => router.push("/settings/3")}
          >
            <Unavailable className="w-6 h-6"></Unavailable>
          </div> */}
        </div>

        {/* Content */}
        {option === 0 ? <Profile></Profile> : <></>}
        {option === 1 ? <BoardSelection></BoardSelection> : <></>}
        {option === 2 ? <FriendSettings></FriendSettings> : <></>}
        {/* {option === 3 ? <BlockSettings></BlockSettings> : <></>} */}
      </div>
    </div>
  );
};

// Note that this is a higher-order function.
// export default Settings;
export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})();

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Settings);
