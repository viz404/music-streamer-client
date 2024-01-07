export interface props {
  current: number;
  max: number;
  onSeek: (currentTime: number) => void;
}
