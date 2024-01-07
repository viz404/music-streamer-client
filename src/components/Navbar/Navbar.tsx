import { useContext } from "react";
import { GlobalContext } from "../../contexts";

export default function Navbar() {
  const { user, logout } = useContext(GlobalContext.Context);
  return (
    <nav>
      <div className="pt-4 px-7 flex justify-between items-center">
        <h1 className="text-lg">Welcome, {user?.username}</h1>
        <button onClick={logout} className="bg-zinc-700 p-2 rounded-lg active:scale-95 transition-transform duration-100">
          Logout
        </button>
      </div>
    </nav>
  );
}
