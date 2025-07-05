# 🎬 SyncStream – Real-Time Collaborative Video Streaming App

SyncStream is a full-stack web application that allows users to watch videos together in real time, create or join sessions (rooms), and chat during playback. It offers admin-controlled video management, session syncing via WebSockets, and real-time interaction – similar to platforms like Teleparty or Netflix Party.

---

## 🚀 Features

### 👥 User Features
- Register, login, and secure authentication with **JWT + httpOnly cookies**
- Watch videos in sync with other users in a room
- Join live or upcoming sessions
- Profile management (update name, change password)
- View session history

### 🔐 Admin Features
- Add/update/delete video content using internal forms or TMDB movie API
- Manage video metadata (title, description, thumbnail, video URL)
- Secure access to TMDB endpoints via role-based authorization

### 💬 Real-Time Features
- Real-time **video playback synchronization** using **Socket.IO**
- Room-based **session management**
- (Planned) chat functionality during video sessions

---

## 🧠 Tech Stack

### Backend
- **Node.js**, **Express.js**
- **MongoDB (Mongoose)** for data storage
- **Socket.IO** for real-time communication
- **JWT** + **cookie-parser** for authentication
- **TMDB API** integration for movie metadata
- **Postman** for backend testing

### Frontend
- **React** + **Vite**
- **TailwindCSS** for UI
- **React Router**, **Toasts**, and custom components
- **YouTube Player API** for embedded video playback

---

## 📂 Folder Structure

```
/server
  ├── config/            # DB connection
  ├── controllers/       # Logic for users, videos, sessions
  ├── middleware/        # authMiddleware, error handling
  ├── models/            # Mongoose schemas
  ├── routes/            # REST API routes
  ├── socket/            # socketHandler.js for syncing sessions
  └── utils/             # sendResponse.js, helpers

/client
  ├── components/        # Header, Sidebar, etc.
  ├── pages/             # HomePage, Login, WatchVideo, CreateSession, etc.
  ├── App.jsx, main.jsx  # Routing and entry point
```

---

## 🧪 How to Run Locally

### 🔧 Prerequisites
- Node.js + npm
- MongoDB Atlas (or local instance)
- TMDB API key (for admin usage)

### 🛠️ Backend Setup

```bash
cd server
npm install
touch .env
# Add your DB_URI, JWT_SECRET, TMDB_API_KEY
npm run dev
```

### 💻 Frontend Setup

```bash
cd client
npm install
npm run dev
```

> Make sure backend runs on `localhost:3000` and frontend on `localhost:3001` (adjust CORS settings if needed).

---

## 📦 API Endpoints

### 🔐 Auth
- `POST /api/users/register`
- `POST /api/users/login`
- `POST /api/users/logout`
- `GET /api/users/profile`

### 🎥 Videos
- `POST /api/videos` (admin only)
- `GET /api/videos` (all)
- `GET /api/videos/:id`
- `PUT /api/videos/:id` (admin only)
- `DELETE /api/videos/:id` (admin only)

### 🧩 Sessions
- `POST /api/sessions` (create)
- `GET /api/sessions/:id`
- `GET /api/sessions` (my sessions)
- `POST /api/sessions/:id/join`
- `POST /api/sessions/:id/leave`
- `POST /api/sessions/:id/end`

### 🌐 TMDB
- `GET /api/tmdb/search?query=movie`
- `GET /api/tmdb/movie/:id`
- `GET /api/tmdb/trailer/:id`

---

## ✨ Future Enhancements

- Chat feature using Socket.IO
- Email-based password reset
- AI-based movie recommendations
- Payment gateway for subscription model
- Session analytics and role-based controls

---

## 👨‍💻 Contributors

- **Sachin Patel** *(Backend, Auth, Sessions, TMDB, Frontend Logic)*

---

## 📃 License

This project is licensed under the [MIT License](LICENSE).
