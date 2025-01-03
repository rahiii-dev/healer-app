import ConversationModal from "../models/ConversationModal.js";
import MessageModal, { MESSAGE_STATUS } from "../models/MessageModal.js";
import asyncWrapper from "../utils/asyncWrapper.js";

/**
 * @route   GET /api/chats
 * @desc    get all chats
 * @access  Protected for all users
 */
export const myChats = asyncWrapper(async (req, res) => {
    const userId = req.user.userId;
    const chats = await ConversationModal.find({ participants: userId })
    .populate('participants', 'profile profileModel image') 
    .populate('lastMessage'); 
    res.json({chats});
});

/**
 * @route   GET /api/chats/:chatId
 * @desc    get chat by chat
 * @access  Protected for all users
 */
export const getChat = asyncWrapper(async (req, res) => {
    const chatId = req.params.chatId;
    const userId = req.user.userId;

    const [_, chat] = await Promise.all([
        MessageModal.updateMany(
            { conversation: chatId, to: userId, status: { $ne: MESSAGE_STATUS.READ } },
            { status: MESSAGE_STATUS.READ }
        ),
        MessageModal.find({ conversation: chatId }).sort({ createdAt: 1 })
    ]);

    return res.json({chat})
});