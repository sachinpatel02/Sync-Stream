// src/pages/LandingPage.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlay, FiUsers, FiMessageCircle, FiGlobe, FiArrowRight } from 'react-icons/fi';
import ThemeToggle from '../components/ThemeToggle';

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: FiPlay,
            title: "Synchronized Viewing",
            description: "Watch videos together with perfect synchronization across all participants."
        },
        {
            icon: FiUsers,
            title: "Group Sessions",
            description: "Create or join viewing sessions with friends and family worldwide."
        },
        {
            icon: FiMessageCircle,
            title: "Live Chat",
            description: "Real-time messaging while watching to share reactions and thoughts."
        },
        {
            icon: FiGlobe,
            title: "Anywhere Access",
            description: "Access your sessions from any device, anywhere in the world."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
            {/* Navigation */}
            <nav className="absolute top-0 left-0 right-0 z-40 p-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <motion.div 
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            SyncStream
                        </span>
                    </motion.div>
                    
                    <motion.div 
                        className="flex space-x-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-ghost"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="btn-primary"
                        >
                            Get Started
                        </button>
                    </motion.div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
                            <FiPlay className="w-16 h-16 text-white" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                            Watch Together,
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Anywhere
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                            Experience synchronized video watching with friends and family. 
                            Create sessions, join rooms, and enjoy real-time chat while streaming together.
                        </p>
                    </motion.div>

                    <motion.div 
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <button
                            onClick={() => navigate('/register')}
                            className="btn-primary text-lg px-8 py-4 flex items-center space-x-2"
                        >
                            <span>Start Watching Together</span>
                            <FiArrowRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-secondary text-lg px-8 py-4"
                        >
                            Sign In to Continue
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Why Choose SyncStream?
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Experience the future of collaborative video watching with our innovative features.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                className="modern-card p-6 text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Ready to Start Watching Together?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Join thousands of users who are already enjoying synchronized video experiences.
                        </p>
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-white text-blue-600 hover:bg-gray-100 text-lg font-semibold px-8 py-4 rounded-lg transition-colors"
                        >
                            Get Started Now
                        </button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
