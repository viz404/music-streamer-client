import { FormEvent, useContext } from "react";
import { GlobalContext } from "../../contexts";
import general from "../../common/general/general";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useContext(GlobalContext.Context);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { elements } = event.currentTarget;
    const usernameElement = elements.namedItem("username") as HTMLInputElement;
    const passwordElement = elements.namedItem("password") as HTMLInputElement;
    try {
      const response = await general.makeRequest({
        url: "/users/login",
        method: "POST",
        body: {
          username: usernameElement.value,
          password: passwordElement.value,
        }
      })

      if (response.error) {
        throw new Error(response.error.message);
      }

      login(usernameElement.value, response.data.userId);
    } catch (error) {
      toast("Login failed!");     
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-[#282828] rounded-lg py-7 px-10 bg-secondary">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              className="border-0 rounded-sm p-2 outline-zinc-700 w-full bg-zinc-700"
              autoFocus={true}
              required={true}
            />
          </div>
          <div className="flex gap-4 items-center">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="border-0 rounded-sm p-2 outline-zinc-700 w-full bg-zinc-700"
              required={true}
            />
          </div>
          <button
            type="submit"
            className="border-0 outline-[#1DB954] rounded-md py-2 px-4 bg-[#1DB954]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
