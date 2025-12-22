# Mizuki Blog - Backend API

Backend API for the Mizuki Blog admin panel, built with Express.js.

## Features

- ✅ User authentication (JWT)
- ✅ Blog post management (CRUD operations)
- ✅ Album and photo management
- ✅ File upload support
- ✅ RESTful API design
- ✅ Secure authentication

## Tech Stack

- **Server**: Express.js
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer
- **Database**: File system (JSON files)
- **Environment**: Node.js

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or pnpm

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Configure the `.env` file with your settings:
   ```env
   PORT=3001
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   ```

### Running the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user info |

### Blog Posts (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/posts` | Get all posts |
| GET | `/api/admin/posts/:id` | Get a single post |
| POST | `/api/admin/posts` | Create a new post |
| PUT | `/api/admin/posts/:id` | Update a post |
| DELETE | `/api/admin/posts/:id` | Delete a post |

### Albums (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/albums` | Get all albums |
| GET | `/api/admin/albums/:id` | Get a single album |
| POST | `/api/admin/albums` | Create a new album |
| PUT | `/api/admin/albums/:id` | Update an album |
| DELETE | `/api/admin/albums/:id` | Delete an album |

### Photos (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/albums/:id/photos` | Upload photos to an album |
| DELETE | `/api/admin/albums/:id/photos/:photoId` | Delete a photo from an album |

## Admin Panel

The admin panel is available at `http://localhost:3000/admin` when the frontend server is running.

### Default Admin Credentials

- **Username**: admin
- **Password**: admin123

## Project Structure

```
backend/
├── controllers/          # Route handlers
│   ├── auth.js          # Authentication controller
│   ├── posts.js         # Blog posts controller
│   └── albums.js        # Albums and photos controller
├── middleware/          # Middleware functions
│   └── auth.js          # Authentication middleware
├── models/              # Data models
├── routes/              # Route definitions
│   ├── auth.js          # Authentication routes
│   ├── posts.js         # Blog post routes
│   └── albums.js        # Album routes
├── utils/               # Utility functions
│   └── auth.js          # Authentication utilities
├── database/            # Data storage (JSON files)
│   ├── posts/           # Blog posts
│   └── albums/          # Albums data
├── .env.example         # Environment variables example
├── package.json         # Project dependencies
└── server.js            # Server entry point
```

## Security

- All admin routes are protected with JWT authentication
- Passwords are hashed using bcryptjs
- File uploads are validated and sanitized
- CORS is configured to allow requests from the frontend

## Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Start the backend server in production mode:
   ```bash
   npm start
   ```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
