import { MongoClient, Db } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * Returns a cached MongoDB database connection.
 * If MONGODB_URI is absent or connection fails, returns null.
 * Failure never throws, ensuring the core analysis engine remains functional.
 */
export async function getDatabase(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return null;
  }

  if (cachedDb) {
    return cachedDb;
  }

  try {
    if (!cachedClient) {
      cachedClient = new MongoClient(uri, {
        connectTimeoutMS: 3000,
        serverSelectionTimeoutMS: 3000,
      });
      await cachedClient.connect();
    }
    const dbName = process.env.MONGODB_DB_NAME || 'scamsathi';
    cachedDb = cachedClient.db(dbName);
    return cachedDb;
  } catch (err) {
    console.warn('[MongoDB] Connection unavailable, continuing in offline/memory mode:', (err as Error).message);
    return null;
  }
}
