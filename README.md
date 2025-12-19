# Smart Task Management System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for managing tasks with user authentication and authorization.

## 📋 Features

### Authentication & Authorization
- User registration with email and password
- Secure login with JWT (JSON Web Token)
- Password hashing using bcrypt
- Protected routes requiring authentication
- Token-based authorization (Bearer token)

### Task Management
- Create, Read, Update, Delete (CRUD) operations
- Soft delete functionality (tasks are marked as deleted, not removed)
- Task filtering by status
- Task search by title
- Priority-based sorting (High → Medium → Low)

### Business Logic
- **Duplicate Title Validation**: Same user cannot create two tasks with the same title
- **Auto Status Logic**: High priority tasks automatically set to "In Progress"
- **Status Change Rule**: Completed tasks cannot move back to Pending
- **User Isolation**: Users can only access their own tasks

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React.js** - UI library (with JSX)
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **Context API** - State management

## 📁 Project Structure

```
Task-Manager/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   └── taskController.js  # Task logic
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── errorHandler.js    # Error handling
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   └── taskRoutes.js      # Task endpoints
│   ├── .env                   # Environment variables
│   ├── .env.example           # Env template
│   ├── package.json
│   └── server.js              # Entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskFilters.jsx
│   │   │   └── TaskModal.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── TaskContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── taskService.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── index.jsx
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Task Endpoints (Protected)

> All task endpoints require the `Authorization: Bearer <token>` header

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the MERN stack assignment",
  "priority": "High",
  "status": "Pending"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "task": {
    "_id": "...",
    "title": "Complete project",
    "description": "Finish the MERN stack assignment",
    "status": "In Progress",
    "priority": "High",
    "isDeleted": false,
    "userId": "...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```
> Note: High priority tasks automatically get "In Progress" status

#### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` - Filter by status (Pending, In Progress, Completed)
- `search` - Search by title

**Examples:**
```http
GET /api/tasks?status=Completed
GET /api/tasks?search=meeting
GET /api/tasks?status=Pending&search=project
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "tasks": [
    {
      "_id": "...",
      "title": "High Priority Task",
      "description": "...",
      "status": "In Progress",
      "priority": "High",
      "isDeleted": false,
      "userId": "...",
      "createdAt": "...",
      "updatedAt": "..."
    },
    {
      "_id": "...",
      "title": "Medium Priority Task",
      "description": "...",
      "status": "Pending",
      "priority": "Medium",
      "isDeleted": false,
      "userId": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

#### Get Task by ID
```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "task": {
    "_id": "...",
    "title": "Task Title",
    "description": "...",
    "status": "Pending",
    "priority": "Medium",
    "isDeleted": false,
    "userId": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "Completed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "task": {
    "_id": "...",
    "title": "Updated Title",
    "status": "Completed",
    ...
  }
}
```

#### Delete Task (Soft Delete)
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "success": false,
  "message": "You already have a task with this title"
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden: You are not authorized to access this task"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "message": "Task not found"
}
```

## 🔒 Environment Variables

### Backend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/task-manager |
| JWT_SECRET | Secret key for JWT | - |
| JWT_EXPIRE | Token expiration time | 7d |

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API URL | http://localhost:5000/api |

## ✅ Business Logic Summary

1. **Duplicate Title Validation**: Users cannot create tasks with duplicate titles
2. **Auto Status Logic**: High priority tasks default to "In Progress" status
3. **Soft Delete**: Tasks are marked as deleted but remain in database
4. **Sorting**: Tasks sorted by priority (High → Medium → Low), then by date
5. **Status Change Rule**: Completed tasks cannot be moved back to Pending
6. **Authorization**: Users can only access their own tasks

## 📝 API Testing with Postman

Import the following collection for testing:

1. Set environment variable `baseUrl` to `http://localhost:5000/api`
2. Set `token` variable after login
3. Use `{{token}}` in Authorization header

