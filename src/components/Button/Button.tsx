import { props } from "./types";

export default function Button({
  text,
  bgColor = "#1DB954",
  textColor = "black",
  onClick,
}: props) {
  return (
    <button
      onClick={onClick}
      className={`bg-[${bgColor}] text-${textColor} p-2 rounded-lg active:scale-95 transition-transform duration-100`}
    >
      {text}
    </button>
  );
}
