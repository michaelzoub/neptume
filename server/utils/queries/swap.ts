import { config as dotenv } from "dotenv"
import { getTokenHolding } from "../getTokenHolding"
dotenv()
const { ETHERSCAN_API } = process.env

const returnObject = {
    buyArrayAbi: [""],
    sellArrayAbi: [""]
}

async function fetchAbi(address: string) {
    const response = await fetch(`https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_API}`)
        const body = await response.json()
        return body.result
}

async function returnOneAbiInArray(tokensArray: string[]) {
    return await fetchAbi(tokensArray[0])
}

async function changeNameToAddress(sellTokens: Array<string>, buyTokens: Array<string>, address: string) {
    const tokenHoldings = await getTokenHolding(address)
    const sellArray = sellTokens.flatMap((name) => {
        return tokenHoldings.filter((e) => e.symbol.toLowerCase() === name.toLowerCase())
        .map((e) => e.token_address)
    })
    const buyArray = buyTokens.flatMap((name) => {
        return tokenHoldings.filter((e) => e.symbol.toLowerCase() === name.toLowerCase())
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
    }
    if (buyTokens.length > 1 && sellTokens.length > 1) {
        //call uniswap and send info to frontend to interact with provider
        const abiBuyArray = []
        const abiSellArray = []
        for (const token of buyTokens) {
            abiBuyArray.push(await fetchAbi(token))
        }
        for (const token of sellTokens) {
            abiSellArray.push(await fetchAbi(token))
        }    
        returnObject.buyArrayAbi = abiBuyArray
        returnObject.sellArrayAbi = abiSellArray
        return returnObject
    } else if (buyTokens.length > 1) {
        const abiBuyArray = []
        for (const token of buyTokens) {
            abiBuyArray.push(await fetchAbi(token))
        }
        returnObject.buyArrayAbi = abiBuyArray
        returnObject.sellArrayAbi = await returnOneAbiInArray(sellTokens)
        return returnObject
    } else if (sellTokens.length > 1) {
        const abiSellArray = []
        for (const token of sellTokens) {
            abiSellArray.push(await fetchAbi(token))
        }    
        returnObject.sellArrayAbi = abiSellArray
        returnObject.buyArrayAbi = await returnOneAbiInArray(buyTokens)
        return returnObject
    } else {
        
        return returnObject
    }
}