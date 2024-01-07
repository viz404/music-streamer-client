import { props } from "./types";

export default function SearchBar({
  type,
  name,
  id,
  placeHolder,
  onSubmit,
  buttonText
}: props) {
  return (
    <form className="flex gap-4 md:gap-8" onSubmit={onSubmit}>
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeHolder}
        className="w-full p-4 border-0 rounded-lg outline-zinc-700 bg-zinc-700"
      />
      <button
        className="bg-[#1DB954] rounded-lg py-2 px-4 text-lg text-black active:scale-95 transition-transform duration-100"
        type="submit"
      >
        {buttonText || "Search"}
      </button>
    </form>
  );
}
