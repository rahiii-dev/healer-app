import express from 'express';
import { AccessTo, isAuthenticated, isVerified } from '../middlewares/authMiddleware.js';

import { getProfile } from '../controllers/userController.js';
import { PROFILE_ROLES } from '../models/UserModal.js';
import { listTherapistsForUser } from '../controllers/requestController.js';

const router = express.Router();

router.get('/profile', isAuthenticated, getProfile);
router.get('/therapists', isAuthenticated, AccessTo(PROFILE_ROLES.user), listTherapistsForUser)

export default router;