import { config as dotenv } from "dotenv"
dotenv()
const {ALCHEMY_API} = process.env

export async function getTokenMetadata(ca: string) {
    const response = await fetch(`https://{network}.g.alchemy.com/v2/${ALCHEMY_API}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: 1,
            jsonrpc: 2.0,
            method: "alchemy_getTokenMetadata",
            params: [ca]
        })
    })
    const body = await response.json()

    return body.result
}