import { defineBlock } from "viem";
import { connectToDatabase } from "../services/mongo"
import { config as dotenv } from "dotenv"
dotenv()


export async function checkUserSubscription(address: string): Promise<boolean> {
    //first check if address exists
    const { db } = await connectToDatabase();
    const collection = db.collection("users");
    const user = await collection.findOne({ wallet: address });
    //^ this gets the whole object

    if (!user.subscription) {
        return false
    } else if (user.subscription) {
        //logic for jwt tokens
        return true
    } else {
        return false
    }
}
