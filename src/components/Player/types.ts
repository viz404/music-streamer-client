import { ISongInfo } from "../../pages/Home/types";

export interface props {
  songInfo: ISongInfo;
  isMember: boolean;
  onTimeUpdate?: (currentTime: number) => void;
  onStatusUpdate?: (isPlaying: boolean) => void;
}
