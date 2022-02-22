export interface IDailyPuzzle {
  word: string;
  lastUpdated: Date;
}

export const EmptyDailyPuzzle = {
  word: "",
  lastUpdated: new Date(0),
};
