import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: process.env.REDIS_HOST_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: 15418
    }
});

client.on('error', err => console.log('Redis Client Error', err));

export const  connectRedis = async () => {
    try {
        await client.connect();
        console.log("Redis connected");
        
    } catch (error) {
        console.error("Failed to connect to redis");
    }
}


export default client;

