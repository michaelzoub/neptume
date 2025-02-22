import OpenAI from "openai";
import { config as dotenv } from "dotenv"
dotenv()
const { NEXT_PUBLIC_OPENAI_API } = process.env
const { DEEPSEEK_API_KEY } = process.env

const openai = new OpenAI({
    apiKey: NEXT_PUBLIC_OPENAI_API,
    dangerouslyAllowBrowser: true
});

const deepseek = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: DEEPSEEK_API_KEY
});

export async function sendInitMsg(message: string, contextInfo: string) {

    //const isTransaction = /\b(0x[a-fA-F0-9]{40})\b|\b(\d+(\.\d+)?\s*(ETH|WETH|BTC))\b/.test(message)
  
    if (/*isTransaction ||*/message.includes(contextInfo)) {
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
                  4. "transaction" for requests to send cryptocurrency to one or more accounts, containing a valid amount and wallet address.
                  5. "subscription": For any requests to subscribe to the service (e.g., monthly payment subscriptions).`
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
    const validTypes = ["question", "swap", "modification", "transaction"];
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

// Updated swapCallFrom prompt
export async function swapCallFrom(message: string) {
    const res = await deepseek.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `STRICT FORMATTING: Identify tokens to swap FROM (contract address OR symbol). 
                Respond ONLY as: ["0x...","symbol"] or ["eth"] or ["No tokens found"]. 
                Example valid responses: 
                - ["eth"] 
                - ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "op"] 
                - ["No tokens found"]`
            },
            { role: "user", content: message }
        ],
        model: "deepseek-chat",
        temperature: 0.1,  // Add slight temperature for better accuracy
        max_tokens: 65
    });
    return res?.choices[0].message.content || "[]";
}

// swapCallTo.ts
export async function swapCallTo(message: string) {
    const res = await deepseek.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `EXCLUSIVE RESPONSE FORMAT: ["to_token"]
                - Token must be contract address (0x...) or symbol (USDC)
                - Example valid responses:
                  ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]
                  ["USDC"]
                  ["eth"]
                - Invalid responses will break the system
                - Query: "${message}"`
            },
            {
                role: "user",
                content: "ONLY respond with the JSON array. NO OTHER TEXT."
            }
        ],
        model: "deepseek-chat",
        temperature: 0,
        max_tokens: 25
    });

    const raw = res?.choices[0].message.content || "";
    console.log("Raw swapCallTo response:", raw); // Debug logging
    return raw;
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

export async function modificationType(message: string) {
    //https://docs.metamask.io/wallet/reference/json-rpc-methods/wallet_watchasset/
    const res = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `Your goal is to identify the type of modification the user is asking for. There can be "changenetwork", "switchaccount" or "addtoken".`
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