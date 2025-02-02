class UserSocketManager {
    constructor() {
        this.activeSockets = new Map(); 
        this.redisClient = null; 
    }

    setRedisClient(redisClient) {
        if (redisClient && redisClient.isOpen) {
            this.redisClient = redisClient;
        }
    }

    async add(userId, socketId) {
        if (this.redisClient) {
            await this.redisClient.set(`user:${userId}:socket`, socketId); 
        }
        this.activeSockets.set(userId, socketId);
    }

    async remove(userId) {
        if (this.redisClient) {
            await this.redisClient.del(`user:${userId}:socket`);
        }
        this.activeSockets.delete(userId);
    }

    async get(userId) {
        let socketId = this.activeSockets.get(userId);
        
        if (!socketId && this.redisClient) {
            socketId = await this.redisClient.get(`user:${userId}:socket`);
        }

        return socketId || null; 
    }

    getUserId(socketId) {
        for (const [userId, id] of this.activeSockets.entries()) {
            if (id === socketId) return userId;
        }
        return null;
    }

    isUserOnline(userId) {
        return this.activeSockets.has(userId);
    }
}

export default UserSocketManager;
