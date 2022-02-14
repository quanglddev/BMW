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

const Home: NextPage = () => {
  const AuthUser = useAuthUser();
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
    <div className="relative flex w-screen h-screen flex-col items-center bg-navigation-bar">
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

      <div className="flex w-full h-full flex-col items-center z-10 mt-12">
        <div className="text-white font-semibold text-4xl mx-16 text-center -mt-8">
          <span>Play Wordle</span> <span>for Free</span>{" "}
          <span>on the #1 Site!</span>
        </div>
        <div className="flex flex-row mt-4 text-sm">
          <div className="font-bold text-white">9,999,025</div>
          <div className="text-icon ml-2">Games Today</div>
        </div>
        <div className="flex flex-row mt-1 text-sm">
          <div className="font-bold text-white">160,025</div>
          <div className="text-icon ml-2">Playing Now</div>
        </div>

        {/* Bluetooth */}
        <div className="flex flex-row w-10/12 h-24 bg-button-2 rounded-xl mt-5 items-center border-b-4 border-btn">
          <svg className="fill-current w-16 h-16 ml-3" viewBox="0 0 48 48">
            <path
              fill="#3F51B5"
              d="M24.501,45C33.084,45,39,40.743,39,24.5C39,8.249,33.084,4,24.501,4C15.918,4,10,8.249,10,24.5C10,40.743,15.918,45,24.501,45L24.501,45z"
            />
            <path
              fill="#FFF"
              d="M33.279,17.616L23,7.267V21l-5.651-5.781l-2.055,2.072l7.094,7.166l-7.094,7.168l2.054,2.072L23,28v13.647l10.277-10.35l-6.785-6.841L33.279,17.616z M26,13.969l3.172,3.295L26,20.581V13.969z M29.172,31.264L26,34.581v-6.612L29.172,31.264z"
            />
          </svg>
          <div className="flex flex-col ml-3">
            <div className="font-bold text-white text-xl">Local Match</div>
            <div className="text-gray-100 text-xs mt-1">
              Play with someone near you
            </div>
          </div>
        </div>

        {/* Wifi */}
        <div className="flex flex-row w-10/12 h-24 bg-button-3 rounded-xl mt-5 items-center border-b-4 border-btn-1">
          <svg className="fill-current w-16 h-16 ml-3" viewBox="0 0 48 48">
            <path
              fill="#2196F3"
              d="M24 37A3 3 0 1 0 24 43 3 3 0 1 0 24 37zM2 18.898l3.55 3.551c10.28-9.908 26.62-9.908 36.9 0L46 18.898C33.762 7.033 14.238 7.033 2 18.898z"
            />
            <path
              fill="#2196F3"
              d="M8.39,25.291l3.559,3.561c6.753-6.384,17.351-6.384,24.104,0l3.559-3.561C30.896,16.948,17.104,16.948,8.39,25.291z"
            />
            <path
              fill="#2196F3"
              d="M14.788,31.691l3.55,3.552c3.222-2.867,8.102-2.866,11.325,0l3.549-3.55C28.025,26.873,19.973,26.874,14.788,31.691z"
            />
          </svg>
          <div className="flex flex-col ml-3">
            <div className="font-bold text-gray-1 text-xl">Rank Match</div>
            <div className="text-gray-1 text-xs mt-1">
              Play with someone at your level
            </div>
          </div>
        </div>

        {/* Wifi */}
        <div className="flex flex-row w-10/12 h-24 bg-button-3 rounded-xl mt-5 items-center border-b-4 border-btn-1">
          <svg className="fill-current w-16 h-16 ml-3" viewBox="0 0 48 48">
            <path
              fill="#3F51B5"
              d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
            />
            <path
              fill="#FFF"
              d="M16 14A2 2 0 1 0 16 18 2 2 0 1 0 16 14zM22.5 13A2.5 2.5 0 1 0 22.5 18 2.5 2.5 0 1 0 22.5 13zM30 12A3 3 0 1 0 30 18 3 3 0 1 0 30 12zM35 36v-8.5c0-3.037-2.463-5.5-5.5-5.5S24 24.463 24 27.5V36H35z"
            />
            <path
              fill="#FFF"
              d="M27,32v-7.16c0-2.12-1.79-3.84-4-3.84c-2.208,0-4,1.72-4,3.84V32H27z"
            />
            <path
              fill="#FFF"
              d="M20,29v-5.25c0-2.072-1.568-3.75-3.5-3.75c-1.934,0-3.5,1.678-3.5,3.75V29H20z"
            />
          </svg>
          <div className="flex flex-col ml-3">
            <div className="font-bold text-gray-1 text-xl">Friendly Match</div>
            <div className="text-gray-1 text-xs mt-1">
              Play with your friends
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Note that this is a higher-order function.
export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})();

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);
