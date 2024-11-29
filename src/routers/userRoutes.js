import express from 'express';
import { isAuthenticated, isVerified } from '../middlewares/authMiddleware.js';

import { getProfile } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', isAuthenticated, getProfile);

router.get('/test', isAuthenticated, isVerified, (req, res) => {
    return res.json("ok")
})

export default router;