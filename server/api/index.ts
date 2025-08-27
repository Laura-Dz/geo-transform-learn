// server/api/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth';
import quizRoutes from './quizzes';
import challengeRoutes from './challenges';
import practiceRoutes from './practice';
import conceptRoutes from './concepts';
import achievementRoutes from './achievements';
import profileRoutes from './profile';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8082'], // Support both frontend ports
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/concepts', conceptRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/profile', profileRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});