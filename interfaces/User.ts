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
