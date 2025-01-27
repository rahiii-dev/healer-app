import UserModal from "../../models/UserModal.js";
import { BaseController } from "./baseController.js";

export class CallController extends BaseController {
  constructor(socket, userSocketManager) {
    super(socket, userSocketManager);
  }

  async startCall({ from, to }) {
    const toSocketId = this.userSocketManager.get(to);

    if (toSocketId) {
      const sender = await UserModal.findById(from).populate("profile");
      if (sender) {
        this.socket.to(toSocketId).emit("incoming-call", {
          from: {
            userId: from,
            name: sender.profile.name,
            image: sender.image,
          },
          message: "You have an incoming call.",
        });
      }
    } else {
      this.socket.emit("error", { message: `User ${to} is not available.` });
    }
  }

  async acceptCall({ from, to }) {
    const fromSocketId = this.userSocketManager.get(from);
    const toSocketId = this.userSocketManager.get(to);

    if (fromSocketId && toSocketId) {
      this.socket.to(fromSocketId).emit("call-accepted", { to });
      this.socket.emit("call-accepted", { from });
    } else {
      this.socket.emit("error", {
        message: "Call participants not available.",
      });
    }
  }

  async endCall({ from, to }) {
    const fromSocketId = this.userSocketManager.get(from);
    const toSocketId = this.userSocketManager.get(to);

    if (fromSocketId && toSocketId) {
      this.socket.to(fromSocketId).emit("call-ended", { to });
      this.socket.emit("call-ended", { from });
    } else {
      this.socket.emit("error", {
        message: "Call participants not available.",
      });
    }
  }
  
}
