import general from "../../common/general/general";
import { props } from "./types";

export default function ProgressBar({ current, max, onSeek }: props) {
  const percent = Math.round((current / max) * 100);

  const handleProgressBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const bar = event.currentTarget;
    const rect = bar.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const newCurrent = Math.round((offsetX / rect.width) * max);
    onSeek(newCurrent);
  };

  return (
    <div className="flex gap-2 text-zinc-300 items-center justify-between">
      <p className="w-[10%] text-right">{general.secondsToMinutes(current)}</p>
      <div
        className="w-[80%] h-1 bg-zinc-800 rounded-lg overflow-hidden"
        onClick={handleProgressBarClick}
      >
        <div className="bg-white h-1" style={{ width: percent + "%" }} />
      </div>
      <p className="w-[10%] text-left">{general.secondsToMinutes(max)}</p>
    </div>
  );
}
