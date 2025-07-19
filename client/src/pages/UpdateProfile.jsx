import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiSave, FiArrowLeft } from 'react-icons/fi';
import Header from '../components/Header';

const UpdateProfile = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/users/profile', {
          credentials: 'include',
        });

        const data = await res.json();

        if (!res.ok || !data.data) {
          toast.error('Failed to load profile');
          setLoading(false);
          return;
        }

        setForm({
          name: data.data.name || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error('Server error');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const res = await fetch('http://localhost:3000/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Failed to update profile');
        return;
      }

      setForm({
        name: data.data.name || '',
        email: data.data.email || '',
        phone: data.data.phone || '',
      });

      toast.success('Profile updated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Server error while updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="spinner w-8 h-8"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
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
              Update Profile
            </h1>
          </div>

          {/* Form Card */}
          <div className="modern-card p-8 max-w-2xl">
            <div className="text-center mb-8">
              <motion.div
                className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <FiUser className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Profile Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Update your personal information
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pl-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pl-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter your phone number"
                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pl-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={saving}
                className="w-full btn-primary py-3 text-lg font-semibold flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {saving ? (
                  <>
                    <div className="spinner w-5 h-5"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5" />
                    <span>Update Profile</span>
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

export default UpdateProfile;
