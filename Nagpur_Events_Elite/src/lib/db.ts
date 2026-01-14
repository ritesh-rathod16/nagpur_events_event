import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };

    console.log('⏳ Attempting to connect to MongoDB...');
    const start = Date.now();

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        const duration = Date.now() - start;
        console.log(`✅ MongoDB connected successfully in ${duration}ms`);
        return mongoose;
      })
      .catch((error) => {
        const duration = Date.now() - start;
        console.error(`❌ MongoDB connection error after ${duration}ms:`, error.message);
        
        if (error.message.includes("Could not connect to any servers")) {
          console.error("CRITICAL: IP Whitelist issue detected. Please ensure your current IP is whitelisted in MongoDB Atlas Network Access.");
        }
        
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
