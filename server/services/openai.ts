import OpenAI from "openai";
import { config as dotenv } from "dotenv"
dotenv()
const { NEXT_PUBLIC_OPENAI_API } = process.env

const openai = new OpenAI({
    apiKey: NEXT_PUBLIC_OPENAI_API,
    dangerouslyAllowBrowser: true
});

export async function sendInitMsg(message: string, contextInfo: string) {

    const isTransaction = /\b(0x[a-fA-F0-9]{40})\b|\b(\d+(\.\d+)?\s*(ETH|WETH|BTC))\b/.test(message)
  
    if (isTransaction || message.includes(contextInfo)) {
      return "transaction";
    }

    const res = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are a crypto wallet assistant. Your task is to classify user queries into one of these categories:
                  1. "question" for queries asking for information (balances, prices, transaction history, etc.)
                  2. "swap" for requests to exchange one cryptocurrency for another.
                  3. "modification" for requests to change wallet settings or network configurations.
                  4. "transaction" for requests to send cryptocurrency to one or more accounts, containing a valid amount and wallet address.`
            },
            {
                role: "user",
                content: message
            }
        ],
        model: "gpt-4o-mini-2024-07-18",
        temperature: 0,
        max_tokens: 15
    });
    
    const content = res?.choices[0].message.content?.toLowerCase().trim() || "";
    const validTypes = ["question", "swap", "modification"];
    return validTypes.includes(content) ? content : "question"; 
}

export async function sendSecondMsg(message: string, additionalInfo: string) {
    const res = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `A type of query is sent to you, (sometimes there's additional information sometimes it's solely one word), you must answer as if you're working on the user's query. There are 3 types of request: swap, modification or question. ${additionalInfo}`
            },
            {
                role: "user",
                content: message
            }
        ],
        model: "gpt-4o-mini-2024-07-18",
        max_tokens: 65
    });
    return res?.choices[0].message.content || "";
}

export async function swapCall(message: string) {
    const res = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `Classify the tokens mentioned in the user's query into "from" (tokens to sell) and "to" (tokens to buy). Respond in the format(OBJECT): "from: ["1", "2"], to: ["1"]" or "No tokens found." Provide only the classification.`
            },
            {
                role: "user",
                content: message
            }
        ],
        model: "gpt-4o-mini-2024-07-18",
        max_tokens: 65
    });
    return res?.choices[0].message.content || "";
}

export async function questionCall(message: string) {
    const res = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `Classify the query into one of these types: balance, token, NFT, transaction, gas, block, tokenTransfers, pendingTransactions, contractMetadata, tokenHolders, networkStatus, whatChain, totalbalance, history, price, staking. Respond only with the query type (lower case).`
            },
            {
                role: "user",
                content: message
            }
        ],
        model: "gpt-4o-mini-2024-07-18",
        max_tokens: 10
    });
    return res?.choices[0].message.content || "";
}

export async function questionResponse(message: string, type: string, json: any, ethPrice: string) {
    const res = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are a crypto assistant providing concise, accurate responses based on wallet data. 

Format the data based on the query type:

For balance queries:
- Show amounts with 4 decimal places max
- Include token symbols (ETH, USDC, etc.)
- Convert to USD when possible
- Example: "Your ETH balance is 1.2345"

For transaction queries:
- Focus on the most recent/relevant transactions
- Include key details: amount, token, time
- Example: "Last transaction: Sent 0.5 ETH 2 hours ago"

For price queries:
- Show current price with 2 decimal places
- Include 24h change percentage
- Example: "ETH price: ${ethPrice}"

For NFT queries:
Show NFTs user owns (by name in json)
Depending on question you can also show the total count: ${json.totalCount}

Current Ethereum price: ${ethPrice}
Original query: "${message}"
Query type: "${type}"
Wallet data: ${type == "nft" ? "" : JSON.stringify(json, null, 2)}

Provide a single, clear sentence response focusing only on the requested information.`
            }
        ],
        model: "gpt-4o-mini-2024-07-18",
        temperature: 0.3, 
        max_tokens: 350,
        presence_penalty: -0.2, 
        frequency_penalty: 0.3  
    });
    
    const content = res?.choices[0].message.content?.trim() || "I cannot retrieve that information at the moment.";
    return content;
}

export async function sendTransactionValue(message: string, ethPrice: string) {
    const res = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are a helpful assistant. Extract the ETH value from the user message and perform the necessary calculations based on the given Ethereum price. Only return the calculated ETH value without any additional text or explanation.
                
                Current Ethereum price: ${ethPrice}`
            },
            {
                role: "user",
                content: message
            }
        ],
        model: "gpt-4o-mini-2024-07-18",
        max_tokens: 10
    });
    return res?.choices[0].message.content || "";
}

export async function sendTransactionCA(message: string, tokenList: any) {
    const res = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are a specialized assistant trained to analyze transaction messages and identify the token being sent. Only return the token name, symbol, or contract address, or respond with "No token identified" if no relevant token information is found.
                
                Here's a list of possible token names the user has: ${tokenList}.`
            },
            {
                role: "user",
                content: message
            }
        ],
        model: "gpt-4o-mini-2024-07-18",
        max_tokens: 36
    });
    return res?.choices[0].message.content || "";
}

export async function sendTransactionAddress(message: string) {
    const res = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `Your goal is to identify the address we are sending money to. Only respond with the address, with no additional text or information. If no address is found, respond with nothing.`
            },
            {
                role: "user",
                content: message
            }
        ],
        model: "gpt-4o-mini-2024-07-18",
        max_tokens: 36
    });
    return res?.choices[0].message.content || "";
}
