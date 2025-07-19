import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiLock, FiEye, FiEyeOff, FiKey, FiArrowLeft } from 'react-icons/fi';
import Header from '../components/Header';

const ChangePassword = () => {
    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const { oldPassword, newPassword, confirmPassword } = form;
      
        if (!oldPassword || !newPassword || !confirmPassword) {
          return toast.error('All fields are required');
        }
      
        if (newPassword !== confirmPassword) {
          return toast.error('Passwords do not match');
        }

        if (newPassword.length < 6) {
          return toast.error('New password must be at least 6 characters long');
        }
      
        try {
          setLoading(true);
          const res = await fetch('http://localhost:3000/api/users/change-password', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              oldPassword,
              newPassword,
            }),
          });
      
          const data = await res.json();
      
          if (!res.ok) {
            return toast.error(data.message || 'Failed to change password');
          }
      
          toast.success('Password updated successfully');
          setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
          toast.error('Server error: ' + err.message);
        } finally {
          setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            
            <main className="flex items-center justify-center min-h-[80vh]">
                <motion.div
                    className="w-full max-w-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="flex items-center space-x-4 mb-8">
                        <motion.button
                            onClick={() => navigate('/home')}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </motion.button>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Change Password
                        </h1>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                        <div className="text-center mb-8">
                            <motion.div
                                className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <FiKey className="w-8 h-8 text-white" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Update Password
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Change your account password
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Current Password Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type={showOldPassword ? 'text' : 'password'}
                                        name="oldPassword"
                                        value={form.oldPassword}
                                        onChange={handleChange}
                                        required
                                        placeholder="Current password"
                                        className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pl-10 pr-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showOldPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    New Password
                                </label>
                                <div className="relative">
                                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        name="newPassword"
                                        value={form.newPassword}
                                        onChange={handleChange}
                                        required
                                        placeholder="New password"
                                        className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pl-10 pr-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showNewPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        placeholder="Confirm New password"
                                        className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pl-10 pr-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-3 text-lg font-semibold flex items-center justify-center space-x-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner w-5 h-5"></div>
                                        <span>Updating password...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiKey className="w-5 h-5" />
                                        <span>Change Password</span>
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default ChangePassword;
