import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Player, Youtube, DefaultUi } from "@vime/react";
import Header from "../components/Header";
import { toast } from "react-hot-toast";
import "@vime/core/themes/default.css";

const WatchVideoPage = () => {
  const { videoId } = useParams();
  const [youtubeId, setYoutubeId] = useState("");
  const [videoDetails, setVideoDetails] = useState(null);

  const extractYouTubeId = (url) => {
    const regExp =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : "";
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/videos/${videoId}`, {
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok) {
          const ytId = extractYouTubeId(data.data?.videoUrl);
          if (ytId) {
            setYoutubeId(ytId);
            setVideoDetails(data.data);
          } else {
            toast.error("Invalid YouTube URL");
          }
        } else {
          toast.error(data.message || "Failed to fetch video");
        }
      } catch (err) {
        toast.error("Server error while fetching video");
        console.error(err);
      }
    };

    fetchVideo();
  }, [videoId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-[#196254] text-white">
      <Header />
      <div className="p-6 max-w-5xl mx-auto">
        {youtubeId ? (
          <>
            <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg mb-6">
              <Player controls theme="dark" className="w-full h-full">
                <Youtube videoId={youtubeId} />
                <DefaultUi />
              </Player>
            </div>

            {videoDetails && (
              <>
                <h2 className="text-2xl font-bold mb-2">{videoDetails.title}</h2>
                <p className="text-gray-300 mb-4">{videoDetails.description}</p>

                {videoDetails.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {videoDetails.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-800 text-white px-3 py-1 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <p>Loading video...</p>
        )}
      </div>
    </div>
  );
};

export default WatchVideoPage;
