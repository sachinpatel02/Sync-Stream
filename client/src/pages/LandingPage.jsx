// src/pages/LandingPage.jsx
import { useNavigate } from 'react-router-dom';
import logo from '../assets/good_logo.png';
import { motion } from 'framer-motion';
const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-[#196254] text-white flex flex-col items-center justify-center px-4">
            <motion.img
                src={logo}
                alt="logo"
                className="w-52 h-auto mb-6"  // increased from w-40 → w-52
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />
            {/* <h1 className="text-5xl font-bold mb-4">🎬 SyncStream</h1> */}
            <p className="text-lg mb-10 text-gray-300 text-center max-w-md">
                Watch movies together, in sync, from anywhere in the world. Stream. Chat. Enjoy.
            </p>

            <div className="flex space-x-6">
                <button
                    onClick={() => navigate('/login')}
                    className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                    Login
                </button>
                <button
                    onClick={() => navigate('/register')}
                    className="bg-[#196254] px-6 py-2 rounded-lg font-semibold hover:bg-[#22876e] transition"
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default LandingPage;
