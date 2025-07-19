# 🎬 Sync Stream: A collaborative Video Streaming App

## 📄 Overview

### 💫 UI/UX Features
- Modern, responsive design with **TailwindCSS**
- Smooth page transitions with **Framer Motion**
- Dark/Light theme support
- Real-time notifications with **React Hot Toast**
- Intuitive video player controls
- Mobile-friendly interface

### 👥 User FeaturesStream – Real-Time Collaborative Video Streaming App

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
- **Node.js** & **Express.js** for robust server architecture
- **MongoDB** with **Mongoose ODM** for scalable data management
- **Socket.IO** for real-time bidirectional communication
- **JWT** with **cookie-parser** for secure authentication
- **CORS** for secure cross-origin resource sharing
- **bcrypt** for password hashing
- **express-validator** for request validation
- **TMDB API** integration for movie metadata
- **dotenv** for environment configuration
- **nodemon** for development workflow
- **Postman** for API testing and documentation

### Frontend
- **React** + **Vite** for fast development and optimized builds
- **TailwindCSS** for modern, responsive UI design
- **React Router v6** for client-side routing
- **React Hot Toast** for user notifications
- **Framer Motion** for smooth animations
- **Socket.IO Client** for real-time communication
- **React Icons** for consistent iconography
- Custom dark mode implementation with context
- Responsive design for all screen sizes

---

## 📂 Folder Structure

```
/server
  ├── config/            # Configuration files
  │   ├── db.js         # MongoDB connection setup
  │   └── cors.js       # CORS configuration
  ├── controllers/       # Request handlers
  │   ├── userController.js    # User management logic
  │   ├── videoController.js   # Video management
  │   ├── sessionController.js # Session handling
  │   ├── tmdbController.js    # TMDB API integration
  │   └── pexelsController.js  # Pexels API handling
  ├── middleware/       # Custom middleware
  │   ├── authMiddleware.js    # JWT authentication
  │   ├── validateRequest.js   # Request validation
  │   └── errorHandler.js      # Global error handling
  ├── models/          # Database schemas
  │   ├── User.js      # User model with password hashing
  │   ├── Video.js     # Video content schema
  │   └── Session.js   # Viewing session schema
  ├── routes/          # API route definitions
  │   ├── userRoutes.js     # Auth & user management
  │   ├── videoRoutes.js    # Video CRUD operations
  │   ├── sessionRoutes.js  # Session management
  │   └── tmdbRoutes.js     # TMDB API endpoints
  ├── socket/          # WebSocket handling
  │   └── socketHandler.js  # Real-time sync logic
  ├── utils/           # Helper functions
  │   ├── sendResponse.js   # Response formatter
  │   └── validators.js     # Input validation rules
  └── server.js        # Main application entry

/client
  ├── src/
  │   ├── components/    # Reusable UI components
  │   │   ├── Header.jsx          # Main navigation header
  │   │   ├── ChatBox.jsx         # Real-time chat component
  │   │   ├── ProfileSidebar.jsx  # User profile sidebar
  │   │   └── ThemeToggle.jsx     # Dark/light mode toggle
  │   ├── pages/         # Page components
  │   │   ├── LandingPage.jsx     # Public landing page
  │   │   ├── LoginPage.jsx       # User authentication
  │   │   ├── HomePage.jsx        # Dashboard
  │   │   ├── SessionRoomPage.jsx # Video sync room
  │   │   └── CreateSessionPage.jsx # Session creation
  │   ├── context/       # React Context providers
  │   │   └── ThemeContext.jsx    # Theme management
  │   ├── utils/         # Helper functions
  │   │   └── socket.js           # Socket.IO setup
  │   ├── assets/        # Images and static files
  │   ├── App.jsx        # Main component & routing
  │   └── main.jsx       # Entry point
  ├── index.html         # HTML template
  └── vite.config.js     # Vite configuration
```

---

## 🧪 How to Run Locally

### 🔧 Prerequisites
- Node.js + npm
- MongoDB Atlas (or local instance)
- TMDB API key (for admin usage)

### 🛠️ Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following configuration:
```bash
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=24h
COOKIE_EXPIRE=24

# External APIs
TMDB_API_KEY=your_tmdb_api_key

# Server
PORT=3000
NODE_ENV=development
```

4. Start the development server:
```bash
# With nodemon (recommended for development)
npm run dev

# Without nodemon
npm start
```

The backend server will be available at `http://localhost:3000`

### 💻 Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with necessary configuration:
```bash
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or next available port)

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
