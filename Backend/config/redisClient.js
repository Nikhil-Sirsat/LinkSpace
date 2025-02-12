import redis from 'redis';
// Create and connect the Redis client
const client = redis.createClient();

client.on('error', (err) => console.error('Redis Client Error', err));

// Connect to Redis
(async () => {
    try {
        await client.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
})();

export default client;
