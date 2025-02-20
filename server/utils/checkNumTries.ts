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
    const key = await client.get(address);
    if (!key) {
        //sets number of tries
        await createNewStore(address)
    }
    const attempts = client.get(key || "")
    if (Number(attempts) <= 10) {
        //create new store
        let incr = Number(attempts);
        await client.set(address, ++incr)
        return true
    } else {
        return false
    }
}

