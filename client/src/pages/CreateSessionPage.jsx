import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const CreateSessionPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(true);

  // Helper to get YouTube embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split(/[?&]/)[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    return url;
  };

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/api/videos/${videoId}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setVideo(data.data);
      } else {
        toast.error('Failed to load video');
      }
      setLoading(false);
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
      navigate(`/session/${data.data.roomCode}`);
    } else {
      toast.error(data.message || 'Failed to create session');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center py-8">
      <div className="w-full max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Create a Watch Session</h1>
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="spinner w-10 h-10 mb-4" />
            <span className="text-gray-500 dark:text-gray-400">Loading video...</span>
          </div>
        ) : !video ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <span className="text-red-500 dark:text-red-400 font-semibold">Video not found.</span>
          </div>
        ) : (
          <form
            onSubmit={handleCreateSession}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl space-y-8"
          >
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow mb-4 bg-black flex items-center justify-center">
              {video.videoUrl.endsWith('.mp4') ? (
                <video
                  src={video.videoUrl}
                  poster={video.thumbnail}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be')) ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={getYouTubeEmbedUrl(video.videoUrl)}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-xl"
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span>Unsupported video format.</span>
                </div>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Room Name</label>
              <input
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter Room Name (e.g., Friends Movie Night)"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-lg"
            >
              🚀 Create Session
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateSessionPage;
