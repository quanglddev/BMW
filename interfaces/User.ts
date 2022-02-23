export default interface IUser {
  id: string;
  fullName: string;
  imageUrl: string;
  email: string;
  isPlaying: boolean;
  lastActivity: Date;
  buddies: string[];
  country: string;
  aboutMe: string;
  board: string;
  inFriendRequests: string[];
  outFriendRequests: string[];
  currentDailyStreak: number;
  longestDailyStreak: number;
  dailyPuzzleCompleted: Date;
  currentPracticeStreak: number;
  longestPracticeStreak: number;
  currentRankStreak: number;
  longestRankStreak: number;
}

export const EmptyUser: IUser = {
  id: "",
  fullName: "",
  imageUrl: "",
  email: "",
  isPlaying: false,
  lastActivity: new Date(0),
  buddies: [],
  country: "",
  aboutMe: "",
  board: "default",
  inFriendRequests: [],
  outFriendRequests: [],
  currentDailyStreak: 0,
  longestDailyStreak: 0,
  dailyPuzzleCompleted: new Date(0),
  currentPracticeStreak: 0,
  longestPracticeStreak: 0,
  currentRankStreak: 0,
  longestRankStreak: 0,
};
