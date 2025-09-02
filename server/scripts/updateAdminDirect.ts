import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function makeUserAdmin(username: string) {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const users = db.collection('users');
    
    // Find the user by username
    const user = await users.findOne({ name: username });
    
    if (!user) {
      console.error(`❌ User '${username}' not found`);
      return;
    }
    
    console.log(`🔄 Updating user '${username}' to admin role...`);
    
    // Update the user's role to ADMIN
    const result = await users.updateOne(
      { _id: user._id },
      { $set: { role: 'ADMIN' } }
    );
    
    if (result.modifiedCount === 1) {
      console.log('✅ User role updated successfully!');
      
      // Verify the update
      const updatedUser = await users.findOne(
        { _id: user._id },
        { projection: { _id: 1, name: 1, email: 1, role: 1, updatedAt: 1 } }
      );
      
      console.log('Updated user details:');
      console.log(updatedUser);
    } else {
      console.log('⚠️  No changes were made. The user might already have the ADMIN role.');
    }
    
  } catch (error) {
    console.error('❌ Error updating user role:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the function with the username 'lolo'
makeUserAdmin('lolo')
  .catch(console.error)
  .finally(() => process.exit(0));
