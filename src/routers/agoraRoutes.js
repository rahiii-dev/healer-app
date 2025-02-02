import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { generateAgoraToken } from "../utils/agora.js";
import redis from "../config/redis.js";

const router = express.Router();

router.post("/generate-token", isAuthenticated, async (req, res) => {
    try {
        const { channelName, uid, role } = req.body;
        const userId = req.user.userId;
        const expiry = 86400; 

        if (!channelName || !uid) {
            return res.status(400).json({ message: "Missing channelName or uid" });
        }

        const redisKey = `agora:token:${userId}:${channelName}:${uid}`;

        const cachedToken = await redis.get(redisKey);

        if (cachedToken) {
            return res.json({ token: cachedToken });
        }

        const token = generateAgoraToken(channelName, uid, role, expiry);

        await redis.setEx(redisKey, expiry, token);

        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ message: "Error generating token", error: error.message });
    }
});

export default router;
