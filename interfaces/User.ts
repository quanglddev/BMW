export default interface IUser {
  id: string;
  isPlaying: boolean;
  isOnline: boolean;
  buddies: IUser[];
}
