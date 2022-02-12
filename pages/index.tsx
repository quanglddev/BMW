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

import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [friends, setFriends] = useState<QueryDocumentSnapshot<DocumentData>[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const friendsQuery = query(usersCollection);

    const unsubscribeUser = onSnapshot(
      friendsQuery,
      { includeMetadataChanges: true },
      (querySnapshot) => {
        const result: QueryDocumentSnapshot<DocumentData>[] = [];

        console.log("Hello");
        // querySnapshot.docs.forEach((snapshot) => {
        //   result.push(snapshot);
        // });

        querySnapshot.forEach((snapshot) => {
          console.log(
            "🚀 ~ file: index.tsx ~ line 37 ~ querySnapshot.forEach ~ snapshot",
            snapshot.data()
          );
          result.push(snapshot);
        });

        setFriends(result);
      }
    );

    // return () => {
    //   unsubscribeUser();
    // };
  }, []);

  return (
    <div className={styles.container}>
      <div>
        {friends.map((friend) => {
          return (
            <div key={friend.id}>
              <p>Hello {friend.data().fullName}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
