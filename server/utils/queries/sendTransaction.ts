import { extractTxHash } from "../extracthash";
import { config as dotenv } from "dotenv"
dotenv()
const { ETHERSCAN_API } = process.env
const { ALCHEMY_API } = process.env

import { sendTransactionCA } from "../../services/openai";
import { getWalletBalances } from "../getWalletBalances";
import { getTokenMetadata } from "../getTokenMetadata";
import { getTokenHolding } from "../getTokenHolding";

async function fetchAbi(address: string) {
    const response = await fetch(`https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_API}`)
        const body = await response.json()
        return body
}

function tokenArrayNames(tokenBalancesArray: any) {
    const array: string[] = []
    tokenBalancesArray.forEach((e) => {
        array.push(e.symbol)
    })
    return array
}

export async function sendTransaction(message: string, address: string) {

    let abi

    //get name, then get wallet balances (we get token_addresses) and compare:
    //call etherscan api, we then return abi + address
    const tokenBalancesArray = await getTokenHolding(address)
    const tokenNamesArray = tokenArrayNames(tokenBalancesArray)
    const token = await sendTransactionCA(message, tokenNamesArray)
    const sanitizedToken = token.trim().toLowerCase()

    const matchTest = extractTxHash(token)
    if (!matchTest) {
        console.log("This is the token received from AI: ", sanitizedToken)
        //we need the list of all tokens, feed it to AI
        //add each contract address to an array and send to alchemy getTokenMetadata
        //for now i guess i have to call the api forEach -> find a way to make this more optimal
        console.log("Token balances array: ", tokenBalancesArray)
        const matchingToken = tokenBalancesArray.find((e: any) => e.name.toLowerCase() == sanitizedToken || e.symbol.toLowerCase() == sanitizedToken)
        console.log("Matching token: ", matchingToken)
        abi = await fetchAbi(matchingToken.token_address)
    } else {
        abi = await fetchAbi(matchTest)
    }
    console.log("CA: ", sanitizedToken)
    //ca = token's ca

   console.log(abi)

   //this is the abi, we need another data object that goes inside message

   return {
    abi: abi.result,
    destination: token
   }
}