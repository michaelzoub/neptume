import { Query } from "../interfaces/Query"
import { initialState } from "./storeAddressContext"
import { userContext } from "../types/userContext"


export function checkIfName(query: Query) {
    let message = query.message
    let context
    const array = initialState()
    array.forEach((e: userContext) => {
        const nameRegex = new RegExp(e.name, "gi"); 
        if (nameRegex.test(message)) {
            message = message.replace(nameRegex, e.address); 
            context = e.name.toLowerCase();
        }
    })
    query.message = message
    query.contextInfo = context
    return query
}