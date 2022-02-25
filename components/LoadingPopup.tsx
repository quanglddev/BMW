import { useEffect, useState } from "react";

const permutations = ["Searching", "Searching.", "Searching..", "Searching..."];

const LoadingPopup = () => {
  const [header, setHeader] = useState<string>(permutations[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentIdx = permutations.indexOf(header);
      const nextIdx = (currentIdx + 1) % permutations.length;
      setHeader(permutations[nextIdx]);
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [header]);

  return (
    <div className="flex flex-row items-center fixed top-0 left-0 right-0 bg-red-dark-99 h-12">
      {/* Side Bar */}
      <div
        className={`flex fixed top-0 left-0 right-0 bottom-0 w-full h-full z-50 flex-row`}
      >
        <div className="flex w-full h-full bg-black opacity-50 absolute top-0 left-0 right-0 bottom-0 z-40"></div>
        <div className="flex justify-center items-center w-full h-full z-50">
          <div className="flex flex-col h-36 w-10/12 bg-white drop-shadow-2xl rounded-2xl relative overflow-hidden max-w-md">
            <div className="w-full text-center text-lg font-medium mt-5">
              {header}
            </div>
            <div className="w-full text-center text-md font-medium mt-1">
              Estimated: 1 min
            </div>
            <div className="w-full text-sm text-center text-gray-700 mt-3">
              Having fun? Invite a friend to join
              <span>BMWordle.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPopup;
