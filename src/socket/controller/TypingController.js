import { BaseController } from "./baseController.js";

export class TypingController extends BaseController {
    constructor(socket, userSocketManager) {
        super(socket, userSocketManager);  
    }

    async handleTyping({ from, to }) {
        try {
            const toSocketId = await this.userSocketManager.get(to);

            if (toSocketId) {
                this.socket.to(toSocketId).emit('user-typing', { from });
            }
        } catch (error) {
            this.socket.emit("error", { message: "Failed to notify typing status." });
        }
    }

    async handleStopTyping({ from, to }) {
        try {
            const toSocketId = await this.userSocketManager.get(to);

            if (toSocketId) {
                this.socket.to(toSocketId).emit('user-stop-typing', { from });
            }
        } catch (error) {
            this.socket.emit("error", { message: "Failed to stop typing status." });
        }
    }
}