# To-Do Application

A modern full-stack to-do application with a React frontend and Rust backend. The application provides a clean, responsive interface for managing tasks with real-time updates and persistent storage.

## Technology Stack

### Frontend
- React 19 with Vite
- Material-UI (MUI) for UI components
- TailwindCSS for styling
- Axios for API communication
- ESLint for code quality

### Backend
- Rust with Axum web framework
- MongoDB for data storage
- Chrono for date/time handling
- Serde for serialization/deserialization
- Tower HTTP for CORS support

## Project Structure
```
to_do_site/
├── frontend/           # React frontend application
│   ├── src/           # Source files
│   ├── public/        # Static assets
│   └── dist/          # Build output
└── backend/           # Rust backend server
    └── src/           # Source files
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Rust (latest stable version)
- MongoDB (running locally or accessible instance)

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/todo
   ```

3. Build and run the backend server:
   ```bash
   cargo run
   ```

## Development
- Frontend runs on `http://localhost:5173`
- Backend API runs on `http://localhost:3000`

## Features
- Create, read, update, and delete tasks
- Real-time task management
- Responsive design
- Modern UI with Material-UI components
- Persistent storage with MongoDB