import { connectToDatabase } from "../services/mongo";

export async function checkDB(address: string) {
    try {
        const { db } = await connectToDatabase()
        const collection = db.collection("users")
        const user = await collection.findOne( { address: address } )
        const uses = user.uses
        const subscriptionState = user.subcribed
        if (subscriptionState && (uses <= 3)) {
            user.updateOne( { $inc: { uses } } )
        }
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}