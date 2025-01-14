import express from 'express';
import { AccessTo, isAuthenticated } from '../middlewares/authMiddleware.js';
import uploadImage from '../utils/multer.js';
import { getProfile, updateClientProfile } from '../controllers/userController.js';
import { PROFILE_ROLES } from '../models/UserModal.js';
import { listTherapistsForUser } from '../controllers/requestController.js';

const router = express.Router();

router.get('/profile', isAuthenticated, getProfile);
router.put('/profile', 
    isAuthenticated,
    uploadImage('image'), 
    updateClientProfile);

router.get('/therapists', isAuthenticated, AccessTo(PROFILE_ROLES.user), listTherapistsForUser)

export default router;