import { createClient } from 'redis';
import { config as dotenv } from "dotenv"
dotenv()
const { REDIS } = process.env

const client = createClient({
    username: 'default',
    password: (REDIS || ""),
    socket: {
        host: 'redis-12672.c93.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 12672
    }
});

client.on('error', (err: any) => console.log('Redis Client Error', err));

await client.connect();

export async function createNewStore(address:string) {
    await client.set(address, 0);
}