# Real-Time Task Collaboration Platform

A lightweight Trello/Notion-style board with realtime sync, JWT auth, and drag-and-drop.

## Features
- JWT authentication with protected routes
- Boards, lists, tasks, and activity history
- Realtime updates using Socket.IO rooms
- Search and pagination for tasks
- Drag and drop tasks between lists

## Tech Stack
- **Frontend:** React (Vite), Tailwind, Axios, Socket.IO Client, dnd-kit
- **Backend:** Node.js, Express, MongoDB, Mongoose, Socket.IO

## Project Structure
```
backend/
  server/
  config/
  controllers/
  middleware/
  models/
  routes/
  socket/
  utils/
frontend/
  client/
    src/
      api/
      components/
      context/
      hooks/
      pages/
      socket/
```

## Getting Started
### Backend
```bash
dd backend/server 
npm install 
pc .env.example .env 
npm run dev 
```
### Frontend
```bash
dd frontend/client 
npm install 
pc .env.example .env 
npm run dev 
```
## Seed Data
```bash
dd backend/server 
npm run seed 
```
## Demo Credentials
- Email: demo@taskcollab.dev
- Password: demo1234

# API Documentation

## Auth
- POST `/api/auth/register`
- POST `/api/auth/login`

## Boards
- GET `/api/boards`
- GET `/api/boards/:id`
- POST `/api/boards`
- DELETE `/api/boards/:id`
- PUT `/api/boards/:id/members`

## Lists
- GET `/api/lists?boardId=...`
- POST `/api/lists`

## Tasks
- GET `/api/tasks?boardId=...&listId=...&search=...&page=1&limit=20`
- POST `/api/tasks`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`
- PUT `/api/tasks/:id/move`

## Activities
- GET `/api/activities?boardId=...&page=1&limit=20`

## Socket Events
**Client emits:**
- `join-board` (boardId)
- `leave-board` (boardId)

**Server emits:**
- `task-created`
- `task-updated`
- `task-moved`
- `task-deleted`
- `list-created`
- `activity-added`

## Architecture Notes
- MVC pattern on the backend with JWT middleware and a central error handler.
- Socket.IO server uses board-based rooms for real-time events.
- Frontend uses Context for authentication and a central socket manager.
- Drag and drop uses dnd-kit with list-level droppable containers.

## Environment Variables
**Backend (`.env`):**
| Variable | Description |
|---|---|
| PORT | Port number |
| MONGO_URI | MongoDB connection URI |
| JWT_SECRET | Secret key for JWT |
| CLIENT_URL | Frontend URL |

**Frontend (`.env`):**
vite URL: VITE_API_URL \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \"https://your-api-url.com\

