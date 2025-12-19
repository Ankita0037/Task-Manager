# API Documentation - Smart Task Management System

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication APIs

### 1. Register User
Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Headers:**
| Header | Value |
|--------|-------|
| Content-Type | application/json |

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-12-19T10:00:00.000Z"
  }
}
```

**Error Responses:**

*400 Bad Request - Validation Error:*
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Password must be at least 6 characters",
      "param": "password",
      "location": "body"
    }
  ]
}
```

*400 Bad Request - User Exists:*
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---

### 2. Login User
Authenticate user and get JWT token.

**Endpoint:** `POST /api/auth/login`

**Headers:**
| Header | Value |
|--------|-------|
| Content-Type | application/json |

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-12-19T10:00:00.000Z"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 3. Get User Profile
Get logged-in user details.

**Endpoint:** `GET /api/auth/profile`

**Headers:**
| Header | Value |
|--------|-------|
| Authorization | Bearer <token> |

**Success Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-12-19T10:00:00.000Z"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

---

## Task APIs (Protected)

All task APIs require authentication via Bearer token.

### 1. Create Task
Create a new task for the logged-in user.

**Endpoint:** `POST /api/tasks`

**Headers:**
| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Authorization | Bearer <token> |

**Request Body:**
```json
{
  "title": "Daily Standup",
  "description": "Team sync meeting",
  "priority": "High",
  "status": "Pending"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | Yes | Task title (unique per user, max 100 chars) |
| description | String | No | Task description (max 500 chars) |
| priority | String | No | "Low", "Medium", "High" (default: "Medium") |
| status | String | No | "Pending", "In Progress", "Completed" (default: "Pending") |

**Note:** If priority is "High", status automatically defaults to "In Progress".

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Daily Standup",
    "description": "Team sync meeting",
    "status": "In Progress",
    "priority": "High",
    "isDeleted": false,
    "userId": "507f1f77bcf86cd799439011",
    "createdAt": "2024-12-19T10:00:00.000Z",
    "updatedAt": "2024-12-19T10:00:00.000Z"
  }
}
```

**Error Responses:**

*400 Bad Request - Duplicate Title:*
```json
{
  "success": false,
  "message": "You already have a task with this title"
}
```

*401 Unauthorized:*
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

---

### 2. Get All Tasks
Get all tasks for the logged-in user.

**Endpoint:** `GET /api/tasks`

**Headers:**
| Header | Value |
|--------|-------|
| Authorization | Bearer <token> |

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | String | Filter by status: "Pending", "In Progress", "Completed" |
| search | String | Search tasks by title (case-insensitive) |
| sortBy | String | Sort field: "priority", "status", "title" |
| order | String | Sort order: "asc" or "desc" |

**Example Requests:**
```
GET /api/tasks
GET /api/tasks?status=Completed
GET /api/tasks?search=meeting
GET /api/tasks?status=Pending&search=daily
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Daily Standup",
      "description": "Team sync meeting",
      "status": "In Progress",
      "priority": "High",
      "isDeleted": false,
      "userId": "507f1f77bcf86cd799439011",
      "createdAt": "2024-12-19T10:00:00.000Z",
      "updatedAt": "2024-12-19T10:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Code Review",
      "description": "Review PR #123",
      "status": "Pending",
      "priority": "Medium",
      "isDeleted": false,
      "userId": "507f1f77bcf86cd799439011",
      "createdAt": "2024-12-19T09:00:00.000Z",
      "updatedAt": "2024-12-19T09:00:00.000Z"
    }
  ]
}
```

**Note:** Tasks are sorted by priority (High → Medium → Low) and then by creation date (latest first) by default.

---

### 3. Get Task by ID
Get a specific task by its ID.

**Endpoint:** `GET /api/tasks/:id`

**Headers:**
| Header | Value |
|--------|-------|
| Authorization | Bearer <token> |

**URL Parameters:**
| Parameter | Description |
|-----------|-------------|
| id | Task ID (MongoDB ObjectId) |

**Success Response (200 OK):**
```json
{
  "success": true,
  "task": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Daily Standup",
    "description": "Team sync meeting",
    "status": "In Progress",
    "priority": "High",
    "isDeleted": false,
    "userId": "507f1f77bcf86cd799439011",
    "createdAt": "2024-12-19T10:00:00.000Z",
    "updatedAt": "2024-12-19T10:00:00.000Z"
  }
}
```

**Error Responses:**

*404 Not Found:*
```json
{
  "success": false,
  "message": "Task not found"
}
```

*403 Forbidden (accessing another user's task):*
```json
{
  "success": false,
  "message": "Forbidden: You are not authorized to access this task"
}
```

---

### 4. Update Task
Update an existing task.

**Endpoint:** `PUT /api/tasks/:id`

**Headers:**
| Header | Value |
|--------|-------|
| Content-Type | application/json |
| Authorization | Bearer <token> |

**URL Parameters:**
| Parameter | Description |
|-----------|-------------|
| id | Task ID (MongoDB ObjectId) |

**Request Body:**
```json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "status": "Completed",
  "priority": "Medium"
}
```

All fields are optional. Only provided fields will be updated.

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Updated Task Title",
    "description": "Updated description",
    "status": "Completed",
    "priority": "Medium",
    "isDeleted": false,
    "userId": "507f1f77bcf86cd799439011",
    "createdAt": "2024-12-19T10:00:00.000Z",
    "updatedAt": "2024-12-19T11:00:00.000Z"
  }
}
```

**Error Responses:**

*400 Bad Request - Status Change Rule:*
```json
{
  "success": false,
  "message": "Completed task cannot be moved back to Pending status"
}
```

*400 Bad Request - Duplicate Title:*
```json
{
  "success": false,
  "message": "You already have a task with this title"
}
```

*403 Forbidden:*
```json
{
  "success": false,
  "message": "Forbidden: You are not authorized to update this task"
}
```

*404 Not Found:*
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

### 5. Delete Task (Soft Delete)
Soft delete a task (marks as deleted, not removed from database).

**Endpoint:** `DELETE /api/tasks/:id`

**Headers:**
| Header | Value |
|--------|-------|
| Authorization | Bearer <token> |

**URL Parameters:**
| Parameter | Description |
|-----------|-------------|
| id | Task ID (MongoDB ObjectId) |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Responses:**

*403 Forbidden:*
```json
{
  "success": false,
  "message": "Forbidden: You are not authorized to delete this task"
}
```

*404 Not Found:*
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

## Business Logic Summary

### Authentication & Authorization
- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Token must be sent in header: `Authorization: Bearer <token>`
- All task APIs are protected (401 Unauthorized without valid token)
- Users can only access their own tasks (403 Forbidden otherwise)

### Task Rules
1. **Duplicate Title Validation**: Same user cannot create two tasks with same title
2. **Auto Status Logic**: If priority is "High", status automatically defaults to "In Progress"
3. **Soft Delete**: Tasks are not removed from DB, `isDeleted` is set to `true`
4. **Sorting**: Tasks sorted by priority (High → Medium → Low), then by latest first
5. **Status Change Rule**: Completed task cannot move back to Pending status

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Validation error or business rule violation |
| 401 | Unauthorized - Missing or invalid authentication |
| 403 | Forbidden - User not authorized to access resource |
| 404 | Not Found - Resource does not exist |
| 500 | Internal Server Error - Server error |
