import express from 'express';
import validationErrorHandler from '../middlewares/validationErrorHandler.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

import { createTherapist, deleteTherapist, getTherapist, listTherapist, updateTherapist } from '../controllers/adminController.js';
import { createTherapistValidator, updateTherapistValidator } from '../validators/therapistValidator.js';
import uploadImage from '../utils/multer.js';

const router = express.Router();

router.get('/therapist/list', isAuthenticated, isAdmin, listTherapist);
router.get('/therapist/:profileId', isAuthenticated, isAdmin, getTherapist);

router.post('/therapist',
    isAuthenticated, isAdmin,
    uploadImage('image'),
    createTherapistValidator, 
    validationErrorHandler, 
    createTherapist
);
router.put('/therapist/:profileId',
    isAuthenticated, isAdmin,
    uploadImage('image'),
    updateTherapistValidator, 
    validationErrorHandler, 
    updateTherapist
);
router.delete('/therapist/:profileId',
    isAuthenticated, isAdmin,
    deleteTherapist
);


export default router;