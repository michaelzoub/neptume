import { getDefaultStore } from "jotai";
import { address, chainId, connected, wallet } from "../atoms/walletinfo";

export function connectWalletFunc(walleth: any) {
    const store = getDefaultStore()

    const addressGet = walleth.address
    const chainIdGet = Number(walleth.chainId.split(":")[1])

    console.log(chainIdGet)
    console.log(addressGet)

    const connectedState = store.get(connected)
    store.set(wallet, walleth)
    store.set(address, addressGet)
    store.set(chainId, chainIdGet)
    store.set(connected, true)
}