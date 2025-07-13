import { useState } from 'react';
import { toast } from 'react-hot-toast';

const ChangePassword = () => {
    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

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
        console.log({
            oldPassword,
            newPassword,
            confirmPassword
          });
      
        try {
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
      
          toast.success('Password updated');
          setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
          toast.error('Server error', err);
        }
      };
      

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
                <input name="oldPassword" type="password" value={form.oldPassword} onChange={handleChange} placeholder="Current Password" className="w-full p-2 bg-gray-700 rounded" />
                <input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} placeholder="New Password" className="w-full p-2 bg-gray-700 rounded" />
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="w-full p-2 bg-gray-700 rounded" />
                <button type="submit" className="bg-green-600 px-4 py-2 rounded hover:bg-green-500">Change Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;
