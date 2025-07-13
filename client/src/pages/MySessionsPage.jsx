import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const MySessionsPage = () => {
  const [live, setLive] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/sessions', {
          credentials: 'include',
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          toast.error(data.message || 'Failed to load sessions');
          return;
        }

        setLive(data.data.live || []);
        setUpcoming(data.data.upcoming || []);
        setPast(data.data.past || []);
      } catch (err) {
        console.error(err);
        toast.error('Server error while loading sessions');
      }
    };

    fetchSessions();
  }, []);

  const renderSessions = (sessionsArray, label, badgeColor) => (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">{label}</h2>
      {sessionsArray.length === 0 ? (
        <p className="text-gray-400">No {label.toLowerCase()}.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {sessionsArray.map((s) => (
            <div
              key={s._id}
              className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-5 transition hover:shadow-xl"
            >
              <div className="mb-2 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">
                  {s.roomName || 'Untitled Session'}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    badgeColor === 'green'
                      ? 'bg-green-700'
                      : badgeColor === 'yellow'
                      ? 'bg-yellow-600'
                      : 'bg-gray-700'
                  } text-white`}
                >
                  {label.split(" ")[0]}
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                Room Code: <span className="font-mono">{s.roomCode}</span>
              </p>
              <button
                onClick={() => navigate(`/session/${s.roomCode}`)}
                className="px-4 py-2 bg-[#196254] hover:bg-blue-600 transition rounded text-sm font-semibold"
              >
                {label === 'Past Sessions' ? 'View Session' : 'Join Session'}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-[#196254] text-white">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-10 text-center">My Watch Sessions</h1>
        {renderSessions(live, 'Live Sessions', 'green')}
        {renderSessions(upcoming, 'Upcoming Sessions', 'yellow')}
        {renderSessions(past, 'Past Sessions', 'gray')}
      </main>
    </div>
  );
};

export default MySessionsPage;
