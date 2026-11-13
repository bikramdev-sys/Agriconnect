import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export async function connectDB() {
  const rawUri = process.env.MONGO_URI?.trim();
  const uri = rawUri ? rawUri : 'mongodb://127.0.0.1:27017/agriconnect';

  try {
    mongoose.set('strictQuery', false);
    const timeoutMs = (process.env.NODE_ENV === 'production' || uri.includes('mongodb+srv')) ? 10000 : 3000;
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: timeoutMs,
    });
    isConnected = true;
    console.log(`✅ [MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ [MongoDB] Could not connect to MongoDB (${error.message}).`);
    console.warn(`📁 [AgriConnect] Seamless fallback active: Local persistent JSON store is enabled.`);
    isConnected = false;
    return false;
  }
}

export function isMongoActive() {
  return isConnected && mongoose.connection.readyState === 1;
}

