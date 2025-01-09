import { config as dotenv } from "dotenv"
dotenv()
const { MORALIS_API } = process.env

export async function getTokenHolding(address: string) {
    const response = await fetch(`https://deep-index.moralis.io/api/v2.2/${address}/erc20?chain=eth`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "X-API-Key": `${MORALIS_API}`
    }
   })
   console.log(response)

   const body = await response.json()
   console.log("getTokenHolding body: ", body)
   return body
}