import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import UpdateProfile from './pages/UpdateProfile';
import ChangePassword from './pages/ChangePassword';
import WatchVideoPage from './pages/WatchVideoPage.jsx';
import CreateSessionPage from './pages/CreateSessionPage.jsx';
import MySessionsPage from './pages/MySessionsPage.jsx';
import SessionRoomPage from './pages/SessionRoomPage.jsx';
import JoinRoomPage from './pages/JoinRoomPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<UpdateProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/watch/:videoId" element={<WatchVideoPage />} />
        <Route path="/create-session/:videoId" element={<CreateSessionPage />} />
        <Route path="/sessions" element={<MySessionsPage />} />
        <Route path="/session/:id" element={<SessionRoomPage />} />
        <Route path="/join-room" element={<JoinRoomPage />} />

      </Routes>
    </Router>
  );
}

export default App;