import { useContext, useEffect, useState } from "react";
import Member from "./Member";
import { roomMemberContainerProps } from "./types";
import { GlobalContext } from "../../contexts";
import { IUser } from "../../contexts/GlobalContext/types";
import toast from "react-hot-toast";
import socketClient from "../../common/socketClient";

export default function RoomMembersContainer({
  roomId,
}: roomMemberContainerProps) {
  const [members, setMembers] = useState<IUser[]>([]);
  const { user } = useContext(GlobalContext.Context);

  useEffect(() => {
    if (roomId) {
      socketClient.onUserJoined((member) => {
        setMembers(prev => {
          const userExists = prev.find(user => user.userId === member.userId);
          if (userExists) {
            return prev;
          } else {
            return [...prev, member];
          }
        });
      });
      socketClient.onUserLeft((member) => {
        setMembers(prev => {
          const userExists = prev.find(user => user.userId === member.userId);
          if (userExists) {
            return prev.filter(user => user.userId !== member.userId);
          } else {
            return prev;
          }
        });
      });
    }
  }, [setMembers, roomId]);

  const handleInviteClick = () => {
    if (!roomId) return;

    navigator.clipboard.writeText(roomId);
    toast.success("Room id copied");
  }

  return (
    <div className="bg-zinc-700 rounded-lg max-h-[50vh] flex flex-col">
      <div className="p-4">
        <p className="text-center text-lg">
          {user ? `${user.username}'s ` : "Your "}room members
        </p>
      </div>
      <div className="px-4 flex flex-col gap-2 overflow-y-auto">
        {
          members.length > 0 ? 
            members.map(member => (
              <Member
                key={member.userId}
                imageUrl={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${member.userId}`}
                name={member.username}
              /> 
            )): 
            <h1 className="text-center">Looks empty....</h1>
        }
      </div>
      <div className="p-2 mt-1 justify-self-end">
        <button onClick={handleInviteClick} className="text-center w-full p-2 rounded-lg text-lg bg-[#1DB954] text-black active:scale-95 transition-transform duration-100">
          Invite
        </button>
      </div>
    </div>
  );
}
