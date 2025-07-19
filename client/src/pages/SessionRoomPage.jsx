import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import io from "socket.io-client";
import ChatBox from "../components/ChatBox";

const socket = io("http://localhost:3000", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const SessionRoomPage = () => {
  const { id: roomCode } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(false);
  const [participants, setParticipants] = useState([]);
  const playerRef = useRef(null);
  const syncIntervalRef = useRef(null);

  // Fetch session info
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

        console.log('Session data:', data.data);
        setSession(data.data);
        setParticipants(data.data.participants || []);
      } catch {
        toast.error("Server error while joining session");
      }
    };
    fetchSession();

    // Listen for participant updates
    socket.on("participant-joined", (updatedSession) => {
      console.log('Participant joined:', updatedSession);
      setSession(updatedSession);
      if (updatedSession.participants) {
        setParticipants(updatedSession.participants);
      }
    });

    socket.on("participant-left", (updatedSession) => {
      console.log('Participant left:', updatedSession);
      setSession(updatedSession);
      if (updatedSession.participants) {
        setParticipants(updatedSession.participants);
      }
    });

    return () => {
      socket.off("participant-joined");
      socket.off("participant-left");
    };
  }, [roomCode]);

  // Fetch user info
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
      } catch {/* ignore */}
    };
    fetchUser();
  }, []);

  // Set isHost
  useEffect(() => {
    if (user && session && session.host) {
      setIsHost(user._id === session.host._id);
    }
  }, [user, session]);

  // Video sync logic (only for .mp4)
  useEffect(() => {
    if (!session?.video?.videoUrl || !session?.roomCode) return;
    if (!session.video.videoUrl.endsWith(".mp4")) return;
    
    socket.emit("join-room", session.roomCode);
    
    // Only request initial sync once when joining
    if (!isHost) {
      socket.emit("request-sync", session.roomCode);
    }

    const handleVideoSync = ({ time, isPlaying }) => {
      if (!playerRef.current || isHost) return;
      
      // Always sync time if there's any difference
      const timeDiff = Math.abs(playerRef.current.currentTime - time);
      if (timeDiff > 0.1) {
        console.log('Syncing time:', { current: playerRef.current.currentTime, target: time, diff: timeDiff });
        playerRef.current.currentTime = time;
      }

      // Handle play state
      const currentlyPlaying = !playerRef.current.paused;
      if (isPlaying !== currentlyPlaying) {
        console.log('Syncing play state:', { current: currentlyPlaying, target: isPlaying });
        if (isPlaying) {
          playerRef.current.play().catch(error => {
            console.error('Error playing:', error);
            setShowPlayOverlay(true);
          });
        } else {
          playerRef.current.pause();
        }
      }
    };

    // Handle all sync events with the same handler
    socket.on("video-sync", handleVideoSync);

    // Host emits state changes
    if (isHost && playerRef.current) {
      const emitState = () => {
        socket.emit("sync-status", {
          roomId: session.roomCode,
          time: playerRef.current.currentTime,
          isPlaying: !playerRef.current.paused
        });
      };

      // Emit on play/pause/seek
      playerRef.current.addEventListener("play", emitState);
      playerRef.current.addEventListener("pause", emitState);
      playerRef.current.addEventListener("seeked", emitState);

      // Regular sync interval (more frequent)
      syncIntervalRef.current = setInterval(emitState, 250);

      return () => {
        if (playerRef.current) {
          playerRef.current.removeEventListener("play", emitState);
          playerRef.current.removeEventListener("pause", emitState);
          playerRef.current.removeEventListener("seeked", emitState);
        }
        socket.off("video-sync", handleVideoSync);
        if (syncIntervalRef.current) {
          clearInterval(syncIntervalRef.current);
          syncIntervalRef.current = null;
        }
      };
    }

    return () => {
      socket.off("video-sync", handleVideoSync);
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [session, isHost]);



  // Copy invite link
  const handleCopyInvite = () => {
    const inviteLink = `${window.location.origin}/session/${roomCode}`;
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied!"))
      .catch(() => toast.error("Failed to copy invite link"));
  };

  // Leave/end session
  const handleLeaveOrEnd = async () => {
    if (!session?._id) return toast.error("Session not loaded yet.");
    try {
      const url = isHost
        ? `http://localhost:3000/api/sessions/${session._id}/end`
        : `http://localhost:3000/api/sessions/${session._id}/leave`;
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || (isHost ? "Failed to end session" : "Failed to leave session"));
        return;
      }
      socket.emit("leave-room", session.roomCode);
      toast.success(isHost ? "Session ended" : "You left the session");
      navigate("/home");
    } catch {
      toast.error(isHost ? "Error ending the session" : "Error leaving the session");
    }
  };

  // Helper for participant initials
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'participants'

  return (
    <div className="h-screen w-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden flex flex-col">
      {/* Top Bar - Minimalist */}
      <div className="h-14 bg-white/90 dark:bg-gray-800/90 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-lg">{session?.roomName || "Session Room"}</span>
          {session?.roomCode && (
            <span className="font-mono bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded text-sm text-gray-600 dark:text-gray-300 select-all">
              {session.roomCode}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={handleCopyInvite} className="bg-blue-600/90 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
            Invite
          </button>
          <button onClick={handleLeaveOrEnd} className={`${isHost ? "bg-red-700/90 hover:bg-red-700" : "bg-red-600/90 hover:bg-red-600"} text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors`}>
            {isHost ? "End" : "Leave"}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Video Container - Takes most space */}
        <div className="flex-1 bg-black">
          {session?.video?.videoUrl && session.video.videoUrl.endsWith(".mp4") ? (
            <video
              ref={playerRef}
              src={session.video.videoUrl}
              controls
              className="w-full h-full object-contain"
              controlsList={!isHost ? "noplaybackrate nofullscreen nodownload" : undefined}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
              Only MP4 videos are supported for sync.
            </div>
          )}

          {showPlayOverlay && !isHost && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg transition-colors"
                onClick={() => {
                  if (playerRef.current) {
                    playerRef.current.play().then(() => setShowPlayOverlay(false));
                  }
                }}
              >
                Click to start playback
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-[320px] bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Tab Buttons */}
          <div className="h-12 flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium transition-colors
                ${activeTab === 'chat' 
                  ? 'bg-white dark:bg-gray-700/50 text-blue-600 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Chat
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium transition-colors
                ${activeTab === 'participants' 
                  ? 'bg-white dark:bg-gray-700/50 text-blue-600 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Participants
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {/* Chat Box */}
            <div className={`h-full ${activeTab === 'chat' ? 'block' : 'hidden'}`}>
              <ChatBox roomCode={roomCode} socket={socket} userName={user?.name} />
            </div>

            {/* Participants List */}
            <div className={`h-full overflow-y-auto p-4 ${activeTab === 'participants' ? 'block' : 'hidden'}`}>
              <div className="space-y-2">
                {participants.length > 0 ? (
                  participants.map((p) => (
                    <div key={p._id || p.socketId} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white dark:bg-gray-700/50 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center text-sm font-medium">
                          {getInitials(p.name || 'Anonymous')}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {p.name || 'Anonymous User'}
                          {p.socketId === socket.id && ' (You)'}
                        </span>
                      </div>
                      {session?.host && p._id === session.host._id && (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400">Host</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No participants yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionRoomPage;
