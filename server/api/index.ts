// server/api/index.ts
import express from 'express';
import cors from 'cors';
import authRoutes from './auth'; // Import the auth router

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:8082', // Your Vite frontend URL
  credentials: true
}));
app.use(express.json());

// Use auth routes under /api/auth
app.use('/api/auth', authRoutes);

// Start server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});