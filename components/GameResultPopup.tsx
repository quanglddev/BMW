import { useEffect, useState } from "react";
import Close from "../public/icons/close.svg";
import Circle from "../public/icons/circle.svg";
import { getDocs, query, where } from "firebase/firestore";
import { usersCollection } from "../firebase/clientApp";
import { AnnouncementStatus, IAnnouncement } from "../interfaces/IAnnouncement";

interface Props {
  show: boolean;
  config: IAnnouncement;
}

const GameResultPopup = (props: Props) => {
  const { show, config } = props;

  const [longestDailyStreak, setLongestDailyStreak] = useState<number>(0);
  const [longestPracticeStreak, setLongestPracticeStreak] = useState<number>(0);
  const [longestRankStreak, setLongestRankStreak] = useState<number>(0);
  const [currentDailyStreak, setCurrentDailyStreak] = useState<number>(0);
  const [currentPracticeStreak, setCurrentPracticeStreak] = useState<number>(0);
  const [currentRankStreak, setCurrentRankStreak] = useState<number>(0);

  useEffect(() => {
    if (!config.userId) {
      return;
    }

    const userQuery = query(usersCollection, where("id", "==", config.userId));

    getDocs(userQuery).then((querySnapshot) => {
      if (querySnapshot.docs.length === 0) {
        return;
      }

      querySnapshot.forEach((snapshot) => {
        const data = snapshot.data();
        setLongestDailyStreak(data.longestDailyStreak);
        setCurrentDailyStreak(data.currentDailyStreak);
        setLongestPracticeStreak(data.longestPracticeStreak);
        setCurrentPracticeStreak(data.currentPracticeStreak);
        setLongestRankStreak(data.longestRankStreak);
        setCurrentRankStreak(data.currentRankStreak);
        return;
      });
    });
  }, [config.userId]);

  return (
    <div className="flex flex-row items-center fixed top-0 left-0 right-0 bg-red-dark-99 h-12">
      {/* Side Bar */}
      <div
        className={`${
          show ? "flex" : "hidden"
        } flex fixed top-0 left-0 right-0 bottom-0 w-full h-full z-50 flex-row`}
      >
        <div className="flex w-full h-full bg-black opacity-50 absolute top-0 left-0 right-0 bottom-0 z-40"></div>
        <div className="flex justify-center items-center w-full h-full z-50">
          <div className="flex justify-center h-80 w-10/12 bg-white drop-shadow-2xl rounded-2xl relative overflow-hidden">
            <Circle
              className={`fill-current absolute -top-364 w-400 h-400 ${
                config.status === AnnouncementStatus.success
                  ? "text-red-dark-99"
                  : "text-gray-dark-99"
              } z-40`}
            ></Circle>
            <div className="z-50 font-sans font-semibold text-3xl text-white mt-3 absolute">
              {config.title}
            </div>
            <div className="z-50 font-sans font-semibold text-md text-gray-300 mt-12 absolute">
              {config.message}
            </div>
            <button
              className="absolute top-3 right-3 w-6 h-6 z-50"
              onClick={() => config.onClose()}
            >
              <Close className="fill-current w-full h-full text-gray-300"></Close>
            </button>

            <div className="flex flex-col items-center mt-28 w-full">
              <div className="flex flex-row items-center justify-around w-full">
                <div className="flex flex-col justify-center items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-green-classic text-white text-sm font-sans font-semibold">
                    {longestDailyStreak}
                  </div>
                  <div>|</div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-green-classic text-white text-sm font-sans font-semibold">
                    {currentDailyStreak}
                  </div>
                  <div className="text-xs mt-2">Daily Streak</div>
                </div>

                <div className="flex flex-col justify-center items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-yellow-classic text-white text-sm font-sans font-semibold">
                    {longestPracticeStreak}
                  </div>
                  <div>|</div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-yellow-classic text-white text-sm font-sans font-semibold">
                    {currentPracticeStreak}
                  </div>
                  <div className="text-xs mt-2">Practice Streak</div>
                </div>

                <div className="flex flex-col justify-center items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-red-dark-99 text-white text-sm font-sans font-semibold">
                    {longestRankStreak}
                  </div>
                  <div>|</div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-red-dark-99 text-white text-sm font-sans font-semibold">
                    {currentRankStreak}
                  </div>
                  <div className="text-xs mt-2">Rank Streak</div>
                </div>
              </div>
              <button
                className={`flex flex-row w-10/12 h-12 bg-red-dark-99 rounded-xl mt-5 items-center justify-center border-b-2 border-red-800 drop-shadow-2xl mb-5`}
                onClick={() => config.onMainButtonClick()}
              >
                <div className="font-bold text-white font-sans text-xl">
                  {config.buttonText}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResultPopup;
