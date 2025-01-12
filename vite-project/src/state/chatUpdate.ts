import { getDefaultStore } from "jotai";
import { POST } from "../api/server";
import { messagesAtom } from "../atoms/messages";
import { Query } from "../interfaces/Query";
import { Message } from "../interfaces/Message";
import { checkIfName } from "../utils/checkIfName";

export async function chatUpdate(query: Query) {
    const store = getDefaultStore();
    const ifNameQuery = checkIfName(query)
    const response: Message = await POST(ifNameQuery);

    if (response) {
        const currentMessages = store.get(messagesAtom);
        console.log(response)
        store.set(messagesAtom, [...currentMessages, response]);
    } else {
        console.error("Received invalid response from POST.");
    }
    return response
}