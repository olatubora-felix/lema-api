# Users-Posts Backend API

A RESTful API backend server for managing users and posts, built with Node.js, TypeScript, Express.js, and SQLite3.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Development](#development)
- [Important Notes](#important-notes)

## ✨ Features

- RESTful API for users and posts management
- SQLite3 database for data persistence
- TypeScript for type safety
- Express.js for routing and middleware
- Error handling middleware
- CORS enabled for cross-origin requests
- Pagination support for users listing
- Input validation and error handling

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **TypeScript** (installed as dev dependency)
- **SQLite3** (installed as dependency)

## 🚀 Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Build the project:**

   ```bash
   npm run build
   ```

   This compiles TypeScript files from `src/` into JavaScript in the `dist/` directory.

## ⚙️ Configuration

The server configuration is located in `config/default.json`:

```json
{
  "port": 3001,
  "dbPath": "./data.db"
}
```

- **port**: The port number on which the server will run (default: 3001)
- **dbPath**: Path to the SQLite database file (default: ./data.db)

## 🏃 Running the Server

### Production Mode

Start the server using compiled JavaScript files:

```bash
npm start
```

The server will run on the port specified in `config/default.json` (default: 3001).

### Development Mode

**With hot reloading (nodemon):**

```bash
npm run dev
```

**Without hot reloading:**

```bash
npm run dev:once
```

## 📡 API Endpoints

### Users

#### Get All Users (with pagination)
```
GET /users?page=1&limit=10
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of users per page (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

#### Get User by ID
```
GET /users/:id
```

**Response:**
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": { ... }
}
```

#### Get Users Count
```
GET /users/count
```

**Response:**
```json
{
  "success": true,
  "message": "User count fetched successfully",
  "data": {
    "count": 100
  }
}
```

### Posts

#### Get Posts by User ID
```
GET /posts?userId=<user_id>
```

**Query Parameters:**
- `userId` (required): The ID of the user whose posts to retrieve

**Response:**
```json
{
  "success": true,
  "message": "Posts fetched successfully",
  "data": {
    "posts": [...]
  }
}
```

#### Create Post
```
POST /posts
```

**Request Body:**
```json
{
  "title": "Post Title",
  "body": "Post content",
  "user_id": "user-id-here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "post": { ... }
  }
}
```

#### Delete Post
```
DELETE /posts/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully",
  "data": null
}
```

## 📁 Project Structure

```
backend/
├── src/                    # TypeScript source files
│   ├── db/                 # Database layer
│   │   ├── connection.ts   # SQLite database connection
│   │   ├── posts/          # Posts database operations
│   │   │   ├── posts.ts
│   │   │   ├── query-tamplates.ts
│   │   │   └── types.ts
│   │   └── users/          # Users database operations
│   │       ├── users.ts
│   │       ├── query-templates.ts
│   │       └── types.ts
│   ├── middleware/         # Express middleware
│   │   └── errorHandler.ts # Global error handler
│   ├── routes/             # API route handlers
│   │   ├── posts.ts        # Posts routes
│   │   └── users.ts        # Users routes
│   ├── utils/              # Utility functions
│   │   ├── asyncHandler.ts # Async error wrapper
│   │   ├── errors.ts       # Custom error classes
│   │   └── responseHandler.ts # Response formatting
│   └── index.ts            # Application entry point
├── config/                 # Configuration files
│   └── default.json        # Server configuration
├── dist/                   # Compiled JavaScript files (generated)
├── data.db                 # SQLite database file
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── nodemon.json            # Nodemon configuration
└── README.md               # This file
```

## 🛠 Technologies Used

- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web framework
- **SQLite3** - Lightweight database
- **UUID** - Unique identifier generation
- **Config** - Configuration management
- **Nodemon** - Development server with hot reload
- **ts-node** - TypeScript execution for Node.js

## 💻 Development

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the production server
- `npm run dev` - Run development server with hot reloading
- `npm run dev:once` - Run development server without hot reloading

### Code Style

- TypeScript strict mode enabled
- Async/await pattern for asynchronous operations
- Error handling via custom error classes and middleware
- Consistent response format using response handlers

## ⚠️ Important Notes

- **Build Required**: Make sure TypeScript files are compiled (`npm run build`) before running in production mode
- **Database**: The SQLite database file (`data.db`) is created automatically if it doesn't exist
- **CORS**: Cross-Origin Resource Sharing is enabled for all origins (`*`)
- **Port**: Default port is 3001, can be changed in `config/default.json`
- **Production**: The production server runs from compiled files in the `dist/` directory
- **Development**: Development mode uses `ts-node` and `nodemon` for hot reloading

## 📝 License

ISC
