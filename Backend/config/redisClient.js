import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Create and connect the Redis client
const client = createClient({
    url: process.env.REDIS_URL, // Use environment variable
    socket: {
        tls: true, // Required for Upstash
        rejectUnauthorized: false,
    },
});

client.on('error', (err) => console.error('Redis Client Error:', err));

(async () => {
    try {
        await client.connect();
        console.log('Connected to Redis!');
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
})();

export default client;

