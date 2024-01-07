import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { IGlobalContext, IGlobalState } from "./types";
import { AuthStatus } from "../../common/enums";
import socketClient from "../../common/socketClient";

const Context = createContext<IGlobalContext>({
  authStatus: AuthStatus.LOADING,
  login() {},
  logout() {},
});

const Provider = ({ children }: PropsWithChildren) => {
  const [globalState, setGlobalState] = useState<IGlobalState>({
    authStatus: AuthStatus.LOADING,
  });

  useEffect(() => {
    (() => {
      const localStorageUser = localStorage.getItem("user");
      if (!localStorageUser) {
        setGlobalState((prev) => ({
          ...prev,
          authStatus: AuthStatus.LOGGED_OUT,
        }));
        return;
      }

      const parsedUser = JSON.parse(localStorageUser);

      setGlobalState((prev) => ({
        ...prev,
        authStatus: AuthStatus.LOGGED_IN,
        user: parsedUser,
      }));
      socketClient.connect(parsedUser.userId);
    })();
  }, []);

  const login = (username: string, userId: string) => {
    socketClient.connect(userId);
    setGlobalState((prev) => ({
      ...prev,
      authStatus: AuthStatus.LOGGED_IN,
      user: {
        username,
        userId,
      }
    }));
    localStorage.setItem("user", JSON.stringify({username, userId}));
  };

  const logout = () => {
    setGlobalState({
      authStatus: AuthStatus.LOGGED_OUT,
    });
    localStorage.clear();
    socketClient.disconnect();
  };

  return (
    <Context.Provider
      value={{
        authStatus: globalState.authStatus,
        user: globalState.user,
        login,
        logout,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default {
  Context,
  Provider,
};
