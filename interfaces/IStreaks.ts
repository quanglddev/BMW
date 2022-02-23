export interface IStreaks {
  longestDailyStreak: number;
  longestPracticeStreak: number;
  longestRankStreak: number;
  currentDailyStreak: number;
  currentPracticeStreak: number;
  currentRankStreak: number;
}

export const EmptyStreaks: IStreaks = {
  longestDailyStreak: 0,
  longestPracticeStreak: 0,
  longestRankStreak: 0,
  currentDailyStreak: 0,
  currentPracticeStreak: 0,
  currentRankStreak: 0,
};
