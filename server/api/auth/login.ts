// server/api/auth/login.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Use type assertion to handle the role field
    const userWithRole = user as any;
    const normalizedRole = (userWithRole.role || 'STUDENT').toString().toLowerCase() === 'admin' ? 'admin' : 'student';

    // Generate token with role
    const token = jwt.sign(
      { userId: user.id, role: normalizedRole },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    // Create response without password
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: normalizedRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json({
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}