import { MongoClient } from 'mongodb';
import { config as dotenv } from "dotenv";
dotenv();

const { MONGO_API } = process.env;
const MONGODB_DB = "neptume";

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!MONGO_API) {
    throw new Error("MONGO_API is not set in environment variables.");
  }

  try {
    const client = await MongoClient.connect(MONGO_API);
    const db = client.db(MONGODB_DB);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

