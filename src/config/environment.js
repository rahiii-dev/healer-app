import dotenv from 'dotenv';

dotenv.config();

const environment = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/healer-dev',
  JWT_SECRET: process.env.JWT_SECRET || 'hfkdjhsfjhfj',
};

export default environment;
