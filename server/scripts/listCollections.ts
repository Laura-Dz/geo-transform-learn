import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function listCollections() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const collections = await db.listCollections().toArray();
    
    console.log('📂 Collections in the database:');
    console.log(collections.map(c => `- ${c.name}`).join('\n'));
    
    if (collections.length === 0) {
      console.log('No collections found. The database might be empty.');
    }
    
  } catch (error) {
    console.error('❌ Error listing collections:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the function
listCollections()
  .catch(console.error)
  .finally(() => process.exit(0));
