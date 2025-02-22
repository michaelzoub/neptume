import { connectToDatabase } from "../services/mongo";

export async function userPayment(address: string) {
    //creates a user account and 
    const { db } = await connectToDatabase();
    const collection = db.collection("users");
    const user = await collection.findOne({ wallet: address });
}
