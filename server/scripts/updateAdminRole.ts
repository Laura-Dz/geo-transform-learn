import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function makeUserAdmin(username: string) {
  try {
    // Find the user by username
    const user = await prisma.user.findFirst({
      where: { name: username }
    });

    if (!user) {
      console.error(`❌ User '${username}' not found`);
      return;
    }

    console.log(`🔄 Updating user '${username}' to admin role...`);
    
    // Update the user's role to ADMIN using direct MongoDB update
    const result = await prisma.$runCommandRaw({
      update: 'users',
      updates: [
        {
          q: { _id: { $oid: user.id } },
          u: { $set: { role: 'ADMIN' } },
          multi: false,
          upsert: false
        }
      ]
    });

    // Verify the update
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, name: true, email: true, role: true, updatedAt: true }
    });

    console.log('✅ User role updated successfully:');
    console.log(updatedUser);
    
  } catch (error) {
    console.error('❌ Error updating user role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function with the username 'lolo'
makeUserAdmin('lolo')
  .catch(console.error)
  .finally(() => process.exit(0));
