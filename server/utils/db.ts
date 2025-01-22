import { connectToDatabase } from "../services/mongo";
import { userPayment } from "./userpayment";

export async function checkDB(address: string) {
    try {
        const { db } = await connectToDatabase()
        const collection = db.collection("users")
        const user = await collection.findOne( { address: address } )
        if (!user) {
            //create object
            await collection.insert(
                { address: address, subscribed: false, uses: 10, subscriptionExpiry: "" }
            )
        }
        const uses = user.uses
        const subscriptionState = user.subcribed
        //perform logic wherever it returns true
        if (!subscriptionState && (uses <= 10)) {
            user.updateOne( { $inc: { uses } } )
            return true
        } else if (!subscriptionState) {
            return false
        } else if (subscriptionState) {
            return true
        }
        return false
    } catch (error) {
        console.error(error)
        return false
    }
}