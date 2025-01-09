import express from 'express';
import { getChat, myChats } from '../controllers/chatController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', isAuthenticated, myChats);
router.get('/:chatId', isAuthenticated, getChat);

export default router;
