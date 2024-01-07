import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "./contexts";
import { AuthStatus } from "./common/enums";
import Login from "./components/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Room from "./pages/Room/Room";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/room/:roomId",
    Component: Room,
  },
]);

export default function App() {
  const { authStatus } = useContext(GlobalContext.Context);

  return (
    <div className="font-sans bg-[#191414] text-white min-h-screen flex flex-col">
      <Navbar />
      <RouterProvider router={router} />
      {authStatus === AuthStatus.LOGGED_OUT && <Login />}
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  );
}
