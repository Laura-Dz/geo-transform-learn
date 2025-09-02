import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function listUsers() {
  try {
    console.log('📋 Listing all users...');
    
    // Get all users with basic info
    const users = await prisma.$runCommandRaw({
      find: 'users',
      filter: {},
      projection: { _id: 1, name: 1, email: 1, role: 1, createdAt: 1 },
      limit: 50
    });
    
    console.log('👥 Users in the database:');
    console.log(JSON.stringify(users, null, 2));
    
  } catch (error) {
    console.error('❌ Error listing users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
listUsers()
  .catch(console.error)
  .finally(() => process.exit(0));
