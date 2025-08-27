// server/api/challenges/index.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/challenges - Get all challenges
router.get('/', async (req, res) => {
  try {
    const { difficulty, category, type } = req.query;
    
    const challenges = await prisma.challenge.findMany({
      where: {
        isPublished: true,
        ...(difficulty && { difficulty: difficulty as any }),
        ...(category && { category: category as string }),
        ...(type && { type: type as any })
      },
      include: {
        _count: {
          select: { submissions: true }
        }
      }
    });

    res.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

// GET /api/challenges/:id - Get specific challenge
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        submissions: {
          select: {
            id: true,
            userId: true,
            isCorrect: true,
            efficiency: true,
            creativity: true,
            completedAt: true
          }
        }
      }
    });

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    res.json(challenge);
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ error: 'Failed to fetch challenge' });
  }
});

// POST /api/challenges/:id/submit - Submit challenge solution
router.post('/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      userId, 
      steps, 
      finalFunction, 
      finalTransformations, 
      timeSpent, 
      hintsUsed 
    } = req.body;

    // Get challenge to validate solution
    const challenge = await prisma.challenge.findUnique({
      where: { id }
    });

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Calculate correctness, efficiency, and creativity scores
    // This is a simplified version - in reality, you'd have more complex validation
    const isCorrect = validateSolution(challenge, finalFunction, finalTransformations);
    const efficiency = calculateEfficiency(steps, challenge.constraints);
    const creativity = calculateCreativity(steps, finalFunction);

    const submission = await prisma.challengeSubmission.create({
      data: {
        userId,
        challengeId: id,
        steps,
        finalFunction,
        finalTransformations,
        timeSpent,
        hintsUsed: hintsUsed || 0,
        isCorrect,
        efficiency,
        creativity
      }
    });

    res.json({
      submissionId: submission.id,
      isCorrect,
      efficiency,
      creativity,
      points: isCorrect ? challenge.points : 0
    });

  } catch (error) {
    console.error('Error submitting challenge:', error);
    res.status(500).json({ error: 'Failed to submit challenge' });
  }
});

// GET /api/challenges/user/:userId/submissions - Get user's challenge submissions
router.get('/user/:userId/submissions', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const submissions = await prisma.challengeSubmission.findMany({
      where: { userId },
      include: {
        challenge: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            category: true,
            points: true
          }
        }
      },
      orderBy: { completedAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });

    res.json(submissions);
  } catch (error) {
    console.error('Error fetching user challenge submissions:', error);
    res.status(500).json({ error: 'Failed to fetch challenge submissions' });
  }
});

// Helper functions for solution validation
function validateSolution(challenge: any, finalFunction: string, finalTransformations: any): boolean {
  // Simplified validation - compare against target
  if (!challenge.targetGraph) return true;
  
  // In a real implementation, you'd parse and compare the mathematical expressions
  // For now, we'll do a basic string comparison
  return finalFunction === challenge.targetGraph.functionExpression;
}

function calculateEfficiency(steps: any[], constraints: any): number {
  if (!constraints?.maxTransformations) return 1.0;
  
  const stepCount = steps.length;
  const maxSteps = constraints.maxTransformations;
  
  // Higher efficiency for fewer steps
  return Math.max(0, (maxSteps - stepCount + 1) / maxSteps);
}

function calculateCreativity(steps: any[], finalFunction: string): number {
  // Simplified creativity scoring based on unique approaches
  // In reality, this would be much more sophisticated
  const uniqueTransformations = new Set(steps.map(step => step.type)).size;
  return Math.min(1.0, uniqueTransformations / 3);
}

export default router;
