import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function updateUserRole(username: string) {
  try {
    // Find the user by username
    const user = await prisma.user.findFirst({
      where: { name: username }
    });

    if (!user) {
      console.error(`User '${username}' not found`);
      return;
    }

    // Update the user's role to ADMIN
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { 
        role: 'ADMIN'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true
      }
    });

    console.log('User role updated successfully:');
    console.log(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function with the username 'lolo'
updateUserRole('lolo');
