import { config as dotenv } from "dotenv"
dotenv()
const { ETHERSCAN_API } = process.env

const returnObject = {
    buyArrayAbi: [""],
    sellArrayAbi: [""]
}

async function fetchAbi(address: string) {
    const response = await fetch(`https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_API}`)
        const body = await response.json()
        return body
}

async function returnOneAbiInArray(tokensArray: string[]) {
    return await fetchAbi(tokensArray[0])
}

export async function swap(address: string, sellTokens: Array<string>, buyTokens: Array<string>, chainId: number) {
    //structure swap -> how to structure swap?? -> swap needs time (for smart swaps), it needs chain and the necessary tokens to and from, i also need the swap api for whatever chain im using (initially l2 optimism? polygon? arb?)
    //test calling optimism for now
    //await swap0x(address, sellTokens, buyTokens, chainId, "")
    //afterwards send back to front end 
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