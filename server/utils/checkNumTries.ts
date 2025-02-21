import { createClient } from 'redis';
import { config as dotenv } from "dotenv"
dotenv()
const { REDIS } = process.env
import { createNewStore } from './createNewStore';

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

export async function checkNumTries(address: string): Promise<boolean> {
    //first check if address exists
    let attempts = await client.get(address);
    if (attempts === null) {
        //create new store
        await createNewStore(address)
        attempts = "0"
    }
    if (Number(attempts) <= 10) {
        //let incr = Number(attempts);
        await client.incr(address);
        return true
    } else {
        return false
    }
}

