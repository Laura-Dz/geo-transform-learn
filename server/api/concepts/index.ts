// server/api/concepts/index.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/concepts - Get all concepts
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, tags } = req.query;
    
    const concepts = await prisma.concept.findMany({
      where: {
        isPublished: true,
        ...(category && { category: category as any }),
        ...(difficulty && { difficulty: difficulty as any }),
        ...(tags && { tags: { hasSome: (tags as string).split(',') } })
      },
      include: {
        examples: true,
        _count: {
          select: { 
            quizzes: true,
            progress: true 
          }
        }
      }
    });

    res.json(concepts);
  } catch (error) {
    console.error('Error fetching concepts:', error);
    res.status(500).json({ error: 'Failed to fetch concepts' });
  }
});

// GET /api/concepts/:id - Get specific concept
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const concept = await prisma.concept.findUnique({
      where: { id },
      include: {
        examples: true,
        quizzes: {
          where: { isPublished: true }
        }
      }
    });

    if (!concept) {
      return res.status(404).json({ error: 'Concept not found' });
    }

    res.json(concept);
  } catch (error) {
    console.error('Error fetching concept:', error);
    res.status(500).json({ error: 'Failed to fetch concept' });
  }
});

// GET /api/concepts/user/:userId/progress - Get user's concept progress
router.get('/user/:userId/progress', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const progress = await prisma.progress.findMany({
      where: { userId },
      include: {
        concept: {
          select: {
            id: true,
            title: true,
            category: true,
            difficulty: true
          }
        }
      }
    });

    res.json(progress);
  } catch (error) {
    console.error('Error fetching user concept progress:', error);
    res.status(500).json({ error: 'Failed to fetch concept progress' });
  }
});

// POST /api/concepts/:id/progress - Update concept progress
router.post('/:id/progress', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, status, score, timeSpent } = req.body;

    const progress = await prisma.progress.upsert({
      where: {
        userId_conceptId: {
          userId,
          conceptId: id
        }
      },
      update: {
        status,
        score,
        timeSpent,
        lastAccessed: new Date(),
        ...(status === 'COMPLETED' && { completedAt: new Date() })
      },
      create: {
        userId,
        conceptId: id,
        status,
        score,
        timeSpent,
        lastAccessed: new Date(),
        ...(status === 'COMPLETED' && { completedAt: new Date() })
      }
    });

    res.json(progress);

  } catch (error) {
    console.error('Error updating concept progress:', error);
    res.status(500).json({ error: 'Failed to update concept progress' });
  }
});

export default router;
