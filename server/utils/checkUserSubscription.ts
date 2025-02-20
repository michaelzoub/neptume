import { createClient } from 'redis';
import { config as dotenv } from "dotenv"
dotenv()
const { REDIS } = process.env
import { createNewStore } from './createNewStore';

//i dont even know why im using redis, probably switch over to mongodb and cache with bunjs built in
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

export async function checkUserSubscription(address: string): Promise<boolean> {
    //first check if address exists
    //specific name for address stores:
    const addressPlusName = `${address}subscription`
    const key = await client.get(addressPlusName);
    if (!key) {
        await createNewStore(address)
        return false
    }
    //const attempts = client.get(key || "") <- ??
    if (key == "unsubscribed") {
        return false
    } else if (key == "subscribed") {
        return true
    } else {
        return false
    }
}
