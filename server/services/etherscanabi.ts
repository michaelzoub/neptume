//etherscan api interaction to fetch ABI
import { config as dotenv } from "dotenv"
dotenv()
const {ETHERSCAN_API} = process.env

async function foreachfetch(e: string) {
    const response = await fetch(`https://api.etherscan.io/api
        ?module=contract
        &action=getabi
        &address=${e}
        &apikey=${ETHERSCAN_API}`)
        console.log(response)
    const body = await response.json()
    return body.result
}

export async function abi(contractAddresses: Array<string>): Promise<Array<any>> {
    const abiSet:any = []
    try {
        const abis = await Promise.all(contractAddresses.map((e) => foreachfetch(e)));

        abis.forEach((abi) => abiSet.push(abi));

        return abiSet
    } catch (error) {
        console.error(error)
        return abiSet
    }
}