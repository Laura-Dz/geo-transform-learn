// server/api/practice/index.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/practice - Get all practice scenarios
router.get('/', async (req, res) => {
  try {
    const { context, difficulty } = req.query;
    
    const scenarios = await prisma.practiceScenario.findMany({
      where: {
        isPublished: true,
        ...(context && { context: context as any })
      },
      include: {
        _count: {
          select: { progress: true }
        }
      }
    });

    res.json(scenarios);
  } catch (error) {
    console.error('Error fetching practice scenarios:', error);
    res.status(500).json({ error: 'Failed to fetch practice scenarios' });
  }
});

// GET /api/practice/:id - Get specific practice scenario
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const scenario = await prisma.practiceScenario.findUnique({
      where: { id }
    });

    if (!scenario) {
      return res.status(404).json({ error: 'Practice scenario not found' });
    }

    res.json(scenario);
  } catch (error) {
    console.error('Error fetching practice scenario:', error);
    res.status(500).json({ error: 'Failed to fetch practice scenario' });
  }
});

// GET /api/practice/user/:userId/progress - Get user's practice progress
router.get('/user/:userId/progress', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const progress = await prisma.practiceProgress.findMany({
      where: { userId },
      include: {
        scenario: {
          select: {
            id: true,
            title: true,
            context: true,
            description: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json(progress);
  } catch (error) {
    console.error('Error fetching user practice progress:', error);
    res.status(500).json({ error: 'Failed to fetch practice progress' });
  }
});

// POST /api/practice/:id/progress - Update practice progress
router.post('/:id/progress', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      userId, 
      completedSteps, 
      reflectionAnswers, 
      timeSpent, 
      insights 
    } = req.body;

    // Get scenario to calculate completion
    const scenario = await prisma.practiceScenario.findUnique({
      where: { id }
    });

    if (!scenario) {
      return res.status(404).json({ error: 'Practice scenario not found' });
    }

    const totalSteps = Array.isArray(scenario.guidedSteps) ? scenario.guidedSteps.length : 0;
    const completedCount = completedSteps.length;
    const isCompleted = completedCount >= totalSteps;
    const score = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

    const progress = await prisma.practiceProgress.upsert({
      where: {
        userId_scenarioId: {
          userId,
          scenarioId: id
        }
      },
      update: {
        completedSteps,
        reflectionAnswers,
        timeSpent,
        isCompleted,
        score,
        insights: insights || []
      },
      create: {
        userId,
        scenarioId: id,
        completedSteps,
        reflectionAnswers,
        timeSpent,
        isCompleted,
        score,
        insights: insights || []
      }
    });

    res.json(progress);

  } catch (error) {
    console.error('Error updating practice progress:', error);
    res.status(500).json({ error: 'Failed to update practice progress' });
  }
});

// POST /api/practice/:id/complete - Mark practice scenario as completed
router.post('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, finalReflections, insights } = req.body;

    const progress = await prisma.practiceProgress.update({
      where: {
        userId_scenarioId: {
          userId,
          scenarioId: id
        }
      },
      data: {
        isCompleted: true,
        score: 100,
        reflectionAnswers: {
          ...req.body.reflectionAnswers,
          finalReflections
        },
        insights: insights || []
      }
    });

    res.json(progress);

  } catch (error) {
    console.error('Error completing practice scenario:', error);
    res.status(500).json({ error: 'Failed to complete practice scenario' });
  }
});

export default router;
