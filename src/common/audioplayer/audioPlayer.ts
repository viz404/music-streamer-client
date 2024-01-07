class AudioPlayer {
  private audio = new Audio();
  load = (src: string) => {
    this.audio.src = src;
    this.audio.crossOrigin = window.location.origin;
  };
  play = () => {
    if (this.canPlay() && !this.isPlaying()) this.audio.play();
  };
  pause = () => {
    this.audio.pause();
  };
  getCurrentTime = () => {
    return this.audio.currentTime;
  };
  setCurrentTime = (time: number) => {
    this.audio.currentTime = time;
  };
  setTimeUpdate = (onUpdate: (time: number) => void) => {
    this.audio.ontimeupdate = () => {
      onUpdate(this.audio.currentTime);
    };
  };
  setOnEnd = (onEnd: () => void) => {
    this.audio.onended = () => {
      onEnd();
    };
  };
  isPlaying = () => {
    return !this.audio.paused;
  };
  canPlay = () => {
    return this.audio.readyState >= 3;
  };
  destroy = () => {
    this.audio.pause();
    this.audio.ontimeupdate = null;
    this.audio.onended = null;
  };
  getInstance = () => {
    return this.audio;
  };
}

const audioPlayer = new AudioPlayer();

export default audioPlayer;
