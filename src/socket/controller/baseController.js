export class BaseController {
    socket;
    userSocketManager;
    constructor(socket, userSocketManager) {
        if (!socket) throw new Error("Socket is required");
        if (!userSocketManager) throw new Error("UserSocketManager is required");
        this.socket = socket;
        this.userSocketManager = userSocketManager;
    }
}