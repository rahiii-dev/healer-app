class UserSocketManager {
    constructor() {
        this.activeSockets = new Map(); 
        // this.redisClient = null; 
    }

    // setRedisClient(redisClient) {
        // this.redisClient = null;
    // }

    add(userId, socketId) {
        this.activeSockets.set(userId, socketId);

        // if (this.redisClient) {
        //     this.redisClient.set(`user:${userId}:socket`, socketId, 'EX', 3600); // expires in 1 hour
        // }
    }

    remove(userId) {
        this.activeSockets.delete(userId);

        // if (this.redisClient) {
        //     this.redisClient.del(`user:${userId}:socket`);
        // }
    }

    get(userId) {
        let socketId = this.activeSockets.get(userId);

        // if (!socketId && this.redisClient) {
        //     this.redisClient.get(`user:${userId}:socket`, (err, result) => {
        //         if (result) {
        //             socketId = result;
        //         }
        //     });
        // }

        return socketId;
    }

    getUserId(socketId) {
        return [...this.activeSockets].find(([_, id]) => id === socketId)?.[0];
    }

    isUserOnline(userId) {
        return this.activeSockets.has(userId);
    }
}

export default UserSocketManager;