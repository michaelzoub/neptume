import { config as dotenv } from "dotenv"
dotenv()

const { ALCHEMY_API } = process.env

export async function getWalletBalances(address: string) {
    const response = await fetch(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            jsonrpc: 2.0,
            method: "alchemy_getTokenBalances",
            params: [address, "erc20"],
            id: 42
        })
    })
    const body = await response.json()

    return body.result.tokenBalances
}