// server/api/users/index.ts
import { Router } from 'express';
import prisma from '../../lib/prisma';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// GET /api/users - List users (admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    const normalized = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: (u.role as unknown as string)?.toLowerCase() === 'admin' ? 'admin' : 'student',
      createdAt: u.createdAt,
      lastLogin: u.updatedAt,
    }));

    res.json(normalized);
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

export default router;
