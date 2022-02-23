import { ISingleKey } from "../interfaces/ISingleKey";

const keyboard: ISingleKey[][] = [];

const keyRow1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];

const keys1: ISingleKey[] = [];
keyRow1.forEach((keyCode) => {
  const key: ISingleKey = {
    value: keyCode,
    isWide: false,
    isBigText: false,
    status: 0,
  };
  keys1.push(key);
});

keyboard.push(keys1);

const keyRow2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];

const keys2: ISingleKey[] = [];
keyRow2.forEach((keyCode) => {
  const key: ISingleKey = {
    value: keyCode,
    isWide: false,
    isBigText: false,
    status: 0,
  };
  keys2.push(key);
});

keyboard.push(keys2);

const keys3: ISingleKey[] = [];
const enterKey: ISingleKey = {
  value: "enter",
  isWide: true,
  isBigText: false,
  status: 0,
};
keys3.push(enterKey);

const keyRow3 = ["z", "x", "c", "v", "b", "n", "m"];

keyRow3.forEach((keyCode) => {
  const key: ISingleKey = {
    value: keyCode,
    isWide: false,
    isBigText: false,
    status: 0,
  };
  keys3.push(key);
});

const deleteKey: ISingleKey = {
  value: "⌫",
  isWide: true,
  isBigText: true,
  status: 0,
};
keys3.push(deleteKey);

keyboard.push(keys3);

export default keyboard;
