import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';


const LoginPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = form;

        if (!email || !password) {
            return toast.error('Please enter both email and password');
        }

        try {
            setLoading(true);
            const res = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) return toast.error(data.message || 'Login failed');

            toast.success('Login successful');
            navigate('/home');
        } catch (err) {
            toast.error('Server error' + err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-[#196254] text-white px-4">
            <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md shadow-lg">
                <h2 className="text-2xl font-semibold mb-6 text-center">Login to SyncStream</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder='you@example.com'
                            className="w-full px-4 py-2 bg-gray-700 rounded outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            placeholder='your password'
                            className="w-full px-4 py-2 bg-gray-700 rounded outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#196254] hover:bg-blue-500'} my-4 py-2 rounded font-semibold transition`}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="text-sm mt-6 text-center text-gray-400">
                    Don’t have an account?{' '}
                    <button onClick={() => navigate('/register')} className="text-blue-400 hover:underline">
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
