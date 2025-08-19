import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const app = express();
const prisma = new PrismaClient();

app.use(express.json()); // Parse JSON bodies

// Signup route
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
});

// Validate token route (mock for now)
app.post('/api/auth/validate', (req, res) => {
  // Add real validation later
  res.json({ id: '1', email: 'student@example.com', name: 'Student' });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));