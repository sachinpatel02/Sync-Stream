import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiPlus, FiPlay, FiUsers } from 'react-icons/fi';

import Header from '../components/Header';

const HomePage = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
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
            } finally {
                setLoading(false);
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Welcome to{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            SyncStream
                        </span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Watch videos together with friends in real-time. Create sessions, join rooms, and enjoy synchronized viewing experiences.
                    </p>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="spinner w-8 h-8"></div>
                        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading videos...</span>
                    </div>
                )}

                {/* Videos Grid */}
                {!loading && (
                    <>
                        {videos.length === 0 ? (
                            <motion.div 
                                className="text-center py-20"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiPlay className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    No videos available
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Check back later for new content
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {videos.map((video, index) => (
                                    <motion.div
                                        key={video._id}
                                        className="group"
                                        variants={itemVariants}
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className="modern-card overflow-hidden">
                                            {/* Thumbnail Container */}
                                            <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                                {video.thumbnail ? (
                                                    <img
                                                        src={video.thumbnail}
                                                        alt={video.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700">
                                                        <FiPlay className="w-12 h-12 text-gray-500 dark:text-gray-400" />
                                                    </div>
                                                )}
                                                
                                                {/* Overlay with actions */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                                                        <motion.button
                                                            onClick={() => handleWatchVideo(video._id)}
                                                            className="bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <FiPlay className="w-5 h-5" />
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={() => handleCreateSession(video._id)}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <FiUsers className="w-5 h-5" />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Video Info */}
                                            <div className="p-4">
                                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {video.title}
                                                </h3>
                                                {video.description && (
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                                        {video.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default HomePage;
