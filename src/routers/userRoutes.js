import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

import { getProfile } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', isAuthenticated, getProfile);

export default router;