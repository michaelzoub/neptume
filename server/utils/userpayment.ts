import { connectToDatabase } from "../services/mongo";

export async function userPayment() {
    //creates a user account and 
    const { db } = await connectToDatabase();
    const collection = db.collection("neptume");
}
