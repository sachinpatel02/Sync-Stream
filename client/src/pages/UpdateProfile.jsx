import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const UpdateProfile = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);

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
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
      });

      toast.success(data.message || 'Profile updated');
    } catch (err) {
      console.error(err);
      toast.error('Server error while updating profile');
    }
  };

  if (loading) {
    return <div className="text-white p-6">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-[#196254] text-white p-6">
      <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
        <div>
          <label className="block text-sm font-semibold mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 bg-gray-700 text-white rounded outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 bg-gray-700 text-white rounded outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full p-2 bg-gray-700 text-white rounded outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 font-semibold"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
