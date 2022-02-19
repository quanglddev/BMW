/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

const BoardSelection = () => {
  const [skinName, setSkinName] = useState<string>("");

  return (
    <div className="flex flex-col w-10/12 absolute top-24 right-0 drop-shadow-md">
      <div className="flex flex-col justify-center w-full rounded-l-md bg-white">
        <div className="ml-3 mt-3 text-2xl font-semibold">Board Skins</div>

        <div className="flex flex-row w-full justify-center mt-3">
          <div className="w-8/12 h-36 bg-slate-600"></div>
        </div>

        <div className="ml-3 text-sm mt-3">Skin Name</div>
        <input
          type="text"
          className="text-black rounded-sm p-2 w-11/12 drop-shadow-md bg-pink-light-1 ml-3 mt-1"
          required
          value={skinName}
          onChange={(e) => setSkinName(e.target.value)}
        />

        <div className="flex flex-row w-28 h-12 bg-red-dark-99 rounded-xl mt-5 ml-3 items-center justify-center border-b-2 border-red-800 drop-shadow-2xl mb-5">
          <div className="font-bold text-white">Save</div>
        </div>
      </div>
    </div>
  );
};
export default BoardSelection;
