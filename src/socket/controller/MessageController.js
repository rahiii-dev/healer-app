import ConversationModal from "../../models/ConversationModal.js";
import MessageModal, { MESSAGE_STATUS } from "../../models/MessageModal.js";
import { BaseController } from "./baseController.js";

export class MessageController extends BaseController {
    constructor(socket, userSocketManager) {
        super(socket, userSocketManager);  
    }

    async readMessage({ userId, chatId }) {
        try {
            await MessageModal.updateMany(
                { conversation: chatId, to: userId, status: { $ne: MESSAGE_STATUS.READ } },
                { $set: { status: MESSAGE_STATUS.READ } }
            );

            this.socket.emit("message-status-update", {
                userId,
                chatId,
                status: MESSAGE_STATUS.READ,
            });
        } catch (error) {
            this.socket.emit("error", { message: "Failed to mark messages as read." });
        }
    }

    async sendMessage({ from, to, text }) {
        try {
            let chat = await this.getOrCreateChat(from, to);
            
            const newMessage = await this.createMessage(chat._id, from, to, text);

            chat.lastMessage = newMessage;
            await chat.save();
            
            await this.handleMessageDelivery(newMessage, from, to);

            return newMessage;
        } catch (error) {
            console.error("Error sending message:", error);
            this.socket.emit("error", { message: "Failed to send message." });
        }
    }

    async getOrCreateChat(from, to) {
        let chat = await ConversationModal.findOne({
            participants: { $all: [from, to] },
        });

        if (!chat) {
            chat = await ConversationModal.create({
                participants: [from, to],
            });
        } 

        return chat;
    }

    async createMessage(conversationId, from, to, text) {
        const newMessage = await MessageModal.create({
            conversation: conversationId,
            from,
            to,
            text,
            status: MESSAGE_STATUS.SENT,
        });

        return newMessage;
    }

    async handleMessageDelivery(newMessage, from, to) {
        const toSocketId = this.userSocketManager.get(to);
        const fromSocketId = this.userSocketManager.get(from);

        if (toSocketId) {
            newMessage.status = MESSAGE_STATUS.DELIVERED;
            this.socket.to(toSocketId).emit("new-message", { newMessage });
        }

        if (fromSocketId) {
            this.socket.to(fromSocketId).emit("new-message", { newMessage });
        }

        await newMessage.save();
    }
    
}