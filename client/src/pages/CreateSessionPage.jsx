import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const CreateSessionPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      const res = await fetch(`http://localhost:3000/api/videos/${videoId}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setVideo(data.data);
      } else {
        toast.error('Failed to load video');
      }
    };
    fetchVideo();
  }, [videoId]);

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) {
      return toast.error('Room Name is required');
    }

    const res = await fetch('http://localhost:3000/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        videoId,
        roomName,
        title: roomName, // ✅ use roomName as title
        startTime: null,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('Session created!');
      navigate(`/session/${data.data._id}`);
    } else {
      toast.error(data.message || 'Failed to create session');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Create a Watch Session</h1>
      {!video ? (
        <p>Loading video...</p>
      ) : (
        <form
          onSubmit={handleCreateSession}
          className="bg-gray-900 p-6 rounded-lg shadow-lg space-y-6"
        >
          <div className="aspect-video w-full rounded overflow-hidden shadow mb-4">
            <video
              src={video.videoUrl}
              poster={video.thumbnail}
              controls
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Room Name</label>
            <input
              className="w-full px-4 py-2 bg-gray-700 rounded outline-none focus:ring-2 focus:ring-green-500"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter Room Name (e.g., Friends Movie Night)"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold transition"
          >
            🚀 Create Session
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateSessionPage;
