import { connectToDatabase } from "../services/mongo";

export async function userPayment() {
    const { db } = await connectToDatabase();
    const collection = db.collection("neptume");
}
