import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.set('debug', true);

const connectDB = async () => {
  try {
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI!, {
      authSource: 'admin',
      retryWrites: true,
      w: 'majority'
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;