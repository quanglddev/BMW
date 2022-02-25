import { doc, getDocs, query, Timestamp, updateDoc } from "firebase/firestore";
import { IRoom } from "../interfaces/IRoom";
import { firestore, roomsCollection } from "./clientApp";

export const queryRoomDetail = async (roomId: string) => {
  const roomQuery = query(roomsCollection);

  const querySnapshot = await getDocs(roomQuery);
  if (querySnapshot.docs.length === 0) {
    return;
  }

  const data = querySnapshot.docs[0].data();
  const room = data as IRoom;

  return room;
};

export const getEncodedBoard = (userId: string, roomDetail: IRoom) => {
  if (roomDetail.side1 === userId) {
    return roomDetail.side1Board;
  } else if (roomDetail.side2 === userId) {
    return roomDetail.side2Board;
  }
  return "";
};

export const closeRoomIfWon = async (
  userId: string,
  won: boolean,
  roomDetail: IRoom
) => {
  if (won) {
    const foundDocRef = doc(firestore, "rooms", roomDetail.id);

    const today = new Date();
    await updateDoc(foundDocRef, {
      winner: userId,
      finishedTime: Timestamp.fromDate(today),
    });
  }
};

export const updatePresenceOnRoom = async (userId: string, roomId: string) => {
  const roomDetail = await queryRoomDetail(roomId);

  if (!roomDetail) {
    return;
  }

  const foundDocRef = doc(firestore, "rooms", roomDetail.id);
  const current = new Date();

  if (roomDetail.side1 === userId) {
    await updateDoc(foundDocRef, {
      side1LastPresence: Timestamp.fromDate(current),
    });
  } else if (roomDetail.side2 === userId) {
    await updateDoc(foundDocRef, {
      side2LastPresence: Timestamp.fromDate(current),
    });
  }
};

export const playerDisconnected = async (userId: string, roomDetail: IRoom) => {
  const current = new Date();
  if (current.getTime() - roomDetail.side1LastPresence.getTime() > 60 * 1000) {
    return roomDetail.side1;
  }
  if (current.getTime() - roomDetail.side2LastPresence.getTime() > 60 * 1000) {
    return roomDetail.side2;
  }
  return undefined;
};
