import { alchemyQuery } from "../../services/alchemy";
import { questionCall } from "../../services/openai";


export async function question(message: string, address:string, chainId: number) {
    //ai for type of query
    const type = await questionCall(message)
    console.log("Question type: ", type)
    //interact with wallet or chain and return info
    return alchemyQuery(type, message, address, chainId)
}