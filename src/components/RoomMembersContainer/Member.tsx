import { memberProps } from "./types";

export default function Member({ imageUrl, name }: memberProps) {
  return (
    <div className="flex items-center rounded-2xl py-1 px-2 gap-4 bg-black">
      <img src={imageUrl} width="50px" alt="profile" />
      <p>{name}</p>
    </div>
  );
}
