import { useRouter } from "next/router";
import Logo from "../public/icons/logo.svg";
import Muscle from "../public/icons/muscle.svg";
import Wifi from "../public/icons/wifi.svg";
import Friends from "../public/icons/friends.svg";
import LogOut from "../public/icons/logout.svg";
import Settings from "../public/icons/settings.svg";
import Today3 from "../public/icons/today3.svg";
import Stats from "../public/icons/stats.svg";
import { useAuthUser, withAuthUser } from "next-firebase-auth";

const AppBarLarge = () => {
  const AuthUser = useAuthUser();
  const router = useRouter();

  return (
    <div className="flex-col items-center fixed top-0 left-0 bottom-0 w-36 bg-red-dark-99 z-50 hidden lg:flex">
      <div
        className="flex flex-row items-center justify-center w-full cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Logo className="fill-current w-16 h-16 -ml-5"></Logo>
        <div className="-ml-3 text-lg font-bold text-white select-none">
          BMWordle
        </div>
      </div>

      {/* Daily */}
      <button
        className="flex flex-row items-center w-full h-12 mt-3 mx-1 hover:bg-red-500"
        onClick={() => router.push("/play/game/daily")}
      >
        <Today3 className="w-10 h-10 ml-2"></Today3>
        <div className="text-white ml-2">Daily</div>
      </button>

      {/* Muscle */}
      <button
        className="flex flex-row items-center w-full h-12 mt-3 mx-1 hover:bg-red-500"
        onClick={() => router.push("/play/game/practice")}
      >
        <Muscle className="w-10 h-10 ml-2"></Muscle>
        <div className="text-white ml-2">Practice</div>
      </button>

      {/* Wifi */}
      <button
        className="flex flex-row items-center w-full h-12 mt-3 mx-1 hover:bg-red-500"
        onClick={() => router.push("/play/game/rank")}
      >
        <Wifi className="w-10 h-10 ml-2"></Wifi>
        <div className="text-white ml-2">Rank</div>
      </button>

      {/* Friends */}
      <button
        className="flex flex-row items-center w-full h-12 mt-3 mx-1 hover:bg-red-500"
        onClick={() => router.push("/play/game/friendly")}
      >
        <Friends className="w-10 h-10 ml-2"></Friends>
        <div className="text-white ml-2">Friendly</div>
      </button>

      {/* Stats */}
      <button
        className="flex flex-row items-center w-full h-12 mt-3 mx-1 hover:bg-red-500"
        onClick={() => router.push("/stats")}
      >
        <Stats className="w-10 h-10 ml-2"></Stats>
        <div className="text-white ml-2">Stats</div>
      </button>

      {/* Settings */}
      <button
        className="flex flex-row items-center w-full h-12 mt-3 mx-1 hover:bg-red-500"
        onClick={() => router.push("/settings/0")}
      >
        <Settings className="fill-current w-10 h-10 ml-2 text-blue-settings"></Settings>
        <div className="text-white ml-2">Settings</div>
      </button>

      {/* Logout */}
      <button
        className="flex flex-row items-center w-full h-12 mt-3 mx-1 hover:bg-red-500"
        onClick={async () => await AuthUser.signOut()}
      >
        <LogOut className="fill-current w-10 h-10 ml-2"></LogOut>
        <div className="text-white ml-2">Log out</div>
      </button>
    </div>
  );
};

export default withAuthUser()(AppBarLarge);
