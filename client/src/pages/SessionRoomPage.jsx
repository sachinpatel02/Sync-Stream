import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Player, Youtube, DefaultUi } from "@vime/react";
import "@vime/core/themes/default.css";
import Header from "../components/Header";
import io from "socket.io-client";
import ChatBox from "../components/ChatBox";
import { useNavigate } from "react-router-dom";


const socket = io("http://localhost:3000", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const SessionRoomPage = () => {
  const navigate = useNavigate();
  const { id: roomCode } = useParams();
  const [session, setSession] = useState(null);
  const [youtubeId, setYoutubeId] = useState("");
  const [mp4Url, setMp4Url] = useState("");
  const playerRef = useRef(null);
  const ignoreRef = useRef(false);


  const extractYouTubeId = (url) => {
    const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return url?.match(regExp)?.[1] || "";
  };

  const handleCopyInvite = () => {
    const inviteLink = `${window.location.origin}/session/${roomCode}`;
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied!"))
      .catch(() => toast.error("Failed to copy invite link"));
  };

  // ✅ Fetch session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/sessions/join/${roomCode}`, {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          toast.error(data.message || "Failed to fetch session");
          return;
        }
        setSession(data.data);

        const url = data.data?.video?.videoUrl;
        if (url && url.endsWith(".mp4")) {
          setMp4Url(url);
        } else {
          const ytId = extractYouTubeId(url);
          if (ytId) setYoutubeId(ytId);
          else toast.error("Invalid YouTube URL");
        }
      } catch (err) {
        toast.error("Server error while joining session");
        console.error(err);
      }
    };
    fetchSession();
  }, [roomCode]);

  

  // ✅ Join room, setup listeners (chat + video sync)
  useEffect(() => {
    if (!roomCode) return;
  
    socket.emit("join-room", roomCode);
  
    // Delay the request-sync by 500ms to ensure room join is registered
    const syncTimeout = setTimeout(() => {
      socket.emit("request-sync", roomCode);
    }, 500);
  
    const handleInitialSync = async ({ time, isPlaying }) => {
      console.log("[SYNC] Initial sync received", { time, isPlaying });
      if (!playerRef.current) return;
      ignoreRef.current = true;
      if (mp4Url) {
        playerRef.current.currentTime = time;
        if (isPlaying) playerRef.current.play();
        else playerRef.current.pause();
      } else {
        const provider = await playerRef.current.getProvider();
        await provider.setCurrentTime(time);
        isPlaying ? playerRef.current.play() : playerRef.current.pause();
      }
    };
  
    const handlePlay = async ({ time }) => {
      console.log("[SYNC] Play sync received at", time);
      if (!playerRef.current) return;
      ignoreRef.current = true;
      if (mp4Url) {
        playerRef.current.currentTime = time;
        playerRef.current.play();
      } else {
        const provider = await playerRef.current.getProvider();
        await provider.setCurrentTime(time);
        await playerRef.current.play();
      }
    };
  
    const handlePause = async ({ time }) => {
      console.log("[SYNC] Pause sync received at", time);
      if (!playerRef.current) return;
      ignoreRef.current = true;
      if (mp4Url) {
        playerRef.current.currentTime = time;
        playerRef.current.pause();
      } else {
        const provider = await playerRef.current.getProvider();
        await provider.setCurrentTime(time);
        await playerRef.current.pause();
      }
    };
  
    const handleSeek = async ({ time }) => {
      console.log("[SYNC] Seek sync received at", time);
      if (!playerRef.current) return;
      ignoreRef.current = true;
      if (mp4Url) {
        playerRef.current.currentTime = time;
      } else {
        const provider = await playerRef.current.getProvider();
        await provider.setCurrentTime(time);
      }
    };
  
    socket.on("initial-sync", handleInitialSync);
    socket.on("sync-play", handlePlay);
    socket.on("sync-pause", handlePause);
    socket.on("sync-seek", handleSeek);
  
    return () => {
      clearTimeout(syncTimeout);
      socket.off("initial-sync", handleInitialSync);
      socket.off("sync-play", handlePlay);
      socket.off("sync-pause", handlePause);
      socket.off("sync-seek", handleSeek);
    };
  }, [roomCode, mp4Url]);
  

  // ✅ Attach player events for emitting sync

  useEffect(() => {
    if (!playerRef.current || (!youtubeId && !mp4Url)) return;
    const videoEl = playerRef.current;

    const onPlay = async () => {
      if (ignoreRef.current) {
        ignoreRef.current = false;
        return;
      }
      let time;
      if (mp4Url) {
        time = videoEl.currentTime;
      } else {
        time = await videoEl.getCurrentTime();
      }
      socket.emit("play-video", { roomId: roomCode, time });
    };

    const onPause = async () => {
      if (ignoreRef.current) {
        ignoreRef.current = false;
        return;
      }
      let time;
      if (mp4Url) {
        time = videoEl.currentTime;
      } else {
        time = await videoEl.getCurrentTime();
      }
      socket.emit("pause-video", { roomId: roomCode, time });
    };

    const onSeeked = async () => {
      if (ignoreRef.current) {
        ignoreRef.current = false;
        return;
      }
      let time;
      if (mp4Url) {
        time = videoEl.currentTime;
      } else {
        time = await videoEl.getCurrentTime();
      }
      socket.emit("seek-video", { roomId: roomCode, time });
    };

    if (mp4Url) {
      videoEl.addEventListener("play", onPlay);
      videoEl.addEventListener("pause", onPause);
      videoEl.addEventListener("seeked", onSeeked);
    } else {
      videoEl.addEventListener("play", onPlay);
      videoEl.addEventListener("pause", onPause);
      videoEl.addEventListener("seeked", onSeeked);
    }

    return () => {
      if (mp4Url) {
        videoEl.removeEventListener("play", onPlay);
        videoEl.removeEventListener("pause", onPause);
        videoEl.removeEventListener("seeked", onSeeked);
      } else {
        videoEl.removeEventListener("play", onPlay);
        videoEl.removeEventListener("pause", onPause);
        videoEl.removeEventListener("seeked", onSeeked);
      }
    };
  }, [youtubeId, mp4Url, roomCode]);

  
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users/profile", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.data) {
          setUser(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch user profile", err.message);
      }
    };

    fetchUser();
  }, []);

  const handleLeaveSession = async () => {
    if (!session?._id) return toast.error("Session not loaded yet.");

    try {
      const res = await fetch(`http://localhost:3000/api/sessions/${session._id}/leave`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to leave session");
        return;
      }

      // Emit socket event (optional)
      socket.emit("leave-room", session.roomCode);

      toast.success("You left the session");
      navigate("/home"); // or redirect elsewhere
    } catch (err) {
      console.error(err);
      toast.error("Error leaving the session");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-[#196254] text-white">
      <Header />
      <div className="p-6 w-full px-6 md:px-10 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
          <div>
            <h1 className="text-3xl font-bold mb-1">Session Room</h1>
            {session?.roomCode && (
              <p className="text-sm text-gray-300">
                Room Code:{" "}
                <span className="font-mono bg-gray-800 px-2 py-1 rounded text-white shadow">
                  {session.roomCode}
                </span>
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCopyInvite}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-semibold"
            >
              📤 Copy Invite Link
            </button>
            <button
              onClick={handleLeaveSession}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-semibold"
            >
              🚪 Leave Room
            </button>
          </div>
        </div>

        {!session || (!youtubeId && !mp4Url) ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video */}
            <div className="lg:col-span-2 h-[500px]">
              {mp4Url ? (
                <video
                  ref={playerRef}
                  src={mp4Url}
                  controls
                  className="w-full h-full rounded-xl overflow-hidden shadow-lg border border-gray-700 bg-black"
                />
              ) : (
                <Player
                  ref={playerRef}
                  controls
                  theme="dark"
                  className="w-full h-full rounded-xl overflow-hidden shadow-lg border border-gray-700"
                >
                  <Youtube videoId={youtubeId} />
                  <DefaultUi />
                </Player>
              )}
            </div>
            {/* Chat */}
            <ChatBox roomCode={roomCode} socket={socket} userName={user?.name} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionRoomPage;
