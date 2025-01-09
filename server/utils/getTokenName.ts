import { config as dotenv } from "dotenv"
dotenv()
const { ETHERSCAN_API } = process.env

export async function getTokenName(ca: string) {
    const response = await fetch(`https://api.etherscan.io/api
   ?module=token
   &action=tokeninfo
   &contractaddress=${ca}
   &apikey=${ETHERSCAN_API} `)
   const body = await response.json()
   return body.result.symbol
}