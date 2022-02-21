import {
  arrayRemove,
  arrayUnion,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore, usersCollection } from "../firebase/clientApp";
import IUser from "../interfaces/User";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuthUser, withAuthUser } from "next-firebase-auth";

const FriendSettings = () => {
  const AuthUser = useAuthUser();
  const [user, setUser] = useState<IUser>({
    id: "",
    fullName: "",
    imageUrl: "",
    email: "",
    isPlaying: false,
    lastActivity: new Date(),
    buddies: [],
    dailyPuzzleCompleted: new Date(),
    country: "",
    aboutMe: "",
    board: "default",
    inFriendRequests: [],
    outFriendRequests: [],
    currentDailyStreak: 0,
    longestDailyStreak: 0,
    currentPracticeStreak: 0,
    longestPracticeStreak: 0,
    currentRankStreak: 0,
    longestRankStreak: 0,
  });
  const [allFriends, setAllFriends] = useState<IUser[]>([]);
  const [allFriendRequests, setAllFriendRequests] = useState<IUser[]>([]);
  const [email, setEmail] = useState<string>("");
  const [reloadRequest, setReloadRequest] = useState<boolean>(false);

  useEffect(() => {
    const userQuery = query(usersCollection, where("id", "==", AuthUser.id));

    getDocs(userQuery).then((querySnapshot) => {
      if (querySnapshot.docs.length === 0) {
        return;
      }

      querySnapshot.forEach((snapshot) => {
        const data = snapshot.data();
        const user: IUser = {
          id: snapshot.id,
          fullName: data.fullName,
          email: data.email,
          imageUrl: data.imageUrl,
          isPlaying: data.isPlaying,
          lastActivity: new Date(data.lastActivity.seconds * 1000),
          buddies: data.buddies,
          dailyPuzzleCompleted: data.dailyPuzzleCompleted,
          country: data.country,
          aboutMe: data.aboutMe,
          board: data.board,
          inFriendRequests: data.inFriendRequests,
          outFriendRequests: data.outFriendRequests,
          currentDailyStreak: data.currentDailyStreak,
          longestDailyStreak: data.longestDailyStreak,
          currentPracticeStreak: data.currentPracticeStreak,
          longestPracticeStreak: data.longestPracticeStreak,
          currentRankStreak: data.currentRankStreak,
          longestRankStreak: data.longestRankStreak,
        };
        setUser(user);
        return;
      });
    });
  }, [AuthUser.id]);

  useEffect(() => {
    const friendsQuery = query(
      usersCollection,
      where("buddies", "array-contains", AuthUser.id)
    );

    getDocs(friendsQuery).then((querySnapshot) => {
      const result: IUser[] = [];

      querySnapshot.forEach((snapshot) => {
        const data = snapshot.data();
        const newFriend: IUser = data as IUser;
        result.push(newFriend);
      });

      setAllFriends(result);
    });
  }, [reloadRequest, AuthUser.id]);

  useEffect(() => {
    const friendRequestsQuery = query(
      usersCollection,
      where("outFriendRequests", "array-contains", AuthUser.id)
    );

    getDocs(friendRequestsQuery).then((querySnapshot) => {
      const result: IUser[] = [];

      querySnapshot.forEach((snapshot) => {
        const data = snapshot.data();
        const newRequest: IUser = data as IUser;
        result.push(newRequest);
      });

      setAllFriendRequests(result);
    });
  }, [reloadRequest, AuthUser.id]);

  const displayError = (message: string) => {
    const errorAlert = withReactContent(Swal);

    errorAlert
      .fire({
        title: "Error",
        text: message,
        icon: "error",
      })
      .then(() => {});
  };

  const displaySuccess = (message: string) => {
    const errorAlert = withReactContent(Swal);

    errorAlert
      .fire({
        title: "Success",
        text: message,
        icon: "success",
      })
      .then(() => {});
  };

  const onRequestFriendship = () => {
    if (email === user.email) {
      displayError(
        `Being alone does not mean you are lonely. And being lonely does not mean you are alone. But this is very sad.`
      );
      return;
    }

    const userQuery = query(usersCollection, where("email", "==", email));

    getDocs(userQuery).then((querySnapshot) => {
      if (querySnapshot.docs.length === 0) {
        displayError(`User with email: ${email} not found. Please try again.`);
        return;
      }

      querySnapshot.forEach(async (snapshot) => {
        const data = snapshot.data();
        const foundUser: IUser = data as IUser;
        const foundDocRef = doc(firestore, "users", foundUser.id);
        await updateDoc(foundDocRef, {
          inFriendRequests: arrayUnion(user.id),
        });

        const userDocRef = doc(firestore, "users", user.id);
        await updateDoc(userDocRef, {
          outFriendRequests: arrayUnion(foundUser.id),
        });
        setEmail("");
        displaySuccess("Sent request successfully!");
        setReloadRequest(!reloadRequest);
        return;
      });
    });
  };

  const onRemoveFriend = async (selectedFriend: IUser) => {
    const foundDocRef = doc(firestore, "users", selectedFriend.id);
    await updateDoc(foundDocRef, {
      buddies: arrayRemove(user.id),
    });

    const userDocRef = doc(firestore, "users", user.id);
    await updateDoc(userDocRef, {
      buddies: arrayRemove(selectedFriend.id),
    });
    displaySuccess("Removed friend successfully!");
    setReloadRequest(!reloadRequest);
  };

  const onApproveFriendRequest = async (selectedFriend: IUser) => {
    const foundDocRef = doc(firestore, "users", selectedFriend.id);
    await updateDoc(foundDocRef, {
      outFriendRequests: arrayRemove(user.id),
      buddies: arrayUnion(user.id),
    });

    const userDocRef = doc(firestore, "users", user.id);
    await updateDoc(userDocRef, {
      inFriendRequests: arrayRemove(selectedFriend.id),
      buddies: arrayUnion(selectedFriend.id),
    });
    displaySuccess("Approve friend request successfully!");
    setReloadRequest(!reloadRequest);
  };

  const onDeclineFriendRequest = async (selectedFriend: IUser) => {
    const foundDocRef = doc(firestore, "users", selectedFriend.id);
    await updateDoc(foundDocRef, {
      outFriendRequests: arrayRemove(user.id),
    });

    const userDocRef = doc(firestore, "users", user.id);
    await updateDoc(userDocRef, {
      inFriendRequests: arrayRemove(selectedFriend.id),
    });
    displaySuccess("Decline friend request successfully!");
    setReloadRequest(!reloadRequest);
  };

  const emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);

  return (
    <div className="flex flex-col w-10/12 absolute top-24 right-0 drop-shadow-md">
      <div className="flex flex-col justify-center w-full rounded-l-md bg-white">
        <div className="ml-3 mt-3 text-2xl font-semibold">Friends</div>

        <div className="flex flex-row items-center ml-3 mt-3">
          <div className="flex flex-row items-center rounded-md h-8 bg-pink-light-1 w-7/12 drop-shadow-md">
            <input
              type="text"
              className="ml-2 text-md text-black bg-pink-light-1"
              placeholder="Search members"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            className={`flex items-center justify-center h-8 w-4/12 rounded-md bg-gray-dark ml-3 ${
              emailValid ? "opacity-100" : "opacity-50"
            }`}
            disabled={!emailValid}
            onClick={() => onRequestFriendship()}
          >
            <div className="text-white">Add Friend</div>
          </button>
        </div>

        <div className="font-bold text-xs text-gray-700 ml-3 mt-5">
          Friends - {allFriends.length}
        </div>

        {allFriends.map((friend) => (
          <div
            key={friend.id}
            className="flex flex-row h-8 w-11/12 ml-3 mt-1 justify-between items-center border-b-2 border-red-dark-99"
          >
            <div className="truncate w-9/12">{friend.email}</div>
            <div
              className="text-sm text-gray-600"
              onClick={() => onRemoveFriend(friend)}
            >
              Remove
            </div>
          </div>
        ))}

        <div className="font-bold text-xs text-gray-700 ml-3 mt-8">
          Requests - {allFriendRequests.length}
        </div>

        {allFriendRequests.map((friend) => (
          <div key={friend.id} className="flex flex-col w-11/12">
            <div className="flex flex-row h-8 w-full ml-3 mt-1 justify-between items-center">
              <div className="truncate w-full">{friend.email}</div>
            </div>
            <div className="flex flex-row items-center justify-around ml-3 border-b-2 border-red-dark-99 mt-1">
              <div
                className="text-sm font-semibold text-red-600"
                onClick={() => onDeclineFriendRequest(friend)}
              >
                Decline
              </div>
              <div
                className="text-sm font-semibold text-green-600"
                onClick={() => onApproveFriendRequest(friend)}
              >
                Approve
              </div>
            </div>
          </div>
        ))}

        <div className="mt-1 flex flex-row h-4 w-11/12 ml-3 justify-between items-center"></div>
      </div>
    </div>
  );
};
export default withAuthUser()(FriendSettings);
