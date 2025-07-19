// pages/JoinRoomPage.jsx
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const JoinRoomPage = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:3000/api/sessions/join/${code}`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Joined successfully!");
      navigate(`/session/${data.data.roomCode}`);
    } else {
      toast.error(data.message || "Join failed");
    }    
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main className="flex items-center justify-center px-4 py-12 min-h-[80vh]">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">Join a Session</h1>
          <form onSubmit={handleJoin} className="space-y-6">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter Room Code"
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg tracking-widest text-center"
              maxLength={12}
              autoFocus
            />
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-lg">
              Join Session
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default JoinRoomPage;
