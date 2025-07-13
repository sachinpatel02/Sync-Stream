import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, phone, password, confirmPassword } = form;

        if (!name || !email || !phone || !password || !confirmPassword) {
            return toast.error('All fields are required');
        }

        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }

        try {
            const res = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Set cookie after register
                body: JSON.stringify({ name, email, phone, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                return toast.error(data.message || 'Registration failed');
            }
            setLoading(true);
            toast.success('Registered successfully! Redirecting to login...');

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error(err);
            toast.error('Server error');
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-[#196254] text-white px-4">
            <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md shadow-lg">
                <h2 className="text-2xl font-semibold mb-6 text-center">Create an Account</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder='Enter name'
                            className="w-full px-4 py-2 bg-gray-700 rounded outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder='you@example.com'
                            className="w-full px-4 py-2 bg-gray-700 rounded outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder='Enter phone no'
                            className="w-full px-4 py-2 bg-gray-700 rounded outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder='Password'
                            className="w-full px-4 py-2 bg-gray-700 rounded outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder='Confirm Password'
                            className="w-full px-4 py-2 bg-gray-700 rounded outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#196254] hover:bg-blue-500'} my-4 py-2 rounded font-semibold transition`}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p className="text-sm mt-6 text-center text-gray-400">
                    Already have an account?{' '}
                    <button onClick={() => navigate('/login')} className="text-blue-400 hover:underline">
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
