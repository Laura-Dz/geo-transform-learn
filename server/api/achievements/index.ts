// server/api/achievements/index.ts
import { Router } from 'express';
import prisma from '../../lib/prisma';

const router = Router();

// GET /api/achievements - Get all achievements
router.get('/', async (req, res) => {
  try {
    const { category, isActive } = req.query;
    
    const achievements = await prisma.achievement.findMany({
      where: {
        ...(category && { category: category as any }),
        ...(isActive !== undefined && { isActive: isActive === 'true' })
      },
      include: {
        _count: {
          select: { userAchievements: true }
        }
      }
    });

    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// GET /api/achievements/user/:userId - Get user's achievements
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true
      },
      orderBy: { unlockedAt: 'desc' }
    });

    res.json(userAchievements);
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    res.status(500).json({ error: 'Failed to fetch user achievements' });
  }
});

// POST /api/achievements/check/:userId - Check and unlock achievements for user
router.post('/check/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { context } = req.body; // Context about what the user just did

    // Get all active achievements
    const achievements = await prisma.achievement.findMany({
      where: { isActive: true }
    });

    // Get user's current achievements
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true }
    });

    const unlockedAchievementIds = new Set(userAchievements.map((ua: any) => ua.achievementId));
    const newlyUnlocked = [];

    for (const achievement of achievements) {
      if (unlockedAchievementIds.has(achievement.id)) continue;

      const shouldUnlock = await checkAchievementCriteria(userId, achievement, context);
      
      if (shouldUnlock) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id
          }
        });
        
        newlyUnlocked.push(achievement);
      }
    }

    res.json({ newlyUnlocked });

  } catch (error) {
    console.error('Error checking achievements:', error);
    res.status(500).json({ error: 'Failed to check achievements' });
  }
});

// Helper function to check achievement criteria
async function checkAchievementCriteria(userId: string, achievement: any, context: any): Promise<boolean> {
  const criteria = achievement.criteria;
  
  switch (criteria.type) {
    case 'quizzes-completed':
      const totalQuizzes = await prisma.quizAttempt.count({
        where: { userId }
      });
      return totalQuizzes >= criteria.threshold;

    case 'consecutive-accuracy':
      const recentAttempts = await prisma.quizAttempt.findMany({
        where: { userId },
        orderBy: { completedAt: 'desc' },
        take: criteria.timeframe ? parseInt(criteria.timeframe.split('-')[0]) : 5
      });
      
      if (recentAttempts.length < (criteria.timeframe ? parseInt(criteria.timeframe.split('-')[0]) : 5)) {
        return false;
      }
      
      return recentAttempts.every((attempt: any) => 
        (attempt.accuracy || 0) >= (criteria.threshold * 100)
      );

    case 'time-and-accuracy':
      if (context?.quizAttempt) {
        return (context.quizAttempt.timeSpent <= criteria.threshold) && 
               ((context.quizAttempt.accuracy || 0) >= 80);
      }
      return false;

    case 'category-mastery':
      const categoryAttempts = await prisma.quizAttempt.findMany({
        where: { 
          userId,
          quiz: {
            category: criteria.category || 'transformation'
          }
        }
      });
      
      if (categoryAttempts.length === 0) return false;
      
      const avgAccuracy = categoryAttempts.reduce((sum: number, attempt: any) => 
        sum + (attempt.accuracy || 0), 0) / categoryAttempts.length;
      
      return avgAccuracy >= (criteria.threshold * 100);

    case 'daily-streak':
      const userProfile = await prisma.userProfile.findUnique({
        where: { userId }
      });
      return (userProfile?.studyStreak || 0) >= criteria.threshold;

    default:
      return false;
  }
}

export default router;
