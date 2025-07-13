// src/components/Header.jsx
import { useState } from 'react';
import ProfileSidebar from './ProfileSidebar';
import logo from '../assets/good_logo.png';

const Header = () => {
    const [open, setOpen] = useState(false);

    return (
        <header className="w-full bg-[gray-900] text-white px-6 py-4 flex items-center justify-between shadow-md">
            {/* 👨‍🎤 Left: App name */}
            {/* <div className="text-2xl font-bold tracking-wide text-blue-400">
                🎬 SyncStream
            </div> */}
            <img src={logo} alt="" className='h-10' />
            

            {/* 👤 Right: Profile icon */}
            <button
                onClick={() => setOpen(true)}
                className="relative w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-500 flex items-center justify-center"
                title="Profile"
            >
                <span className="text-xl">👤</span>
            </button>

            {/* Slide-in profile panel */}
            <ProfileSidebar open={open} onClose={() => setOpen(false)} />
        </header>
    );
};

export default Header;
