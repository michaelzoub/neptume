import { sendSecondMsg, swapCallFrom, swapCallTo, sendTransactionValue, sendTransactionAddress } from "../services/openai"
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
    amount: 0,
    abi:  null
}

const object = {
    type: "",
    result: true,
    message: "",
    parties: parties,
    jwt: ""
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
    parties: parties,
    jwt: ""
}

export async function type(aiResponse: string, address: string, originalQuery: string, chainId: number) {
    
    if (!chainIds.has(chainId)) {
        console.log("No chain ID hit, this is the current chainId:", chainId)
        object.type = "chain"
        return object
    }
    
    if (aiResponse == "swap") {
        object.parties.swap = true
        //parse : from:, to:
        const from = JSON.parse(await swapCallFrom(originalQuery) || "['']")
        const to = JSON.parse(await swapCallTo(originalQuery) || "['']")
        const swapStructure = {
            from: from,
            to: to
        }
        const price = await coingeckoGetPrice()
        const value = await sendTransactionValue(originalQuery, price)
        console.log("Received from OpenAI call, here is the value: ", value)
        const wei = Number(value) * 1000000000000000000
        object.message = await sendSecondMsg(aiResponse, JSON.stringify(swapStructure))
        const abi: any = await swap(address, from, to, chainId)
        object.parties.abi = abi
        if (!wei) {
            object.parties.amount = 1
        } else {
            object.parties.amount = wei
        }
        if (abi.from[0] !== "") {
            object.parties.from = abi.from
            object.parties.to = abi.to
        } else {
            object.parties.from = swapStructure.from
            object.parties.to = swapStructure.to
        }
    } else if (aiResponse == "question") {
        console.log("Question hit")
        //interact with chain (add wallet address to function)
        const additionalInfo = await question(originalQuery, address, chainId)
        console.log("Additional info: ", additionalInfo)

        //TO DO IN FUTURE: classify queries by if they need a price or not, then call it (to save ressources)
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