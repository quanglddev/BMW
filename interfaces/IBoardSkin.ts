export interface IBoardSkin {
  id: string;
  name: string;
  blankBorderWidth: string;
  blankBorderColor: string;
  blankBackgroundColor: string;
  blankTextColor: string;
  wrongBorderWidth: string;
  wrongBorderColor: string;
  wrongBackgroundColor: string;
  wrongTextColor: string;
  misplacedBorderWidth: string;
  misplacedBorderColor: string;
  misplacedBackgroundColor: string;
  misplacedTextColor: string;
  correctBorderWidth: string;
  correctBorderColor: string;
  correctBackgroundColor: string;
  correctTextColor: string;
}

export interface IBoardCell {
  value: string;
  state: number;
}

export const EmptyBoardSkin: IBoardSkin = {
  id: "",
  name: "",
  blankBorderWidth: "",
  blankBorderColor: "",
  blankBackgroundColor: "",
  blankTextColor: "",
  wrongBorderWidth: "",
  wrongBorderColor: "",
  wrongBackgroundColor: "",
  wrongTextColor: "",
  misplacedBorderWidth: "",
  misplacedBorderColor: "",
  misplacedBackgroundColor: "",
  misplacedTextColor: "",
  correctBorderWidth: "",
  correctBorderColor: "",
  correctBackgroundColor: "",
  correctTextColor: "",
};
