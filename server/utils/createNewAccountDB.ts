import { connectToDatabase } from "../services/mongo";
import { userPayment } from "./userpayment";

export async function createNewAccountDB(address: string): Promise<boolean> {
    try {
        const { db } = await connectToDatabase()
        const collection = db.collection("users")
        const user = await collection.findOne( { address: address } )
        console.log(user);
        if (!user) {
            //create object
            await collection.insertOne(
                { address: address, subscription: false, uses: 10, subscriptionExpiry: "" }
            )
        }
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}