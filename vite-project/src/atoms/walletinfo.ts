import { atom } from "jotai"
import { ConnectedWallet } from "../interfaces/Wallet"

export const address = atom("")
export const chainId = atom(1)
export const connected = atom(false)

export const wallet = atom<ConnectedWallet[] | null>(null)