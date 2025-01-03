import { MessageController } from "./controller/MessageController.js";
import { TypingController } from "./controller/TypingController.js";
import UserSocketManager from "./socketManager.js";

export const activeUsers = new Map();

export function socket(socket) {
  const socketManger = new UserSocketManager();
  const messageController = new MessageController(socket, socketManger);
  const typingController = new TypingController(socket, socketManger);

  socket.on("join", async ({ userId }) => {
    socketManger.add(userId, socket.id);
  });

  socket.on("send-message", async (data) => {
    await messageController.sendMessage(data);
  });

  socket.on("read-message", async (data) => {
    await messageController.readMessage(data);
  });

  socket.on("typing", (data) => {
    typingController.handleTyping(data);
  });

  socket.on("stop-typing", (data) => {
    typingController.handleStopTyping(data);
  });

  socket.on("disconnect", async () => {
    const userId = socketManger.getUserId(socket.id);
    if (userId) {
      socketManger.remove(userId);
    }
  });
}
