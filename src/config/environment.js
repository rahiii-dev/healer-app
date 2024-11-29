import dotenv from "dotenv";

dotenv.config();

const environment = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  DB_URI: process.env.DB_URI || "mongodb://localhost:27017/healer-dev",
  JWT_SECRET: process.env.JWT_SECRET || "hfkdjhsfjhfj",
  CLOUDINARY: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  MAIL_ID: process.env.MAIL_ID,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD
};

export default environment;
