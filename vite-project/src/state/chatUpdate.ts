import { getDefaultStore } from "jotai";
import { POST } from "../api/server";
import { messagesAtom } from "../atoms/messages";
import { Query } from "../interfaces/Query";
import { Message } from "../interfaces/Message";

export async function chatUpdate(query: Query) {
    const store = getDefaultStore();
    const response: Message = await POST(query);

    if (response) {
        const currentMessages = store.get(messagesAtom);
        console.log(response)
        store.set(messagesAtom, [...currentMessages, response]);
    } else {
        console.error("Received invalid response from POST.");
    }
    return response
}