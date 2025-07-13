// src/components/ProfileSidebar.jsx
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ProfileSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

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

  return (
    <div
      className={`fixed top-0 right-0 w-64 h-full bg-gray-800 shadow-lg transform transition-transform duration-300 z-50 ${open ? 'translate-x-0' : 'translate-x-full'
        }`}
    >
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-lg font-semibold">My Profile</h2>
        <button onClick={onClose} className="text-white text-xl">×</button>
      </div>
      <ul className="p-4 space-y-4 text-white text-sm">
        <li>
          <button onClick={() => navigate('/profile')} className="hover:text-green-400">Update Profile</button>
        </li>
        <li>
          <button onClick={() => navigate('/change-password')} className="hover:text-green-400">Change Password</button>
        </li>
        <li>
          <button onClick={() => navigate('/sessions')} className="hover:text-green-400">Session History</button>
        </li>
        <li>
          <button onClick={() => navigate('/join-room')} className="hover:text-green-400">Join Upcoming</button>
        </li>
        <li>
          <button onClick={handleLogout} className="hover:text-red-400">Logout</button>
        </li>
      </ul>

    </div>
  );
};

export default ProfileSidebar;
