import express from 'express';
import { registerUserValidator } from '../validators/userValidator.js';
import validationErrorHandler from '../middlewares/validationErrorHandler.js';
import uploadImage from '../utils/multer.js';

import { login, register, resendOTP, verifyOTP } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register',
    uploadImage('image'), 
    registerUserValidator, 
    validationErrorHandler, 
    register);

router.post('/resend-otp', resendOTP);
router.post('/verify-otp', verifyOTP);

export default router;