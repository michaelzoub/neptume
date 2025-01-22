import { createClientV2 } from '@0x/swap-ts-sdk';

export async function ZeroSwapTest() {
    const apiKey: string = process.env.ZERO_EX_API_KEY
    const client = createClientV2({
        apiKey: apiKey,
    });
    
    const price = await client.swap.permit2.getPrice.query({
        buyToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        chainId: 1,
        sellAmount: '1000000000000000000',
        sellToken: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    });
}