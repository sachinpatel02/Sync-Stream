import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { toast } from "react-hot-toast";

const WatchVideoPage = () => {
  const { videoId } = useParams();
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDetails, setVideoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper to get YouTube embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1].split(/[?&]/)[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("youtube.com/embed/")) {
      return url;
    }
    return url;
  };

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      setError("");
      setVideoUrl("");
      setVideoDetails(null);
      try {
        const res = await fetch(`http://localhost:3000/api/videos/${videoId}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.data) {
          const url = data.data.videoUrl;
          setVideoDetails(data.data);
          if (url) {
            setVideoUrl(url);
            setError("");
          } else {
            setError("No video URL found.");
            toast.error("No video URL found");
          }
        } else {
          setError(data.message || "Failed to fetch video");
          toast.error(data.message || "Failed to fetch video");
        }
      } catch (err) {
        setError("Server error while fetching video");
        toast.error("Server error while fetching video");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoId]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <div className="p-6 max-w-3xl mx-auto flex flex-col gap-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="spinner w-10 h-10 mb-4" />
            <span className="text-gray-500 dark:text-gray-400">Loading video...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <span className="text-red-500 dark:text-red-400 font-semibold">{error}</span>
          </div>
        ) : videoUrl ? (
          <>
            <div className="bg-black rounded-2xl shadow-lg overflow-hidden mb-4">
              {videoUrl.endsWith(".mp4") ? (
                <video src={videoUrl} controls className="w-full h-full aspect-video" />
              ) : (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) ? (
                <div className="aspect-video w-full">
                  <iframe
                    width="100%"
                    height="100%"
                    src={getYouTubeEmbedUrl(videoUrl)}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-2xl"
                  ></iframe>
                </div>
              ) : (
                <div className="aspect-video w-full flex items-center justify-center text-gray-400">
                  <span>Unsupported video format.</span>
                </div>
              )}
            </div>
            {videoDetails && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{videoDetails.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{videoDetails.description}</p>
                {videoDetails.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {videoDetails.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 text-xs rounded-full font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <span className="text-gray-500 dark:text-gray-400">Video not found.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchVideoPage;
