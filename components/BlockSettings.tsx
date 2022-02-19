/* eslint-disable @next/next/no-img-element */
import Search from "../public/icons/search.svg";

const BlockSettings = () => {
  return (
    <div className="flex flex-col w-10/12 absolute top-24 right-0 drop-shadow-md">
      <div className="flex flex-col justify-center w-full rounded-l-md bg-white">
        <div className="ml-3 mt-3 text-2xl font-semibold">Blocked Members</div>

        <div className="flex flex-row items-center ml-3 mt-3">
          <div className="flex flex-row items-center rounded-md h-8 bg-pink-light-1 w-7/12 drop-shadow-md">
            <Search className="fill-current w-5 h-5 text-gray-500"></Search>
            <div className="ml-1 text-md text-gray-500">Search members</div>
          </div>

          <div className="flex items-center justify-center h-8 w-4/12 rounded-md bg-gray-dark ml-3">
            <div className="text-white">Block User</div>
          </div>
        </div>

        <div className="flex flex-row h-8 w-11/12 ml-3 mt-5 justify-between items-center border-b-2 border-red-dark-99">
          <div>quangld00@gmail.com</div>
          <div className="text-sm text-gray-600">Block</div>
        </div>

        <div className="mt-1 flex flex-row h-8 w-11/12 ml-3 justify-between items-center border-b-2 border-red-dark-99">
          <div>quangld00@gmail.com</div>
          <div className="text-sm text-gray-600">Block</div>
        </div>

        <div className="mt-1 flex flex-row h-8 w-11/12 ml-3 justify-between items-center"></div>
      </div>
    </div>
  );
};
export default BlockSettings;
