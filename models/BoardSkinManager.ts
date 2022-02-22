import { IBoardCell, IBoardSkin } from "../interfaces/BoardSkin";

export default class BoardSkinManager {
  constructor(public cells: IBoardCell[], public boardSkin: IBoardSkin) {}

  getCellBorderWidth = (state: number) => {
    // 0: blank, 1: incorrect, 2: misplaced, 3: correct
    if (state === 0) {
      return this.boardSkin.blankBorderWidth;
    } else if (state === 1) {
      return this.boardSkin.wrongBorderWidth;
    } else if (state === 2) {
      return this.boardSkin.misplacedBorderWidth;
    } else if (state === 3) {
      return this.boardSkin.correctBorderWidth;
    }
  };

  getCellBorderColor = (state: number) => {
    // 0: blank, 1: incorrect, 2: misplaced, 3: correct
    if (state === 0) {
      return this.boardSkin.blankBorderColor;
    } else if (state === 1) {
      return this.boardSkin.wrongBorderColor;
    } else if (state === 2) {
      return this.boardSkin.misplacedBorderColor;
    } else if (state === 3) {
      return this.boardSkin.correctBorderColor;
    }
  };

  getCellBackgroundColor = (state: number) => {
    // 0: blank, 1: incorrect, 2: misplaced, 3: correct
    if (state === 0) {
      return this.boardSkin.blankBackgroundColor;
    } else if (state === 1) {
      return this.boardSkin.wrongBackgroundColor;
    } else if (state === 2) {
      return this.boardSkin.misplacedBackgroundColor;
    } else if (state === 3) {
      return this.boardSkin.correctBackgroundColor;
    }
  };

  getCellTextColor = (state: number) => {
    // 0: blank, 1: incorrect, 2: misplaced, 3: correct
    if (state === 0) {
      return this.boardSkin.blankTextColor;
    } else if (state === 1) {
      return this.boardSkin.wrongTextColor;
    } else if (state === 2) {
      return this.boardSkin.misplacedTextColor;
    } else if (state === 3) {
      return this.boardSkin.correctTextColor;
    }
  };

  private getKeyState = (keyCode: string) => {
    let result = 0;

    this.cells.forEach((cell) => {
      if (cell.value.toLowerCase() === keyCode.toLowerCase()) {
        if (result < 3 && cell.state === 3) {
          result = cell.state;
        } else if (result < 2 && cell.state === 2) {
          result = cell.state;
        } else if (result < 1 && cell.state === 1) {
          result = cell.state;
        }
      }
    });

    return result;
  };

  getKeyBorderWidth = (keyCode: string) => {
    // 0: blank, 1: incorrect, 2: misplaced, 3: correct
    const state = this.getKeyState(keyCode);

    if (state === 0) {
      return this.boardSkin.blankBorderWidth;
    } else if (state === 1) {
      return this.boardSkin.wrongBorderWidth;
    } else if (state === 2) {
      return this.boardSkin.misplacedBorderWidth;
    } else if (state === 3) {
      return this.boardSkin.correctBorderWidth;
    }
  };

  getKeyBorderColor = (keyCode: string) => {
    // 0: blank, 1: incorrect, 2: misplaced, 3: correct
    const state = this.getKeyState(keyCode);

    if (state === 0) {
      return this.boardSkin.blankBorderColor;
    } else if (state === 1) {
      return this.boardSkin.wrongBorderColor;
    } else if (state === 2) {
      return this.boardSkin.misplacedBorderColor;
    } else if (state === 3) {
      return this.boardSkin.correctBorderColor;
    }
  };

  getKeyBackgroundColor = (keyCode: string) => {
    // 0: blank, 1: incorrect, 2: misplaced, 3: correct
    const state = this.getKeyState(keyCode);

    if (state === 0) {
      return this.boardSkin.blankBackgroundColor;
    } else if (state === 1) {
      return this.boardSkin.wrongBackgroundColor;
    } else if (state === 2) {
      return this.boardSkin.misplacedBackgroundColor;
    } else if (state === 3) {
      return this.boardSkin.correctBackgroundColor;
    }
  };

  getKeyTextColor = (keyCode: string) => {
    // 0: blank, 1: incorrect, 2: misplaced, 3: correct
    const state = this.getKeyState(keyCode);

    if (state === 0) {
      return this.boardSkin.blankTextColor;
    } else if (state === 1) {
      return this.boardSkin.wrongTextColor;
    } else if (state === 2) {
      return this.boardSkin.misplacedTextColor;
    } else if (state === 3) {
      return this.boardSkin.correctTextColor;
    }
  };
}
