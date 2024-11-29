import express from 'express';
import { registerUserValidator } from '../validators/userValidator.js';
import validationErrorHandler from '../middlewares/validationErrorHandler.js';

import { login, register, resendOTP, verifyOTP } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', registerUserValidator, validationErrorHandler, register);

router.post('/resend-otp', resendOTP);
router.post('/verify-otp', verifyOTP);

export default router;