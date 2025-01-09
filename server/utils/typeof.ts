import { sendSecondMsg, swapCall, sendTransactionValue, sendTransactionAddress } from "../services/openai"
import { swap } from "./queries/swap"
import { modify } from "./queries/modify"
import { question } from "./queries/question"
import { sendTransaction } from "./queries/sendTransaction"
import { questionResponse } from "../services/openai"
import { chainIds, chains } from "../data/chains"
import { coingeckoGetPrice } from "../services/coingeckoprice"
//RETURNS THE DATA STRUCTURE

const parties = {
    swap: false,
    from: [""],
    to: [""],
    amount: 0
}

const object = {
    type: "",
    result: true,
    message: "",
    parties: parties
}


//for sendTransaction
const sendTxObject = {
    abi: null,
    ca: "",
    chainId: 1,
    wei: 0
}

const returnObject = {
    type: "sendTransaction",
    result: true,
    message: sendTxObject,
    parties: parties
}

export async function type(aiResponse: string, address: string, originalQuery: string, chainId: number) {
    
    if (!chainIds.has(chainId)) {
        console.log("No chain ID hit, this is the current chainId:", chainId)
        object.type = "chain"
        return object
    }
    
    if (aiResponse == "swap") {
        //interact with walletsdk
        object.parties.swap = true
        //to determine the coins the ai needs to swap from and to, we need a smart way to check user's wallet address tx and determine queries
        const swapStructure = await swapCall(originalQuery)
        //parse : from:, to:
        const from = [""]
        const to = [""]
        //parse (string object to normal object)
        object.message = await sendSecondMsg(aiResponse, swapStructure)
        await swap(address, from, to, chainId)
    } else if (aiResponse == "question") {
        console.log("Question hit")
        //interact with chain (add wallet address to function)
        const additionalInfo = await question(originalQuery, address, chainId)
        console.log("Additional info: ", additionalInfo)

        //fetch current price:
        const price = await coingeckoGetPrice()
        console.log("Current price: ", price)

        object.message = await questionResponse(originalQuery, aiResponse, additionalInfo, price)
        console.log(object)
    } else if (aiResponse == "modification") {
        //use walletsdk to modify network settings and so on
        object.message = await sendSecondMsg(aiResponse, "")
        await modify()
    } else if (aiResponse = "transaction") { 
        //extract one or multiple addresses. i should also have value extracted somehow 
        //exception for sendTransaction, we need to send back a different data object
        const body = await sendTransaction(originalQuery, address)
        const price = await coingeckoGetPrice()
        const value = await sendTransactionValue(originalQuery, price)
        console.log("sendTransactionValue return: ", value)
        const wei = Number(value) * 1000000000000000000

        const to = await sendTransactionAddress(originalQuery)

        sendTxObject.abi = body.abi
        sendTxObject.ca = body.destination
        if (!wei) {
            sendTxObject.wei = 1
        } else {
            sendTxObject.wei = wei
        }
        sendTxObject.chainId = chainId
        parties.to[0] = to

        return returnObject
    } else {
        object.type = "Error"
        object.result = false
    }
    object.type = aiResponse
    return object
}