import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function findUser(username: string) {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    // Check both collections
    const collections = ['users', 'User'];
    
    for (const collectionName of collections) {
      console.log(`\n🔍 Searching in collection: ${collectionName}`);
      
      const users = await db.collection(collectionName)
        .find({
          $or: [
            { name: username },
            { email: username }
          ]
        })
        .project({ _id: 1, name: 1, email: 1, role: 1, createdAt: 1 })
        .toArray();
      
      if (users.length > 0) {
        console.log(`✅ Found ${users.length} user(s) in ${collectionName}:`);
        console.log(JSON.stringify(users, null, 2));
      } else {
        console.log(`ℹ️  No users found in ${collectionName} with name/email: ${username}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error finding user:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Get username from command line arguments or use 'lolo' as default
const username = process.argv[2] || 'lolo';
console.log(`🔎 Searching for user: ${username}`);

// Run the function
findUser(username)
  .catch(console.error)
  .finally(() => process.exit(0));
