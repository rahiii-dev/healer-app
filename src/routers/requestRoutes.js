import express from "express";
import {
  sendRequest,
  respondToRequest,
  getRequestsForTherapist,
  getRequestsForClient,
} from "../controllers/requestController.js";
import { isAuthenticated, AccessTo } from "../middlewares/authMiddleware.js";
import { PROFILE_ROLES } from "../models/UserModal.js";

const router = express.Router();

router.post("/", isAuthenticated, AccessTo(PROFILE_ROLES.user), sendRequest);
router.post("/respond", isAuthenticated, AccessTo(PROFILE_ROLES.therapist), respondToRequest);

router.get("/therapist/:therapistId", isAuthenticated, AccessTo(PROFILE_ROLES.therapist), getRequestsForTherapist);
router.get("/client/:clientId", isAuthenticated, AccessTo(PROFILE_ROLES.user), getRequestsForClient);

export default router;
