import { atom } from "jotai"
import { Message } from "../interfaces/Message"

export const messageAtom = atom("")
export const messagesAtom = atom<Message[]>([])