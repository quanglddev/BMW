import { Menu, MenuButton, MenuItem, MenuRadioGroup } from "@szhsin/react-menu";
import { doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState, MouseEvent } from "react";
import {
  boardSkinsCollection,
  firestore,
  usersCollection,
} from "../firebase/clientApp";
import {
  EmptyBoardSkin,
  IBoardCell,
  IBoardSkin,
} from "../interfaces/BoardSkin";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuthUser, withAuthUser } from "next-firebase-auth";

const BoardSelection = () => {
  const AuthUser = useAuthUser();
  const [boardId, setBoardId] = useState<string>("");
  const [board, setBoard] = useState<IBoardSkin>(EmptyBoardSkin);
  const [allBoards, setAllBoards] = useState<IBoardSkin[]>([]);
  const [madeChanges, setMadeChanges] = useState<boolean>(false);
  const [defaultData, setDefaultData] = useState<IBoardCell[]>([]);

  useEffect(() => {
    const boardsQuery = query(boardSkinsCollection);

    getDocs(boardsQuery).then((querySnapshot) => {
      if (querySnapshot.docs.length === 0) {
        return;
      }
      const dbBoards: IBoardSkin[] = [];

      querySnapshot.forEach((snapshot) => {
        const data = snapshot.data();
        dbBoards.push(data as IBoardSkin);
      });

      setAllBoards(dbBoards);
      const myBoard = dbBoards.find((board) => board.id === boardId);

      if (!myBoard) {
        return;
      }

      setBoard(myBoard);
      setMadeChanges(false);
    });
  }, [boardId]);

  useEffect(() => {
    const userQuery = query(usersCollection, where("id", "==", AuthUser.id));

    getDocs(userQuery).then((querySnapshot) => {
      if (querySnapshot.docs.length === 0) {
        return;
      }

      querySnapshot.forEach((snapshot) => {
        const data = snapshot.data();
        const boardId = data.board;
        setBoardId(boardId);
        return;
      });
    });
  }, [AuthUser.id]);

  useEffect(() => {
    const defaultData = Array(16)
      .fill(null)
      .map(() => getRandomCell());
    setDefaultData(defaultData);
  }, []);

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

  const getRandomCell = (): IBoardCell => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    const randomCharacter =
      alphabet[Math.floor(Math.random() * alphabet.length)];

    const newCell: IBoardCell = {
      value: randomCharacter,
      state: Math.floor(Math.random() * 4),
    };
    return newCell;
  };

  const getCellBorderWidth = (state: number) => {
    // 0: blank, 1: incorrect, 2: misplaced, 3: correct
    if (state === 0) {
      return board.blankBorderWidth;
    } else if (state === 1) {
      return board.wrongBorderWidth;
    } else if (state === 2) {
      return board.misplacedBorderWidth;
    } else if (state === 3) {
      return board.correctBorderWidth;
    }
  };

  const getCellBorderColor = (state: number) => {
    // 0: blank, 1: incorrect, 2: misplaced, 3: correct
    if (state === 0) {
      return board.blankBorderColor;
    } else if (state === 1) {
      return board.wrongBorderColor;
    } else if (state === 2) {
      return board.misplacedBorderColor;
    } else if (state === 3) {
      return board.correctBorderColor;
    }
  };

  const getCellBackgroundColor = (state: number) => {
    // 0: blank, 1: incorrect, 2: misplaced, 3: correct
    if (state === 0) {
      return board.blankBackgroundColor;
    } else if (state === 1) {
      return board.wrongBackgroundColor;
    } else if (state === 2) {
      return board.misplacedBackgroundColor;
    } else if (state === 3) {
      return board.correctBackgroundColor;
    }
  };

  const getCellTextColor = (state: number) => {
    // 0: blank, 1: incorrect, 2: misplaced, 3: correct
    if (state === 0) {
      return board.blankTextColor;
    } else if (state === 1) {
      return board.wrongTextColor;
    } else if (state === 2) {
      return board.misplacedTextColor;
    } else if (state === 3) {
      return board.correctTextColor;
    }
  };

  const onBoardChange = (boardId: string) => {
    const myBoard = allBoards.find((board) => board.id === boardId);

    if (!myBoard) {
      return;
    }

    setBoard(myBoard);
    setMadeChanges(true);
  };

  const onSaveBoardInfo = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    if (!AuthUser.id) {
      return;
    }

    const userDocRef = doc(firestore, "users", AuthUser.id);
    await updateDoc(userDocRef, {
      board: board.id,
    });

    setMadeChanges(false);
    displaySuccess("Save changes successfully!");
  };

  return (
    <div className="flex flex-col w-10/12 absolute top-24 right-0 drop-shadow-md">
      <div className="flex flex-col justify-center w-full rounded-l-md bg-white">
        <div className="ml-3 mt-3 text-2xl font-semibold">Board Skins</div>

        <div className="flex flex-row w-full justify-center mt-3">
          <div className="flex flex-row flex-wrap w-64 h-64">
            {defaultData.map((cell, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-center h-16 w-16 text-2xl rounded-md capitalize ${getCellBorderWidth(
                  cell.state
                )} ${getCellBorderColor(cell.state)} ${getCellBackgroundColor(
                  cell.state
                )} ${getCellTextColor(cell.state)}`}
              >
                {cell.value}
              </div>
            ))}
          </div>
        </div>

        <div className="ml-3 text-sm mt-3">Skin Name</div>
        <Menu
          menuButton={
            <MenuButton className="text-black rounded-sm p-2 w-11/12 drop-shadow-md bg-pink-light-1 ml-3 mt-1">
              {board.name}
            </MenuButton>
          }
          arrow
          viewScroll={"auto"}
          align="center"
        >
          <MenuRadioGroup
            value={board.id}
            onRadioChange={(e) => onBoardChange(e.value)}
          >
            {allBoards.map((board) => (
              <MenuItem key={board.id} value={board.id}>
                {board.name}
              </MenuItem>
            ))}
          </MenuRadioGroup>
        </Menu>

        <div className="flex flex-row items-center">
          <button
            type="submit"
            className={`flex flex-row w-28 h-12 bg-red-dark-99 rounded-xl mt-5 ml-3 items-center justify-center border-b-2 border-red-800 drop-shadow-2xl mb-5 ${
              madeChanges ? "opacity-100" : "opacity-50"
            }`}
            onClick={(e) => onSaveBoardInfo(e)}
            disabled={!madeChanges}
          >
            <div className="font-bold text-white">Save</div>
          </button>
          {madeChanges && (
            <div className="text-sm text-red-dark-99 ml-5">
              *changes unsaved
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default withAuthUser()(BoardSelection);
