import { getDocs, query, where } from "firebase/firestore";
import { IBoardSkin } from "../interfaces/BoardSkin";
import { boardSkinsCollection } from "./clientApp";

export const queryBoardSkin = async (boardId: string) => {
  const boardsQuery = query(boardSkinsCollection, where("id", "==", boardId));

  const querySnapshot = await getDocs(boardsQuery);
  if (querySnapshot.docs.length === 0) {
    return;
  }

  const data = querySnapshot.docs[0].data();
  const boardSkin = data as IBoardSkin;
  return boardSkin;
};
