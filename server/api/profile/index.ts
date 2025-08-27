// server/api/profile/index.ts
import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';

const router = Router();

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// Middleware to verify JWT token
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = {
      id: decoded.userId,
      role: decoded.role || 'student'
    };
    next();
  });
};

// GET /api/profile/:userId - Get user profile
router.get('/:userId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    console.log('Profile request for userId:', userId);
    console.log('Authenticated user:', req.user);
    
    // Check if user is accessing their own profile or has admin rights
    if (req.user?.id !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    console.log('Fetching user from database...');
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return simplified profile data for now
    const profileData = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: null as string | null,
      role: 'student',
      joinDate: user.createdAt,
      bio: '',
      motivationalQuote: '',
      lastActive: user.updatedAt,
      learningGoals: [] as string[],
      achievements: [] as any[],
      recentActivity: [] as any[],
      stats: {
        totalQuizzes: 0,
        totalChallenges: 0,
        totalPractice: 0,
        averageQuizScore: 0,
        studyStreak: 0,
        totalPoints: 0
      }
    };

    res.json(profileData);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
