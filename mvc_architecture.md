# MVC architecture to arrange the project in a proper way.

project-root/
│
├── client/  (React - View)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Major screens (Landing, Dashboard, Watch, etc.)
│   │   ├── services/      # API call functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── tailwind.config.js
│
├── server/  (Node/Express - MVC)
│   ├── config/            # DB config, constants
│   ├── controllers/       # Business logic
│   ├── models/            # Database schema/models
│   ├── routes/            # API routes
│   ├── middlewares/       # Auth, validation, error handling
│   ├── utils/             # Helper functions
│   ├── uploads/           # Uploaded videos (if local storage)
│   ├── server.js          # App entrypoint
│   └── package.json
│
└── README.md
