export default interface IUser {
  id: string;
  fullName: string;
  imageUrl: string;
  email: string;
  isPlaying: boolean;
  lastActivity: Date;
  buddies: string[];
  currentStreak: number;
  dailyPuzzleCompleted: Date;
  longestStreak: number;
  wonGames: number;
  country: string;
  aboutMe: string;
  board: string;
  inFriendRequests: string[];
  outFriendRequests: string[];
}
