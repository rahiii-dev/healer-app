import mongoose from 'mongoose';
import environment from './environment.js';

const connectDB = async () => {
  try {
    await mongoose.connect(environment.DB_URI);
    console.log(`Database connected successfully in ${environment.NODE_ENV} mode`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectDB;