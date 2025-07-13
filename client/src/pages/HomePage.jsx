import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa';

import Header from '../components/Header';
import Sidebar from '../components/ProfileSidebar';

const HomePage = () => {
    const [videos, setVideos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/videos', {
                    credentials: 'include',
                });

                const data = await res.json();

                if (!res.ok) {
                    toast.error(data.message || 'Failed to load videos');
                    return;
                }

                setVideos(data.data || []);
            } catch (err) {
                console.error(err);
                toast.error('Error fetching videos');
            }
        };

        fetchVideos();
    }, []);

    const handleCreateSession = (videoId) => {
        navigate(`/create-session/${videoId}`);
    };

    const handleWatchVideo = (videoId) => {
        navigate(`/watch/${videoId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-[#196254] text-white">
          <Header />
          <main className="p-6 max-w-[1440px] mx-auto">
            <h1 className="text-3xl font-bold text-center mb-10 text-white">
              🎬 Welcome to <span className="text-green-400">SyncStream</span>
            </h1>
      
            {videos.length === 0 ? (
              <p className="text-gray-400 text-center">No videos found.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {videos.map((video) => (
                  <div
                    key={video._id}
                    className="relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:shadow-lg transition group"
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={() => handleWatchVideo(video._id)}
                      className="cursor-pointer aspect-[16/9] bg-black overflow-hidden"
                    >
                      <video
                        src={video.videoUrl}
                        poster={video.thumbnail}
                        muted
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
      
                    {/* + Button */}
                    <button
                      onClick={() => handleCreateSession(video._id)}
                      title="Create Session"
                      className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full z-10 shadow"
                    >
                      <FaPlus size={14} />
                    </button>
      
                    {/* Title */}
                    <div className="p-3">
                      <h2 className="text-sm font-semibold leading-snug hover:text-green-400 transition line-clamp-2">
                        {video.title}
                      </h2>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      );
      
      
};

export default HomePage;
