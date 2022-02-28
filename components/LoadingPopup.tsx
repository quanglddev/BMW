import { useEffect, useState } from "react";
import Image from "next/image";

const permutations = ["Searching", "Searching.", "Searching..", "Searching..."];
const permutations2 = [
  "Creating room",
  "Creating room.",
  "Creating room..",
  "Creating room...",
];

interface Props {
  found: boolean;
  side1Name: string;
  side1Avatar: string;
  side2Name: string;
  side2Avatar: string;
}

const LoadingPopup = (props: Props) => {
  const { found, side1Name, side1Avatar, side2Name, side2Avatar } = props;
  const [header, setHeader] = useState<string>(permutations[0]);
  const [header2, setHeader2] = useState<string>(permutations2[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentIdx = permutations.indexOf(header);
      const nextIdx = (currentIdx + 1) % permutations.length;
      setHeader(permutations[nextIdx]);
      setHeader2(permutations2[nextIdx]);
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
          <div
            className={`flex flex-col ${
              found ? "h-52" : "h-36"
            } w-10/12 bg-white drop-shadow-2xl rounded-2xl relative overflow-hidden max-w-md`}
          >
            <div className="w-full text-center text-lg font-medium mt-5">
              {found ? header2 : header}
            </div>
            {!found ? (
              <div className="w-full text-center text-md font-medium mt-1">
                Estimated: 10 min
              </div>
            ) : (
              <div className="flex w-full flex-row items-center h-16 my-2 justify-center">
                <div className="flex flex-col justify-center items-center mt-5">
                  <div className="flex relative w-16 h-16 bg-red-100">
                    <Image
                      src={
                        side1Avatar !== ""
                          ? side1Avatar
                          : "https://ui-avatars.com/api/?background=random"
                      }
                      alt="Profile picture"
                      width={512}
                      height={512}
                      className="rounded-md"
                      objectFit="cover"
                      loading="eager"
                    ></Image>
                  </div>
                  <div className="text-sm mt-2">
                    {side1Name !== "" ? side1Name : "Anonymous"}
                  </div>
                </div>

                <div className="text-5xl mx-5">⚔️</div>
                <div className="flex flex-col justify-center items-center mt-5">
                  <div className="flex relative w-16 h-16 bg-red-100">
                    <Image
                      src={
                        side2Avatar !== ""
                          ? side2Avatar
                          : "https://ui-avatars.com/api/?background=random"
                      }
                      alt="Profile picture"
                      width={512}
                      height={512}
                      className="rounded-md"
                      objectFit="cover"
                      loading="eager"
                    ></Image>
                  </div>
                  <div className="text-sm mt-2">
                    {side2Name !== "" ? side2Name : "Anonymous"}
                  </div>
                </div>
              </div>
            )}
            <div
              className={`w-full text-sm text-center text-gray-700 ${
                found ? "mt-6" : "mt-3"
              }`}
            >
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
