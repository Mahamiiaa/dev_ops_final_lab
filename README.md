# 📋 Student Task Manager

A full-stack MERN (MongoDB, Express, React, Node.js) task management application designed for students. Features JWT authentication, full CRUD task management, search/filter/sort, pagination, dark/light mode, and dashboard charts.

## Features

- **Authentication** — Register & login with JWT, bcrypt password hashing
- **Dashboard** — Welcome message, task statistics (total, completed, pending)
- **Task CRUD** — Create, read, update, delete tasks with confirmation
- **Task Details** — Title, description, due date, priority (Low/Medium/High), status
- **Search & Filter** — Search by title, filter by status, sort by due date or priority
- **Pagination** — Navigate through tasks with page controls
- **Dark/Light Mode** — Toggle theme with system preference detection
- **Toast Notifications** — Success/error/info messages for all actions
- **Dashboard Charts** — Visual progress bar and bar chart showing completed vs pending
- **Input Validation** — Field-level validation on both frontend and backend
- **Protected Routes** — Users only access their own data
- **Responsive Design** — Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend:** React 18, React Router 6, Axios, Vite, CSS with custom properties
- **Backend:** Node.js, Express, Mongoose, JWT, bcrypt, express-validator
- **Database:** MongoDB

## Project Structure

```
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # Auth, Theme, Toast contexts
│   │   └── services/        # API service (Axios)
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                  # Express backend
│   ├── config/              # DB configuration
│   ├── middleware/           # JWT auth middleware
│   ├── models/              # Mongoose models (User, Task)
│   ├── routes/              # Auth & Task routes
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js (v18+)
- MongoDB (running locally or a MongoDB Atlas URI)

## Setup

### 1. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/student-task-manager
JWT_SECRET=your_jwt_secret_key_change_in_production
```

> **For MongoDB Atlas**, replace `MONGO_URI` with your Atlas connection string.

### 3. Run the Application

Start both servers (in separate terminals):

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login
- `GET /api/auth/profile` — Get current user (protected)

### Tasks (all protected)
- `GET /api/tasks` — List tasks (query: `search`, `status`, `sortBy`, `order`, `page`, `limit`)
- `GET /api/tasks/stats` — Task statistics
- `GET /api/tasks/:id` — Get single task
- `POST /api/tasks` — Create task
- `PUT /api/tasks/:id` — Update task
- `PATCH /api/tasks/:id/status` — Toggle status
- `DELETE /api/tasks/:id` — Delete task
