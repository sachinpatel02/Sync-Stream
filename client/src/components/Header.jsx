// src/components/Header.jsx
import { useState } from 'react';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';
import ProfileSidebar from './ProfileSidebar';

const Header = () => {
    const [open, setOpen] = useState(false);

    return (
        <header 
            className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-lg border-b border-gray-200 dark:border-gray-700"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div 
                        className="flex items-center space-x-3"
                    >
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            SyncStream
                        </span>
                    </div>

                    {/* Right side controls */}
                    <div className="flex items-center space-x-4">
                        {/* Profile Button */}
                        <button
                            onClick={() => setOpen(true)}
                            className="relative w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                            title="Profile"
                        >
                            <FiUser className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Sidebar */}
            <ProfileSidebar open={open} onClose={() => setOpen(false)} />
        </header>
    );
};

export default Header;
