import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    // Use type assertion to handle the role field
    const userWithRole = user as any;
    const normalizedRole = (userWithRole.role || 'STUDENT').toString().toLowerCase() === 'admin' ? 'admin' : 'student';
    
    // Generate token
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
      createdAt: user.createdAt
    };

    res.status(201).json({
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}