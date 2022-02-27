export interface IRoom {
  id: string;
  side1: string;
  side2: string;
  side1Board: string;
  side2Board: string;
  side1LastPresence: Date;
  side2LastPresence: Date;
  word: string;
  finishedTime?: Date;
  winner?: string;
}
