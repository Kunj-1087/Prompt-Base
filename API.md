# API Documentation

**Base URL**: `http://localhost:5000/api/v1`

**Version**: v1

All API endpoints require authentication unless otherwise specified. Authentication is handled via JWT tokens passed in the `Authorization` header or via HTTP-only cookies.

## Table of Contents

- [Authentication](#authentication)
- [Auth Endpoints](#auth-endpoints)
- [Prompt Endpoints](#prompt-endpoints)
- [User Endpoints](#user-endpoints)
- [Admin Endpoints](#admin-endpoints)
- [Dashboard Endpoints](#dashboard-endpoints)
- [Settings Endpoints](#settings-endpoints)
- [Two-Factor Authentication](#two-factor-authentication)
- [Session Endpoints](#session-endpoints)
- [Activity Endpoints](#activity-endpoints)
- [Error Responses](#error-responses)

---

## Authentication

The API uses JWT (JSON Web Tokens) for authentication with two types of tokens:

- **Access Token**: Short-lived token (15 minutes) for API requests
- **Refresh Token**: Long-lived token (7 days) for obtaining new access tokens

### Authentication Methods

1. **HTTP-only Cookie** (Recommended): Tokens are automatically sent with requests
2. **Authorization Header**: `Authorization: Bearer <access_token>`

---

## Auth Endpoints

### POST /auth/signup

Register a new user account.

**Public Endpoint** (No authentication required)

**Request Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "user"
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isEmailVerified": false,
      "createdAt": "2026-02-03T18:00:00.000Z"
    }
  }
}
```

**Rate Limit**: 20 requests per 15 minutes per IP

---

### POST /auth/login

Authenticate a user and receive tokens.

**Public Endpoint**

**Request Body**:

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isEmailVerified": true,
      "twoFactorEnabled": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Rate Limit**: 20 requests per 15 minutes per IP

---

### POST /auth/refresh

Refresh access token using refresh token.

**Public Endpoint**

**Request Body**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### POST /auth/logout

Logout user and invalidate tokens.

**Public Endpoint**

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### POST /auth/check-email

Check if an email is already registered.

**Public Endpoint**

**Request Body**:

```json
{
  "email": "john@example.com"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "exists": true
  }
}
```

---

### POST /auth/forgot-password

Request a password reset email.

**Public Endpoint**

**Request Body**:

```json
{
  "email": "john@example.com"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

**Rate Limit**: 20 requests per 15 minutes per IP

---

### POST /auth/reset-password

Reset password using token from email.

**Public Endpoint**

**Request Body**:

```json
{
  "token": "abc123resettoken",
  "password": "NewSecurePass123!"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Password reset successful"
}
```

**Rate Limit**: 20 requests per 15 minutes per IP

---

### POST /auth/verify-email/:token

Verify email address using token from email.

**Public Endpoint**

**URL Parameters**:

- `token`: Email verification token

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

### POST /auth/resend-verification

Resend email verification link.

**Authentication Required**

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Verification email sent"
}
```

**Rate Limit**: 1 request per minute

---

## Prompt Endpoints

### POST /prompts

Create a new prompt.

**Authentication Required**

**Request Body**:

```json
{
  "title": "Customer Support Chatbot",
  "description": "A helpful chatbot for customer inquiries",
  "status": "active",
  "priority": "high",
  "tags": ["chatbot", "customer-service"],
  "metadata": {
    "category": "support",
    "version": "1.0"
  }
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "message": "Prompt created successfully",
  "data": {
    "prompt": {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Customer Support Chatbot",
      "description": "A helpful chatbot for customer inquiries",
      "status": "active",
      "priority": "high",
      "tags": ["chatbot", "customer-service"],
      "userId": "507f1f77bcf86cd799439011",
      "isDeleted": false,
      "createdAt": "2026-02-03T18:00:00.000Z",
      "updatedAt": "2026-02-03T18:00:00.000Z"
    }
  }
}
```

---

### GET /prompts

Get all prompts for the authenticated user.

**Authentication Required**

**Query Parameters**:

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (draft, active, completed, archived)
- `priority` (optional): Filter by priority (low, medium, high)
- `tags` (optional): Filter by tags (comma-separated)

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "prompts": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "title": "Customer Support Chatbot",
        "description": "A helpful chatbot for customer inquiries",
        "status": "active",
        "priority": "high",
        "tags": ["chatbot", "customer-service"],
        "userId": "507f1f77bcf86cd799439011",
        "createdAt": "2026-02-03T18:00:00.000Z",
        "updatedAt": "2026-02-03T18:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "pages": 3
    }
  }
}
```

---

### GET /prompts/search

Search prompts by text.

**Authentication Required**

**Query Parameters**:

- `q`: Search query (required, minimum 2 characters)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "prompts": [...],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

---

### GET /prompts/suggestions

Get prompt suggestions based on user's prompts.

**Authentication Required**

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "title": "Suggested Prompt Title",
        "reason": "Based on your recent activity"
      }
    ]
  }
}
```

---

### GET /prompts/:id

Get a specific prompt by ID.

**Authentication Required**

**URL Parameters**:

- `id`: Prompt ID

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "prompt": {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Customer Support Chatbot",
      "description": "A helpful chatbot for customer inquiries",
      "status": "active",
      "priority": "high",
      "tags": ["chatbot", "customer-service"],
      "userId": "507f1f77bcf86cd799439011",
      "createdAt": "2026-02-03T18:00:00.000Z",
      "updatedAt": "2026-02-03T18:00:00.000Z"
    }
  }
}
```

---

### PATCH /prompts/:id

Update a prompt.

**Authentication Required**

**URL Parameters**:

- `id`: Prompt ID

**Request Body** (all fields optional):

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "completed",
  "priority": "medium",
  "tags": ["updated", "tags"]
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Prompt updated successfully",
  "data": {
    "prompt": {
      /* updated prompt */
    }
  }
}
```

---

### DELETE /prompts/:id

Soft delete a prompt.

**Authentication Required**

**URL Parameters**:

- `id`: Prompt ID

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Prompt deleted successfully"
}
```

---

### POST /prompts/:id/restore

Restore a deleted prompt.

**Authentication Required**

**URL Parameters**:

- `id`: Prompt ID

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Prompt restored successfully",
  "data": {
    "prompt": {
      /* restored prompt */
    }
  }
}
```

---

## User Endpoints

### GET /users/profile

Get current user's profile.

**Authentication Required**

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "avatar": "https://example.com/avatar.jpg",
      "bio": "Developer and prompt enthusiast",
      "isEmailVerified": true,
      "twoFactorEnabled": false,
      "createdAt": "2026-02-03T18:00:00.000Z"
    }
  }
}
```

---

### PATCH /users/profile

Update current user's profile.

**Authentication Required**

**Request Body** (all fields optional):

```json
{
  "name": "John Updated",
  "bio": "Updated bio",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      /* updated user */
    }
  }
}
```

---

## Admin Endpoints

### GET /admin/users

Get all users (Admin only).

**Authentication Required** (Admin role)

**Query Parameters**:

- `page` (optional): Page number
- `limit` (optional): Items per page
- `role` (optional): Filter by role

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  }
}
```

---

### GET /admin/analytics

Get platform analytics (Admin only).

**Authentication Required** (Admin role)

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "totalUsers": 1000,
    "totalPrompts": 5000,
    "activeUsers": 250,
    "newUsersThisMonth": 50
  }
}
```

---

## Dashboard Endpoints

### GET /dashboard/stats

Get user dashboard statistics.

**Authentication Required**

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "totalPrompts": 25,
    "activePrompts": 10,
    "completedPrompts": 12,
    "archivedPrompts": 3
  }
}
```

---

### GET /dashboard/activity

Get recent activity feed.

**Authentication Required**

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "action": "created",
        "resourceType": "prompt",
        "resourceId": "507f1f77bcf86cd799439012",
        "timestamp": "2026-02-03T18:00:00.000Z"
      }
    ]
  }
}
```

---

## Settings Endpoints

### GET /settings/profile

Get profile settings.

**Authentication Required**

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "profile": {
      /* user profile data */
    }
  }
}
```

---

### PATCH /settings/security

Update security settings.

**Authentication Required**

**Request Body**:

```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Security settings updated"
}
```

---

## Two-Factor Authentication

### POST /2fa/setup

Setup two-factor authentication.

**Authentication Required**

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "qrCode": "data:image/png;base64,...",
    "secret": "JBSWY3DPEHPK3PXP"
  }
}
```

---

### POST /2fa/verify

Verify and enable 2FA.

**Authentication Required**

**Request Body**:

```json
{
  "token": "123456"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Two-factor authentication enabled"
}
```

---

### POST /2fa/disable

Disable two-factor authentication.

**Authentication Required**

**Request Body**:

```json
{
  "token": "123456"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Two-factor authentication disabled"
}
```

---

## Session Endpoints

### GET /sessions

Get all active sessions.

**Authentication Required**

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "userId": "507f1f77bcf86cd799439011",
        "device": "Chrome on Windows",
        "ipAddress": "192.168.1.1",
        "location": "New York, US",
        "lastActive": "2026-02-03T18:00:00.000Z",
        "createdAt": "2026-02-03T17:00:00.000Z"
      }
    ]
  }
}
```

---

### DELETE /sessions/:id

Revoke a specific session.

**Authentication Required**

**URL Parameters**:

- `id`: Session ID

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Session revoked successfully"
}
```

---

## Activity Endpoints

### GET /activity

Get user activity logs.

**Authentication Required**

**Query Parameters**:

- `page` (optional): Page number
- `limit` (optional): Items per page

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "activities": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "pages": 5
    }
  }
}
```

---

## Error Responses

All error responses follow this format:

**4xx Client Errors**:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

**5xx Server Errors**:

```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details (only in development mode)"
}
```

### Common Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

## Rate Limiting

Rate limits are applied to protect the API:

- **Authentication endpoints**: 20 requests per 15 minutes per IP
- **Email verification resend**: 1 request per minute
- **General endpoints**: 100 requests per 15 minutes per user

When rate limited, you'll receive a `429` status code with:

```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

---

## WebSocket Events

The application uses Socket.io for real-time updates on `http://localhost:5000`.

### Client Events

- `connect`: Connect to WebSocket server
- `disconnect`: Disconnect from server

### Server Events

- `notification`: New notification received
- `activity`: New activity logged
- `prompt:updated`: Prompt was updated
- `prompt:deleted`: Prompt was deleted

**Example**:

```javascript
socket.on("notification", (data) => {
  console.log("New notification:", data);
});
```
