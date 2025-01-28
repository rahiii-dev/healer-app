import { CallController } from "./controller/CallController.js";
import { MessageController } from "./controller/MessageController.js";
import { TypingController } from "./controller/TypingController.js";
import UserSocketManager from "./socketManager.js";

export const activeUsers = new Map();

const socketManger = new UserSocketManager();

export function socket(socket) {
  const messageController = new MessageController(socket, socketManger);
  const typingController = new TypingController(socket, socketManger);
  const callController = new CallController(socket, socketManger);

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

  socket.on("start-call", async (data) => {
    await callController.startCall(data);
  });

  socket.on("accept-call", async (data) => {
    await callController.acceptCall(data);
  });

  socket.on("end-call", async (data) => {
    await callController.endCall(data);
  });

  socket.on("disconnect", async () => {
    const userId = socketManger.getUserId(socket.id);
    if (userId) {
      socketManger.remove(userId);
    }
  });
}
