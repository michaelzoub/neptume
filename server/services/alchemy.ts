
import { config as dotenv } from "dotenv"
dotenv()

const { MORALIS_API } = process.env
const { ALCHEMY_API } = process.env
import { chains } from "../data/chains"
import { extractTxHash } from "../utils/extracthash"
//https://docs.alchemy.com/reference/alchemy-getassettransfers

function getChainName(chainId: number): string | undefined {
    switch (chainId) {
        case chains.arbitrum:
            return "arb-mainnet";
        case chains.avalanche:
            return "avalanche";
        case chains.base:
            return "base-mainnet";
        case chains.optimism:
            return "opt-mainnet";
        case chains.polygon:
            return "polygon-mainnet";
        case chains.worldchain:
            return "worldchain";
        case chains.ethereum:
            return "eth-mainnet"
        default:
            console.error("Unknown chain ID:", chainId);
            return undefined;
    }
}

export async function alchemyQuery(type: string, message: string, address: string, chainId: number) {

    const chain = getChainName(chainId)

    const headers = {
        'Content-Type': 'application/json',
    }

    const params: {
        jsonrpc: string;
        id: number;
        method: string;
        params: any[]; 
    } = {
        jsonrpc: "2.0",
        id: 1,
        method: "",
        params: [], 
    }

    const ALCHEMY_API_URL = `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API}`

    switch (type) {
        case "balance":
            const response = await fetch(`https://deep-index.moralis.io/api/v2.2/wallets/${address}/net-worth?exclude_spam=true&exclude_unverified_contracts=true`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-API-Key': MORALIS_API    
                } as HeadersInit 
            })
            const body = await response.json()
            console.log(body)
            return body
        
        case "totalbalance":
            const responseTB = await fetch(`https://deep-index.moralis.io/api/v2.2/wallets/${address}/net-worth?exclude_spam=true&exclude_unverified_contracts=true`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-API-Key': MORALIS_API    
                } as HeadersInit 
            })
            const bodyTB = await responseTB.json()
            console.log(bodyTB)
            return bodyTB

        case "token":
            console.log("Fetching token details...");
            params.method = "alchemy_getTokenMetadata";
            params.params = [address];
            const tokenResponse = await fetch(ALCHEMY_API_URL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(params),
            })
            const tokenData = await tokenResponse.json();
            console.log(`Token details for ${message}:`, tokenData.result);
            return tokenData.result;

        case "nft":
            //https://eth-mainnet.g.alchemy.com/nft/v3/docs-demo/getNFTsForOwner?owner=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045&withMetadata=true&pageSize=100
            console.log("Fetching NFT details...");
            params.method = "alchemy_getNFTsForOwner";
            params.params = [address]
            const nftResponse = await fetch(`https://${chain}.g.alchemy.com/nft/v3/${ALCHEMY_API}/getNFTsForOwner?owner=${address}&withMetadata=true&includeFilters[]=SPAM&spamConfidenceLevel=HIGH&pageSize=100`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                },
            });
            console.log("NFT response:", nftResponse)
            const nftData = await nftResponse.json()
            console.log(`NFT details for owner ${message}:`, nftData)
            return nftData.result

        case "transaction":
            console.log("Fetching transaction details...")
            const hash = extractTxHash(message)
            console.log("Hash: ", hash)
            const transactionResponse = await fetch(`https://deep-index.moralis.io/api/v2.2/transaction/${hash}?chain=eth`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-API-Key': MORALIS_API    
                } as HeadersInit 
            })
            console.log(transactionResponse)
            const transactionData = await transactionResponse.json()
            console.log(`Transaction details for hash ${message}:`, transactionData)
            return transactionData

        case "gas":
            console.log("Fetching gas details...")
            params.method = "eth_gasPrice"
            const gasResponse = await fetch(ALCHEMY_API_URL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(params),
            })
            const gasData = await gasResponse.json()
            console.log(`Current gas price:`, gasData.result)
            return gasData.result

            case "block":
                console.log("Fetching block details...")
                params.method = "eth_getBlockByNumber"
                params.params = ["latest", true]
                const blockResponse = await fetch(ALCHEMY_API_URL, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(params),
                })
                const blockData = await blockResponse.json()
                return blockData.result
        
            case "tokenTransfers":
                console.log("Fetching token transfers...")
                params.method = "alchemy_getAssetTransfers"
                params.params = [{
                    fromBlock: "0x0",
                    toBlock: "latest",
                    fromAddress: address,
                    category: ["external", "internal", "erc20", "erc721", "erc1155"]
                }]
                const transfersResponse = await fetch(ALCHEMY_API_URL, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(params),
                })
                const transfersData = await transfersResponse.json()
                return transfersData.result
        
            case "pendingTransactions":
                console.log("Fetching pending transactions...")
                params.method = "eth_getBlockByNumber"
                params.params = ["pending", true]
                const pendingResponse = await fetch(ALCHEMY_API_URL, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(params),
                })
                const pendingData = await pendingResponse.json()
                return pendingData.result
        
            case "contractMetadata":
                console.log("Fetching contract metadata...")
                params.method = "alchemy_getContractMetadata"
                params.params = [address]
                const contractResponse = await fetch(ALCHEMY_API_URL, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(params),
                })
                const contractData = await contractResponse.json()
                return contractData.result
        
            case "tokenHolders":
                console.log("Fetching token holders...")
                params.method = "alchemy_getTokenBalances"
                params.params = [address, "erc20"]
                const holdersResponse = await fetch(ALCHEMY_API_URL, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(params),
                })
                const holdersData = await holdersResponse.json()
                return holdersData.result
        
            case "networkStatus":
                console.log("Fetching network status...")
                params.method = "eth_syncing"
                const statusResponse = await fetch(ALCHEMY_API_URL, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(params),
                })
                const statusData = await statusResponse.json()
                return statusData.result

            case "whatChain":
                return chainId;

            case "history":
                console.log("Fetching transaction history...");
                const historyResponse = await fetch(`https://deep-index.moralis.io/api/v2.2/wallets/${address}/history?chain=eth&order=DESC`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'X-API-Key': MORALIS_API
                    } as HeadersInit
                });
                const historyData = await historyResponse.json();
                console.log(`Transaction history:`, historyData);
                return historyData;

            case "price":
                console.log("Fetching token price...");
                const token = extractTxHash(message);
                const priceResponse = await fetch(`https://pro-api.coingecko.com/api/v3/onchain/simple/networks/${chainId}/token_price/${token}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    } as HeadersInit
                });
                const priceData = await priceResponse.json();
                console.log(`Price for ${token}:`, priceData);
                return priceData;

            case "staking":
                console.log("Fetching staking details...");
                const stakingResponse = await fetch(`https://api.llama.fi/yields/user/${address}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    } as HeadersInit
                });
                const stakingData = await stakingResponse.json();
                console.log(`Staking details:`, stakingData);
                return stakingData;         

        default:
            console.error(`Unknown type: ${type}`)
            throw new Error(`Unknown query type: ${type}`)
    }
}