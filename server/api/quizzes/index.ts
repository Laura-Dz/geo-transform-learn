// server/api/quizzes/index.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/quizzes - Get all quizzes
router.get('/', async (req, res) => {
  try {
    const { difficulty, category, conceptId } = req.query;
    
    const quizzes = await prisma.quiz.findMany({
      where: {
        isPublished: true,
        ...(difficulty && { difficulty: difficulty as any }),
        ...(category && { category: category as string }),
        ...(conceptId && { conceptId: conceptId as string })
      },
      include: {
        questions: true,
        concept: true,
        _count: {
          select: { attempts: true }
        }
      }
    });

    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// GET /api/quizzes/:id - Get specific quiz with questions
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        },
        concept: true
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// POST /api/quizzes/:id/attempt - Submit quiz attempt
router.post('/:id/attempt', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, answers, timeSpent, hintsUsed, isTimedMode } = req.body;

    // Get quiz with questions to calculate score
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: true }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Calculate score and accuracy
    let correctAnswers = 0;
    let totalPoints = 0;
    const categoryBreakdown: Record<string, { correct: number; total: number }> = {};

    const answerRecords = [];

    for (const answer of answers) {
      const question = quiz.questions.find(q => q.id === answer.questionId);
      if (!question) continue;

      const isCorrect = answer.userAnswer === question.correctAnswer;
      if (isCorrect) {
        correctAnswers++;
        totalPoints += question.points;
      }

      // Track category performance
      const category = question.category || 'general';
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = { correct: 0, total: 0 };
      }
      categoryBreakdown[category].total++;
      if (isCorrect) {
        categoryBreakdown[category].correct++;
      }

      answerRecords.push({
        questionId: question.id,
        userAnswer: answer.userAnswer,
        isCorrect,
        timeSpent: answer.timeSpent || 0
      });
    }

    const maxPossiblePoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const score = maxPossiblePoints > 0 ? (totalPoints / maxPossiblePoints) * 100 : 0;
    const accuracy = quiz.questions.length > 0 ? (correctAnswers / quiz.questions.length) * 100 : 0;

    // Create quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId: id,
        score,
        accuracy,
        totalPoints: maxPossiblePoints,
        timeSpent,
        hintsUsed: hintsUsed || 0,
        isTimedMode: isTimedMode || false,
        answersData: answers,
        categoryBreakdown,
        answers: {
          create: answerRecords.map(answer => ({
            questionId: answer.questionId,
            userAnswer: answer.userAnswer,
            isCorrect: answer.isCorrect,
            timeSpent: answer.timeSpent
          }))
        }
      },
      include: {
        answers: true
      }
    });

    res.json({
      attemptId: attempt.id,
      score,
      accuracy,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      categoryBreakdown
    });

  } catch (error) {
    console.error('Error submitting quiz attempt:', error);
    res.status(500).json({ error: 'Failed to submit quiz attempt' });
  }
});

// GET /api/quizzes/user/:userId/attempts - Get user's quiz attempts
router.get('/user/:userId/attempts', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const attempts = await prisma.quizAttempt.findMany({
      where: { userId },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            category: true
          }
        }
      },
      orderBy: { completedAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });

    res.json(attempts);
  } catch (error) {
    console.error('Error fetching user quiz attempts:', error);
    res.status(500).json({ error: 'Failed to fetch quiz attempts' });
  }
});

export default router;
