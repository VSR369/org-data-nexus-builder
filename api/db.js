const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // Connect to local MongoDB server
const client = new MongoClient(uri, { useNewUrlParser: true });

async function connectToDatabase() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  const db = client.db('vsr');
  // Check if a collection exists; if not, create one to ensure the database is created
  const collections = await db.listCollections().toArray();
  if (!collections.length) {
    await db.createCollection('vsr');
  }
  return db;
}

module.exports = { connectToDatabase };
