import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Types
type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  bio: string | null;
  avatar: string | null;
  motivationalQuote: string | null;
  learningGoals: string[];
  createdAt: Date;
  updatedAt: Date;
  profile: {
    bio: string | null;
    avatar: string | null;
    learningGoals: string | null;
    preferredTopics: string[];
    skillLevel: string;
  } | null;
  quizAttempts: Array<{
    id: string;
    score: number | null;
    completedAt: Date | null;
    quiz: { title: string } | null;
  }>;
  challengeSubmissions: Array<{
    id: string;
    score: number | null;
    submittedAt: Date;
    challenge: { title: string } | null;
  }>;
  achievements: Array<{
    id: string;
    unlockedAt: Date;
    achievement: {
      id: string;
      name: string;
      description: string;
      icon: string | null;
      category: string | null;
      points: number;
    };
  }>;
};

// Get user profile
router.get('/:userId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Authorization check
    if (req.user?.id !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get user with related data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        quizAttempts: {
          take: 5,
          orderBy: { completedAt: 'desc' },
          include: { quiz: { select: { title: true } } },
        },
        challengeSubmissions: {
          take: 5,
          orderBy: { submittedAt: 'desc' },
          include: { challenge: { select: { title: true } } },
        },
        achievements: {
          take: 5,
          orderBy: { unlockedAt: 'desc' },
          include: { achievement: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate statistics
    const totalQuizzes = await prisma.quizAttempt.count({
      where: { userId },
    });

    const totalChallenges = await prisma.challengeSubmission.count({
      where: { userId },
    });

    const totalAchievements = await prisma.userAchievement.count({
      where: { userId },
    });

    // Prepare response
    const response = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: typeof user.role === 'string' && user.role.toLowerCase() === 'admin' ? 'admin' : 'student',
        bio: user.bio,
        avatar: user.avatar,
        motivationalQuote: user.motivationalQuote,
        learningGoals: user.learningGoals,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      profile: user.profile,
      stats: {
        totalQuizzes,
        totalChallenges,
        totalAchievements,
      },
      recentActivities: [
        ...user.quizAttempts.map(attempt => ({
          type: 'quiz',
          id: attempt.id,
          title: attempt.quiz?.title || 'Untitled Quiz',
          score: attempt.score,
          completedAt: attempt.completedAt,
        })),
        ...user.challengeSubmissions.map(submission => ({
          type: 'challenge',
          id: submission.id,
          title: submission.challenge?.title || 'Untitled Challenge',
          score: submission.score,
          completedAt: submission.submittedAt,
        })),
      ].sort((a, b) => 
        new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime()
      ).slice(0, 10), // Get top 10 most recent activities
      achievements: user.achievements.map(ua => ({
        id: ua.id,
        name: ua.achievement.name,
        description: ua.achievement.description || '',
        icon: ua.achievement.icon || '🏆',
        category: ua.achievement.category || 'General',
        points: ua.achievement.points,
        unlockedAt: ua.unlockedAt,
      })),
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ 
      error: 'Failed to fetch profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
