import { useEffect, useState } from "react";
import playIcon from "../../assets/play.svg";
import pauseIcon from "../../assets/pause.svg";
import ProgressBar from "../ProgressBar/ProgressBar";
import config from "../../common/config";
import { props } from "./types";
import audioPlayer from "../../common/audioplayer/audioPlayer";

export default function Player({
  songInfo,
  isMember,
  onTimeUpdate,
  onStatusUpdate,
}: props) {
  const [currentTime, setCurrentTime] = useState(0);
// get user from context and if not a member, createRoom
  useEffect(() => {
    audioPlayer.load(`${config.BACKEND_URL}/api/v1/videos/stream?videoUrl=${songInfo.url}`);
    audioPlayer.setTimeUpdate((time) => {
      setCurrentTime(time);
      if (onTimeUpdate) {
        onTimeUpdate(time);
      }
    });
    audioPlayer.setOnEnd(() => {
      audioPlayer.pause();
      audioPlayer.setCurrentTime(0);
    });

    return () => {
      audioPlayer.destroy();
    };
  }, [songInfo]);

  const handlePlay = () => {
    if (audioPlayer.isPlaying()) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }
    if (onStatusUpdate) {
      onStatusUpdate(audioPlayer.isPlaying());
    }
  };

  const handleSeek = (time: number) => {
    if (!isMember) {
      audioPlayer.setCurrentTime(time);
    }
  };

  return (
    <div className="bg-zinc-700 py-4 px-8 rounded-lg w-full flex flex-col gap-2">
      <img
        src={songInfo.thumbnail}
        alt={songInfo.title}
        className="rounded-lg "
      />
      <div>
        <h1 className="text-lg">{songInfo.title}</h1>
        <h1 className="text-zinc-300 hover:text-white transition-colors duration-300">
          {songInfo.author}
        </h1>
      </div>
      {!isMember && (
        <div className="flex gap-4 items-center">
          <button
            className="bg-[#1DB954] p-3 rounded-[50%] active:scale-95 transition-transform duration-100"
            onClick={handlePlay}
          >
            <img
              src={audioPlayer.isPlaying() ? pauseIcon : playIcon}
              alt="play icon"
              className="w-7"
            />
          </button>
        </div>
      )}
      <ProgressBar
        current={currentTime}
        max={songInfo.duration}
        onSeek={handleSeek}
      />
    </div>
  );
}
