export enum AnnouncementStatus {
  success,
  failure,
}

export interface IAnnouncement {
  userId: string;
  status: AnnouncementStatus;
  title: string;
  message: string;
  buttonText: string;
  onMainButtonClick: () => void;
  onClose: () => void;
}
