interface Key {
  value: string;
  isWide: boolean;
  isBigText: boolean;
}

const keyboard: Key[][] = [];

const keyRow1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];

const keys1: Key[] = [];
keyRow1.forEach((keyCode) => {
  const key: Key = {
    value: keyCode,
    isWide: false,
    isBigText: false,
  };
  keys1.push(key);
});

keyboard.push(keys1);

const keyRow2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];

const keys2: Key[] = [];
keyRow2.forEach((keyCode) => {
  const key: Key = {
    value: keyCode,
    isWide: false,
    isBigText: false,
  };
  keys2.push(key);
});

keyboard.push(keys2);

const keys3: Key[] = [];
const enterKey: Key = {
  value: "enter",
  isWide: true,
  isBigText: false,
};
keys3.push(enterKey);

const keyRow3 = ["z", "x", "c", "v", "b", "n", "m"];

keyRow3.forEach((keyCode) => {
  const key: Key = {
    value: keyCode,
    isWide: false,
    isBigText: false,
  };
  keys3.push(key);
});

const deleteKey: Key = {
  value: "␡",
  isWide: false,
  isBigText: true,
};
keys3.push(deleteKey);

keyboard.push(keys3);

export default keyboard;
