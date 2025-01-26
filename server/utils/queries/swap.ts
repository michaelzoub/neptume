import { config as dotenv } from "dotenv"
import { getTokenHolding } from "../getTokenHolding"
dotenv()
const { ETHERSCAN_API } = process.env

const returnObject = {
    buyArrayAbi: [""],
    sellArrayAbi: [""],
    from: [""],
    to: [""]
}
async function changeNameToAddress(sellTokens: Array<string>, buyTokens: Array<string>, address: string) {
    const tokenHoldings = await getTokenHolding(address)
    const sellArray = sellTokens.flatMap((name) => {
        return tokenHoldings.filter((e) => (e.symbol.toLowerCase() || e.name.toLowerCase()) === name.toLowerCase())
        .map((e) => e.token_address)
    })
    const buyArray = buyTokens.flatMap((name) => {
        return tokenHoldings.filter((e) => (e.symbol.toLowerCase() || e.name.toLowerCase()) === name.toLowerCase())
        .map((e) => e.token_address)
    })
    return {
        sellArray: sellArray,
        buyArray: buyArray
    }
}

export async function swap(address: string, sellTokens: Array<string>, buyTokens: Array<string>, chainId: number) {
    //structure swap -> how to structure swap?? -> swap needs time (for smart swaps), it needs chain and the necessary tokens to and from, i also need the swap api for whatever chain im using (initially l2 optimism? polygon? arb?)
    //test calling optimism for now
    //await swap0x(address, sellTokens, buyTokens, chainId, "")
    //afterwards send back to front end 
    const checkIfAddress: boolean = sellTokens.includes("0x") && buyTokens.includes("0x")
    !checkIfAddress ? await getTokenHolding(address) : console.log("Not contract address")
    //call function to cross check sellTokens and buyTokens with tokenHoldings 
    if (!checkIfAddress) {
        const newTokenObject = await changeNameToAddress(sellTokens, buyTokens, address)
        sellTokens = newTokenObject.sellArray
        buyTokens = newTokenObject.buyArray
        returnObject.from = sellTokens
        returnObject.to = buyTokens
    }
    if (buyTokens.length > 1 && sellTokens.length > 1) {
        //call uniswap and send info to frontend to interact with provider

        for (const token of buyTokens) {
        }
        for (const token of sellTokens) {
        }    
        return returnObject
    } else if (buyTokens.length > 1) {
        for (const token of buyTokens) {
        }
        return returnObject
    } else if (sellTokens.length > 1) {
        for (const token of sellTokens) {
        }    
        return returnObject
    } else {
        //only one address on both sides
        return returnObject
    }
}