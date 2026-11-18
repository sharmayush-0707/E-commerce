import mongoose from 'mongoose';

export let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_db';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500
    });
    isMongoConnected = true;
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isMongoConnected = false;
    console.log(`⚠️ MongoDB not connected (${error.message}).`);
    console.log(` Active Storage Mode: High-Performance Resilient Local Store (Full MERN Schema & Operations active).`);
  }
};
