import express from "express";
import { isAuthenticated, AccessTo } from "../middlewares/authMiddleware.js";
import { PROFILE_ROLES } from "../models/UserModal.js";
import { createSlots, getSlots } from "../controllers/slotsController.js";
import validationErrorHandler from '../middlewares/validationErrorHandler.js';
import { validateCreateSlots } from "../validators/slotsValidators.js";

const router = express.Router();

router.get("/", isAuthenticated, AccessTo(PROFILE_ROLES.therapist), getSlots)
router.post("/", 
    isAuthenticated, 
    AccessTo(PROFILE_ROLES.therapist),
    validateCreateSlots,
    validationErrorHandler, 
    createSlots);

export default router;