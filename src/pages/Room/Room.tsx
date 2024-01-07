import { useNavigate, useParams } from "react-router-dom";
import audioPlayer from "../../common/audioplayer/audioPlayer";
import headphoneIcon from "../../assets/headphone-icon.svg";
import { useEffect, useState } from "react";
import { IRoomInfo, ISongInfo } from "./types";
import general from "../../common/general/general";
import Player from "../../components/Player/Player";
import socketClient from "../../common/socketClient";
import toast from "react-hot-toast";

export default function Room() {
  const [songInfo, setSongInfo] = useState<ISongInfo>();
  const [roomInfo, setRoomInfo] = useState<IRoomInfo>();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const isWithinRange = (time: number) => {
    if (
      audioPlayer.getCurrentTime() >= time - 5 &&
      audioPlayer.getCurrentTime() <= time + 5
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (roomId) {
      socketClient.joinRoom(roomId);
    }

    socketClient.onUpdateTime((time) => {
      if (!isWithinRange(time)) {
        audioPlayer.setCurrentTime(time);
        audioPlayer.play();
      }
    });

    socketClient.onUpdateStatus((status) => {
      if (status === "pause") {
        audioPlayer.pause();
      } else {
        audioPlayer.play();
      }
    });

    socketClient.onRoomDeleted((deletedRoomId) => {
      if (deletedRoomId === roomId) {
        toast.error("Room deleted by owner");
        navigate("/");
      }
    });

    fetchSongInfo();

    return () => {
      audioPlayer.destroy();
      if (roomId) {
        socketClient.leaveRoom(roomId);
      }
    };
  }, [roomId]);

  const fetchSongInfo = async () => {
    try {
      const getRoomInfo = await general.makeRequest({
        url: `/rooms/${roomId}/info`,
        contentType: "application/json",
      });

      if (getRoomInfo.error) {
        throw new Error(getRoomInfo.error);
      }

      setRoomInfo({
        name: getRoomInfo.data.roomName,
      });

      const response = await general.makeRequest({
        url: "/videos/info",
        query: {
          videoUrl: getRoomInfo.data.videoUrl,
        },
      });

      if (!response || response?.error) {
        throw new Error(response.error || "Unable to get video url");
      }


      setSongInfo({
        url: getRoomInfo.data.videoUrl,
        author: response.data.author,
        duration: response.data.duration,
        thumbnail: response.data.thumbnail,
        title: response.data.title,
      });
    } catch (error) {
      console.log(error);
      navigate("/");
    }
  };

  const onLeave = () => {
    navigate("/");
  };

  const handleInviteClick = () => {
    if (!roomId) return;

    navigator.clipboard.writeText(roomId);
    toast.success("Room id copied");
  }

  return (
    <div className="flex-1 flex flex-col justify-between p-4">
      <div className="flex justify-center gap-4 mt-2">
        <button onClick={handleInviteClick} className="bg-[#1DB954] text-black p-2 rounded-lg active:scale-95 transition-transform duration-100">
          Invite
        </button>
        <button
          onClick={onLeave}
          className="bg-[#1DB954] text-black p-2 rounded-lg active:scale-95 transition-transform duration-100"
        >
          Leave
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {songInfo ? (
          <>
            <Player songInfo={songInfo} isMember={true} />
            {/* <RoomMembersContainer roomId={roomName} /> */}
          </>
        ) : (
          <>
            <img
              src={headphoneIcon}
              alt="headphone"
              width={200}
              className="m-auto"
            />
            <h1 className="mt-2 text-lg text-center">
              {!songInfo
                ? "Loading music...."
                : "Add a song and start listening"}
            </h1>
          </>
        )}
      </div>
      <div>
        <h1 className="text-xl text-center">Joined {roomInfo?.name || roomId}'s room</h1>
      </div>
    </div>
  );
}
