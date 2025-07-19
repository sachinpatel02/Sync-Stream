// src/components/ProfileSidebar.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiUser, FiLogOut, FiChevronRight, FiHome, FiList, FiUsers, FiLock } from 'react-icons/fi';

const ProfileSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', phone: '', avatar: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetch('http://localhost:3000/api/users/profile', {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.data) {
            setUser({
              name: data.data.name || '',
              phone: data.data.phone || '',
              avatar: '',
            });
          }
        })
        .catch(() => {
          setUser({ name: '', phone: '', avatar: '' });
        })
        .finally(() => setLoading(false));
    }
  }, [open]);

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Logout failed');
      } else {
        toast.success('Logged out successfully');
        navigate('/login');
      }
    } catch (err) {
      toast.error('Server error during logout', err);
    }
  };

  const menu = [
    { icon: FiHome, label: 'Home', action: () => { navigate('/home'); onClose && onClose(); } },
    { icon: FiList, label: 'Sessions', action: () => navigate('/sessions') },
    { icon: FiUsers, label: 'Join Session', action: () => navigate('/join-room') },
    { icon: FiLock, label: 'Change Password', action: () => navigate('/change-password') },
  ];

  return (
    open && (
      <div className="fixed top-0 right-0 w-80 max-w-full h-full bg-white dark:bg-gray-900 shadow-2xl z-50 border-l border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300">
        {/* Header/Close */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <span className="text-xl font-bold text-gray-900 dark:text-white">Profile Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex flex-col items-center py-8 px-6 border-b border-gray-200 dark:border-gray-800">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white mb-3">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0,2) : ''
            )}
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {loading ? <span className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-24 h-5 inline-block" /> : user.name || ' '}
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-3">
            {loading ? <span className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-32 h-4 inline-block" /> : user.phone || ' '}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-medium hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition"
            >
              <FiUser className="w-4 h-4" /> Update Profile
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 flex flex-col gap-1 px-2 py-4">
          {menu.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex items-center justify-between px-6 py-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-gray-900 dark:text-white font-medium"
            >
              <span className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                {item.label}
              </span>
              <FiChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="px-6 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-red-600 dark:text-red-400 font-semibold justify-center"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    )
  );
};

export default ProfileSidebar;
