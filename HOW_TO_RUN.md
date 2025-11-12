# How to Run the Archaeology Catalog Application

This application consists of two parts:
1. **Backend Server** (Express + SQLite API) - runs on port 4000
2. **Frontend** (React app) - runs on port 3000

## Prerequisites

- Node.js installed (version 14 or higher recommended)
- npm installed (comes with Node.js)

## Step-by-Step Instructions

### Option 1: Quick Start (Recommended)

#### Step 1: Install Server Dependencies
Open a terminal/PowerShell in the project root and run:
```bash
cmd /c "cd server && npm install"
```

#### Step 2: Build and Start the Backend Server
In the same terminal, run:
```bash
cmd /c "npm run server"
```

This will:
- Build the TypeScript server code
- Start the server on http://localhost:4000
- Create a `data.sqlite` file in the project root (database)

**Keep this terminal window open** - the server needs to keep running.

#### Step 3: Start the Frontend (in a NEW terminal)
Open a **new** terminal/PowerShell window in the project root and run:
```bash
npm start
```

This will:
- Start the React development server
- Open http://localhost:3000 in your browser
- The app will automatically reload when you make changes

### Option 2: Manual Steps

If you prefer to build and start separately:

#### Backend:
```bash
# Install server dependencies
cmd /c "cd server && npm install"

# Build the server
cmd /c "npm run server:build"

# Start the server
cmd /c "npm run server:start"
```

#### Frontend:
```bash
# Install frontend dependencies (if not already done)
npm install

# Start the React app
npm start
```

## Accessing the Application

Once both servers are running:
- **Frontend**: Open http://localhost:3000 in your browser
- **Backend API**: Available at http://localhost:4000/api

## Troubleshooting

### If the server fails to start:

1. **Check if port 4000 is already in use:**
   - Close any other applications using port 4000
   - Or change the port in `server/src/index.ts` (last line)

2. **Reinstall server dependencies:**
   ```bash
   cmd /c "cd server && npm install"
   ```

3. **Build the server manually:**
   ```bash
   cmd /c "cd server && npm run build"
   ```

### If the frontend can't connect to the backend:

- Make sure the backend server is running on port 4000
- Check that the API URL in `src/utils/api.ts` matches your server URL
- Default is `http://localhost:4000`

### Database Location

The SQLite database file (`data.sqlite`) will be created in the project root when the server first starts. This file stores all your catalogs and artifacts.

## What Each Server Does

### Backend Server (`http://localhost:4000`)
- Provides REST API endpoints for:
  - `/api/catalogs` - Catalog CRUD operations
  - `/api/artifacts` - Artifact CRUD operations
  - `/api/stats` - Statistics endpoint
- Stores data in SQLite database (`data.sqlite`)

### Frontend (`http://localhost:3000`)
- React application with user interface
- Communicates with backend API
- Falls back to localStorage if API is unavailable

## Development Tips

- **Hot Reload**: Both servers support hot reloading:
  - Frontend: Changes reload automatically in the browser
  - Backend: Restart the server after making changes to server code

- **Database**: The `data.sqlite` file is your database. To reset:
  - Stop the server
  - Delete `data.sqlite`
  - Restart the server (it will create a new empty database)

- **Logs**: 
  - Backend logs appear in the terminal running `npm run server`
  - Frontend logs appear in the browser console (F12)

