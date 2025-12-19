# Smart Task Management System

A full-stack MERN application for managing tasks with authentication.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, JWT
- **Frontend**: React.js, Tailwind CSS, Context API

## 📋 Features

- User authentication (Register/Login with JWT)
- Task CRUD with soft delete
- Filter by status & search by title
- Priority-based sorting (High → Medium → Low)
- Auto status: High priority → "In Progress"
- Completed tasks can't move back to Pending

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

Start server:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get profile (protected) |

### Tasks (Protected - requires Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get task by ID |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Soft delete task |

**Query params**: `?status=Completed` `?search=meeting`

## 🌐 Deploy to Vercel

### 1. MongoDB Atlas Setup
- Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
- Create database user & allow all IPs (0.0.0.0/0)
- Get connection string

### 2. Deploy Backend
- Import repo on [vercel.com](https://vercel.com)
- Root Directory: `backend`
- Add env vars: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `NODE_ENV=production`

### 3. Deploy Frontend
- Add new project, Root Directory: `frontend`
- Add env var: `REACT_APP_API_URL=https://your-backend.vercel.app/api`

## 🔒 Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT secret key |
| `JWT_EXPIRE` | Token expiry (e.g., 7d) |

### Frontend
| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Backend API URL |

## 📄 License

Educational project - MERN Stack Assignment
