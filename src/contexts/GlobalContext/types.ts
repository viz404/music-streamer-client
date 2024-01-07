import { AuthStatus } from "../../common/enums";

export interface IGlobalState {
  authStatus: AuthStatus;
  user?: IUser;
}

export interface IGlobalContext extends IGlobalState {
  login: (username: string, userId: string) => void;
  logout: () => void;
}

export interface IUser {
  username: string;
  userId: string;
}
