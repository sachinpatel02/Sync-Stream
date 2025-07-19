import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const MySessionsPage = () => {
  const [live, setLive] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/sessions', {
        credentials: 'include',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || 'Failed to load sessions');
        setLoading(false);
        return;
      }

      setLive(data.data.live || []);
      setUpcoming(data.data.upcoming || []);
      setPast(data.data.past || []);
    } catch (err) {
      console.error(err);
      toast.error('Server error while loading sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleLeaveSession = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/sessions/${id}/leave`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Left session successfully');
        fetchSessions();
      } else if (data.message && data.message.toLowerCase().includes('host cannot leave')) {
        // Host cannot leave, so end the session for everyone
        const endRes = await fetch(`http://localhost:3000/api/sessions/${id}/end`, {
          method: 'POST',
          credentials: 'include',
        });
        const endData = await endRes.json();
        if (endRes.ok) {
          toast.success('Session ended for everyone');
          fetchSessions();
        } else {
          toast.error(endData.message || 'Failed to end session');
        }
      } else {
        toast.error(data.message || 'Failed to leave session');
      }
    } catch (err) {
      toast.error('Server error while leaving session');
    }
  };

  const badgeClass = (color) =>
    `text-xs px-2 py-1 rounded-full font-semibold ${
      color === 'green'
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
        : color === 'yellow'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
        : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }`;

  const renderSessions = (sessionsArray, label, badgeColor, canLeave = false) => (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">{label}</h2>
      {sessionsArray.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No {label.toLowerCase()}.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {sessionsArray.map((s) => (
            <div
              key={s._id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 flex flex-col gap-3 transition hover:shadow-xl"
            >
              <div className="mb-2 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {s.roomName || 'Untitled Session'}
                </h3>
                <span className={badgeClass(badgeColor)}>
                  {label.split(" ")[0]}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Room Code: <span className="font-mono text-base text-gray-900 dark:text-white">{s.roomCode}</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/session/${s.roomCode}`)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm"
                >
                  {label === 'Past Sessions' ? 'View Session' : 'Join Session'}
                </button>
                {canLeave && (
                  <button
                    onClick={() => handleLeaveSession(s._id)}
                    className="flex-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-sm"
                  >
                    Leave Session
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-900 dark:text-white">My Watch Sessions</h1>
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="spinner w-10 h-10 mb-4" />
            <span className="text-gray-500 dark:text-gray-400">Loading sessions...</span>
          </div>
        ) : (
          <>
            {renderSessions(live, 'Live Sessions', 'green', true)}
            {renderSessions(upcoming, 'Upcoming Sessions', 'yellow', true)}
            {renderSessions(past, 'Past Sessions', 'gray', false)}
          </>
        )}
      </main>
    </div>
  );
};

export default MySessionsPage;
