# Fullstack Employee POC

This project contains a frontend (React + Vite) and a backend (Node.js + Apollo GraphQL).
It is a demo that satisfies the assignment requirements:

- Frontend: hamburger menu, horizontal menu, grid and tile views, modal details, bun options.
- Backend: GraphQL API with list/get queries, pagination, sorting, filtering, mutations (add/update/delete), JWT RBAC (admin/employee).
- Performance & structure: file-based dataset, careful slice operations for pagination, sorting in-memory for demo. Suggested production improvements in backend/notes.

## How to run locally

1. Open two terminals.
2. Backend:
   - cd backend
   - npm install
   - copy .env.example to .env and set JWT_SECRET
   - npm start
3. Frontend:
   - cd frontend
   - npm install
   - npm run dev
4. Open http://localhost:5173

## Deliverables created:

- backend/ (GraphQL server)
- frontend/ (React app)
