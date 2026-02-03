# Prompt-Base

A developer-focused web tool for creating, managing, and refining AI prompts with advanced features including version control, collaboration, and analytics.

## 🚀 Features

- **Prompt Management**: Create, edit, organize, and archive prompts with rich metadata
- **Advanced Search**: Full-text search with filtering by status, priority, and tags
- **User Authentication**: Secure JWT-based authentication with email verification
- **Two-Factor Authentication**: Enhanced security with TOTP-based 2FA
- **Role-Based Access Control**: Admin, moderator, and user roles with granular permissions
- **Real-time Updates**: WebSocket-based notifications and activity feeds
- **Session Management**: Track and manage active sessions across devices
- **Password Reset**: Secure password recovery via email
- **Activity Logging**: Comprehensive audit trail of user actions
- **Dashboard Analytics**: Visual insights into prompt usage and statistics
- **Profile Management**: Customizable user profiles with avatar support
- **Responsive Design**: Modern UI built with Tailwind CSS and Radix UI

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (Access & Refresh Tokens)
- **Real-time**: Socket.io
- **Email**: Nodemailer
- **Security**: Helmet, express-rate-limit, express-mongo-sanitize, HPP, XSS-Clean
- **Validation**: Zod
- **Testing**: Jest, Supertest

### Frontend

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, Headless UI
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router v7
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Notifications**: React Hot Toast, Sonner
- **Testing**: Vitest, Playwright, React Testing Library

### Code Quality

- **Linting**: ESLint 9 (Flat Config)
- **Formatting**: Prettier
- **Git Hooks**: Husky with lint-staged
- **Pre-commit**: Automated linting and formatting

## 📋 Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher (or yarn/pnpm)
- **MongoDB**: 6.x or higher (local or MongoDB Atlas)
- **Git**: For version control

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Kunj-1087/Prompt-Base.git
cd Prompt-Base
```

### 2. Install Dependencies

#### Root (for Husky)

```bash
npm install
```

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 3. Environment Variables

Create `.env` files in both `backend` and `frontend` directories based on the examples below:

#### Backend `.env`

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=mongodb://localhost:27017/prompt-base

# JWT Secrets (use strong random strings)
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this

# CORS
CORS_ORIGIN=http://localhost:5173

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@prompt-base.com
```

#### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Database Setup

Ensure MongoDB is running locally or use MongoDB Atlas:

```bash
# For local MongoDB
mongod

# The application will automatically create the database and collections
```

### 5. Running the Application

#### Development Mode

**Backend** (runs on http://localhost:5000):

```bash
cd backend
npm run dev
```

**Frontend** (runs on http://localhost:5173):

```bash
cd frontend
npm run dev
```

#### Production Build

**Backend**:

```bash
cd backend
npm run build
npm start
```

**Frontend**:

```bash
cd frontend
npm run build
npm run preview
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test                # Run all tests
npm run test:watch      # Watch mode
```

### Frontend Tests

```bash
cd frontend
npm test                # Run unit tests
npm run test:watch      # Watch mode
npm run test:e2e        # Run E2E tests with Playwright
```

## 📁 Project Structure

```
Prompt-Base/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Custom middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── .eslintrc.json      # ESLint config
│   ├── .prettierrc         # Prettier config
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx         # Root component
│   │   └── main.tsx        # Entry point
│   ├── eslint.config.js    # ESLint config
│   ├── .prettierrc         # Prettier config
│   └── package.json
├── .husky/                 # Git hooks
├── API.md                  # API documentation
├── CONTRIBUTING.md         # Contributing guidelines
├── CHANGELOG.md            # Version history
└── README.md               # This file
```

## 📚 Documentation

- **[API Documentation](./API.md)**: Complete API reference with examples
- **[Contributing Guide](./CONTRIBUTING.md)**: How to contribute to the project
- **[Changelog](./CHANGELOG.md)**: Version history and release notes

## 🔐 Security Features

- JWT-based authentication with access and refresh tokens
- Password hashing with bcrypt
- Rate limiting on authentication endpoints
- CORS protection
- Helmet security headers
- MongoDB injection prevention
- XSS protection
- HTTP Parameter Pollution (HPP) protection
- Input validation with Zod
- Session tracking and management
- Two-factor authentication (TOTP)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Code of conduct
- Development workflow
- Coding standards
- Pull request process

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Kunj-1087** - [GitHub](https://github.com/Kunj-1087)

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by developer productivity tools
- Community feedback and contributions

## 📞 Support

For issues, questions, or suggestions:

- **GitHub Issues**: [Create an issue](https://github.com/Kunj-1087/Prompt-Base/issues)
- **Email**: Contact through GitHub profile

---

**Happy Prompting! 🎯**
