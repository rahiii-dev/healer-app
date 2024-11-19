import express from 'express';
import { registerUserValidator } from '../validators/userValidator.js';
import validationErrorHandler from '../middlewares/validationErrorHandler.js';

import { login, register } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', registerUserValidator, validationErrorHandler, register);

export default router;