import { io, Socket } from "socket.io-client";
import config from "./config";
import { IUser } from "../contexts/GlobalContext/types";

// export const socket = io(config.BACKEND_URL, { transports: ["websocket"] });

class SocketClient {
  private socket?: Socket;

  connect(userId: string) {
    this.socket = io(config.BACKEND_URL, {
      transports: ["websocket"],
      query: { userId },
    });
  }

  createRoom(videoUrl: string) {
    if (!this.socket) return;
    this.socket.emit("createRoom", videoUrl);
  }

  joinRoom(roomId: string) {
    if (!this.socket) return;
    this.socket.emit("joinRoom", roomId);
  }

  leaveRoom(roomId: string) {
    if (!this.socket) return;
    this.socket.emit("leaveRoom", roomId);
  }

  deleteRoom() {
    if (!this.socket) return;
    this.socket.emit("deleteRoom");
  }

  updateTime(time: number) {
    if (!this.socket) return;
    this.socket.emit("updateTime", time);
  }

  updateStatus(status: string) {
    if (!this.socket) return;
    this.socket.emit("updateStatus", status);
  }

  disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
  }

  onEvent(eventName: string, callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on(eventName, callback);
  }

  onUserJoined(callback: (user: IUser) => void) {
    if (!this.socket) return;
    this.socket.on("userJoined", callback);
  }

  onUserLeft(callback: (user: IUser) => void) {
    if (!this.socket) return;
    this.socket.on("userLeft", callback);
  }

  onRoomCreated(callback: (roomId: string, userId: string) => void) {
    if (!this.socket) return;
    this.socket.on("roomCreated", callback);
  }

  onRoomExists(callback: (roomId: string) => void) {
    if (!this.socket) return;
    this.socket.on("roomExists", callback);
  }

  onRoomNotFound(callback: (roomId: string) => void) {
    if (!this.socket) return;
    this.socket.on("roomNotFound", callback);
  }

  onRoomDeleted(callback: (roomId: string) => void) {
    if (!this.socket) return;
    this.socket.on("roomDeleted", callback);
  }

  onUpdateTime(callback: (time: number) => void) {
    if (!this.socket) return;
    this.socket.on("updateTime", callback);
  }

  onUpdateStatus(callback: (status: string) => void) {
    if (!this.socket) return;
    this.socket.on("updateStatus", callback);
  }
}

const socketClient = new SocketClient();

export default socketClient;
