import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { firestore, usersCollection } from "../firebase/clientApp";
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

import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import Bluetooth from "../public/icons/bluetooth.svg";
import Wifi from "../public/icons/wifi.svg";
import Friends from "../public/icons/friends.svg";

const Home: NextPage = () => {
  // const AuthUser = useAuthUser();
  // const [friends, setFriends] = useState<QueryDocumentSnapshot<DocumentData>[]>(
  //   []
  // );
  // const [loading, setLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   const friendsQuery = query(usersCollection);

  //   const unsubscribeUser = onSnapshot(
  //     friendsQuery,
  //     { includeMetadataChanges: true },
  //     (querySnapshot) => {
  //       const result: QueryDocumentSnapshot<DocumentData>[] = [];

  //       console.log("Hello");
  //       // querySnapshot.docs.forEach((snapshot) => {
  //       //   result.push(snapshot);
  //       // });

  //       querySnapshot.forEach((snapshot) => {
  //         console.log(
  //           "🚀 ~ file: index.tsx ~ line 37 ~ querySnapshot.forEach ~ snapshot",
  //           snapshot.data()
  //         );
  //         result.push(snapshot);
  //       });

  //       setFriends(result);
  //     }
  //   );

  //   // return () => {
  //   //   unsubscribeUser();
  //   // };
  // }, []);

  return (
    // <div className={styles.container}>
    //   <div>
    //     {friends.map((friend) => {
    //       return (
    //         <div key={friend.id}>
    //           <p>Hello {friend.data().fullName}</p>
    //         </div>
    //       );
    //     })}
    //     <h1 className="text-3xl font-bold underline">Hello world!</h1>
    //   </div>
    // </div>
    <div className="relative flex w-screen h-screen flex-col items-center">
      {/* <div className="absolute w-full h-screen">
        <Image
          src={backgroundPic}
          alt="Background of the game"
          placeholder="blur" // Optional blur-up while loading
          layout="fill"
        />
      </div> */}
      <div className="z-50">
        <ResponsiveAppBar></ResponsiveAppBar>
      </div>

      <div className="flex w-full h-full flex-col items-center z-10 mt-12 bg-pink-light-1">
        <div className="text-black font-semibold text-4xl mx-16 text-center -mt-8">
          <span>Play Wordle</span> <span>for Free</span>{" "}
          <span>on the #1 Site!</span>
        </div>
        <div className="flex flex-row mt-4 text-sm">
          <div className="font-bold text-red-dark-99">9,999,025</div>
          <div className="text-gray-600 ml-2">Games Today</div>
        </div>
        <div className="flex flex-row mt-1 text-sm">
          <div className="font-bold text-red-dark-99">160,025</div>
          <div className="text-gray-600 ml-2">Playing Now</div>
        </div>

        {/* Bluetooth */}
        <div className="flex flex-row w-10/12 h-24 bg-red-dark-99 rounded-xl mt-5 items-center border-b-4 border-red-800 drop-shadow-2xl">
          <Bluetooth className="fill-current w-16 h-16 ml-3"></Bluetooth>
          <div className="flex flex-col ml-3">
            <div className="font-bold text-white text-xl">Local Match</div>
            <div className="text-gray-100 text-xs mt-1">
              Play with someone near you
            </div>
          </div>
        </div>

        {/* Wifi */}
        <div className="flex flex-row w-10/12 h-24 bg-pink-light-1 rounded-xl mt-5 items-center border-b-4 border-gray-500 drop-shadow-2xl">
          <Wifi className="fill-current w-16 h-16 ml-3"></Wifi>
          <div className="flex flex-col ml-3">
            <div className="font-bold text-gray-700 text-xl">Rank Match</div>
            <div className="text-gray-500 text-xs mt-1">
              Play with someone at your level
            </div>
          </div>
        </div>

        {/* Friends */}
        <div className="flex flex-row w-10/12 h-24 bg-pink-light-1 rounded-xl mt-5 items-center border-b-4 border-gray-500 drop-shadow-2xl">
          <Friends className="fill-current w-16 h-16 ml-3"></Friends>
          <div className="flex flex-col ml-3">
            <div className="font-bold text-gray-700 text-xl">
              Friendly Match
            </div>
            <div className="text-gray-500 text-xs mt-1">
              Play with your friends
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// // Note that this is a higher-order function.
// export const getServerSideProps = withAuthUserTokenSSR({
//   whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
// })();

// export default withAuthUser({
//   whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
// })(Home);

export default Home;
