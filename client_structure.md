client/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── logo.png
│   │   └── placeholder-video.mp4
│   ├── components/
│   │   ├── common/         # Reusable UI elements
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Button.jsx
│   │   │   └── Input.jsx
│   │   ├── auth/          # Authentication components
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── session/       # Session-related components
│   │   │   ├── SessionCard.jsx
│   │   │   ├── VideoPlayer.jsx
│   │   │   ├── ChatBox.jsx
│   │   │   └── PlaybackControls.jsx
│   │   ├── admin/         # Admin-specific components
│   │   │   ├── UserTable.jsx
│   │   │   └── VideoApproval.jsx
│   │   └── feedback/      # Feedback components
│   │       └── FeedbackForm.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx  # Role-based (Admin/Host/Participant)
│   │   ├── CreateSessionPage.jsx
│   │   ├── JoinSessionPage.jsx
│   │   ├── WatchSessionPage.jsx
│   │   ├── AdminDashboardPage.jsx
│   │   └── FeedbackPage.jsx
│   ├── services/
│   │   ├── authService.js     # Login/register API calls
│   │   ├── sessionService.js  # Session creation/joining
│   │   ├── videoService.js    # Video upload/streaming
│   │   ├── chatService.js     # Chat message handling
│   │   └── feedbackService.js # Feedback submission
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js
└── package.json