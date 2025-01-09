import { swap0x } from "../../services/0x";

export async function swap(address: string, sellTokens: Array<string>, buyTokens: Array<string>, chainId: number) {
    //structure swap -> how to structure swap?? -> swap needs time (for smart swaps), it needs chain and the necessary tokens to and from, i also need the swap api for whatever chain im using (initially l2 optimism? polygon? arb?)
    //test calling optimism for now
    //await swap0x(address, sellTokens, buyTokens, chainId, "")
    //afterwards send back to front end 
    if (buyTokens.length == 1) {
        //call
    }
}