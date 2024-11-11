import { v2 as cloudinary } from 'cloudinary';
import environment from './environment.js';

cloudinary.config({
  cloud_name: environment.CLOUDINARY.cloud_name,
  api_key: environment.CLOUDINARY.api_key,
  api_secret: environment.CLOUDINARY.api_secret,
  secure: true,
});

export default cloudinary;