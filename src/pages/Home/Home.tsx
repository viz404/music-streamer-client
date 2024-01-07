import { FormEvent, useContext, useEffect, useState } from "react";
import Player from "../../components/Player/Player";
import RoomMembersContainer from "../../components/RoomMembersContainer/RoomMembersContainer";
import { ISongInfo } from "./types";
import SearchBar from "../../components/SearchBar/SearchBar";
import headphoneIcon from "../../assets/headphone-icon.svg";
import general from "../../common/general/general";
import socketClient from "../../common/socketClient";
import { useNavigate } from "react-router-dom";
import audioPlayer from "../../common/audioplayer/audioPlayer";
import { GlobalContext } from "../../contexts";

export default function Home() {
  const [searching, setSearching] = useState(false);
  const [songInfo, setSongInfo] = useState<ISongInfo>();
  const [roomId, setRoomId] = useState<string>();

  const navigate = useNavigate();
  const { user } = useContext(GlobalContext.Context);

  useEffect(() => {
    if (songInfo) {
      socketClient.createRoom(songInfo.url);
      socketClient.onRoomCreated((roomId, adminId) => {
        if (adminId === user?.userId) {
          setRoomId(roomId);
        }
      });
    }
    return () => {
      socketClient.deleteRoom();
    };
  }, [songInfo, user, setRoomId]);

  const onSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { elements } = event.currentTarget;
    const urlElement = elements.namedItem("url") as HTMLInputElement;
    const url = urlElement.value;
    setSearching(true);
    try {
      const response = await general.makeRequest({
        url: "/videos/info",
        query: {
          videoUrl: url,
        },
      });

      if (!response || response?.error) {
        alert(response?.error?.message || "Unable to get video details");
        return;
      }

      setSongInfo({
        url,
        author: response.data.author,
        duration: response.data.duration,
        thumbnail: response.data.thumbnail,
        title: response.data.title,
      });
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      urlElement.value = "";
      setSearching(false);
    }
  };

  const onJoin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { elements } = event.currentTarget;
    const roomIdElement = elements.namedItem("roomId") as HTMLInputElement;
    const roomId = roomIdElement.value;
    roomIdElement.value = "";
    navigate(`/room/${roomId}`);
  };

  const onTimeUpdate = (time: number) => {
    if (audioPlayer.isPlaying()) {
      socketClient.updateTime(time);
    }
  };

  const onStatusUpdate = (isPlaying: boolean) => {
    socketClient.updateStatus(isPlaying ? "play" : "pause");
  };

  const handleCloseClick = () => {
    setSongInfo(undefined);
  }

  return (
    <div className="flex-1 flex flex-col">
      <main className={"flex flex-col gap-4 p-[5%] flex-1 justify-between"}>
        <SearchBar
          id="url"
          name="url"
          placeHolder="Enter youtube url"
          type="url"
          onSubmit={onSearch}
        />
        <div className="flex flex-col gap-4">
          {songInfo && !searching ? (
            <>
              <Player
                songInfo={songInfo}
                isMember={false}
                onTimeUpdate={onTimeUpdate}
                onStatusUpdate={onStatusUpdate}
              />
              <RoomMembersContainer roomId={roomId} />
            </>
          ) : (
              <>
                <img
                  src={headphoneIcon}
                  alt="headphone"
                  width={200}
                  className="m-auto"
                />
                <h1 className="text-lg text-center">
                  {searching
                    ? "Looks interesting...."
                    : "Add a song and start listening"}
                </h1>
              </>
            )}
        </div>
        {
          songInfo ? (<>

            <button onClick={handleCloseClick} className="bg-zinc-700 text-white p-2 rounded-lg active:scale-95 transition-transform duration-100">
              Close Room 
            </button>
          </>) : (<>

              <SearchBar
                id="roomId"
                name="roomId"
                type="text"
                placeHolder="Enter room id"
                onSubmit={onJoin}
                buttonText="Join"
              />
            </>)
        }
      </main>
    </div>
  );
}
