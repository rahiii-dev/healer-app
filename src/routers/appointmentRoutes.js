import express from "express";
import { bookAppointment, getClientAppointment, getTherapistAppointment, respondToAppointment } from "../controllers/appointmentController.js";
import { AccessTo, isAuthenticated } from "../middlewares/authMiddleware.js";
import { PROFILE_ROLES } from "../models/UserModal.js";

const router = express.Router();

router.get("/client", isAuthenticated, AccessTo(PROFILE_ROLES.user), getClientAppointment)
router.get("/therapist", isAuthenticated, AccessTo(PROFILE_ROLES.therapist), getTherapistAppointment)

router.put("/respond", isAuthenticated, AccessTo(PROFILE_ROLES.therapist), respondToAppointment)

router.post("/book/:therapistId", isAuthenticated, AccessTo(PROFILE_ROLES.user), bookAppointment)

export default router;
