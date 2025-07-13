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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-[#196254] text-white">
       <Header />
      <main className="flex items-center justify-center px-4 py-12">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-8 w-full max-w-md">
      <h1 className="text-3xl font-bold text-center mb-6">Join a Session</h1>
      <form onSubmit={handleJoin} className="bg-gray-800 p-6 rounded shadow w-full max-w-md space-y-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter Room Code"
          className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold transition">
          Join Session
        </button>
      </form>
      </div>
      </main>
    </div>
  );
};

export default JoinRoomPage;
