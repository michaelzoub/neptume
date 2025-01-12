import { getContract, Hex, concat, numberToHex, size } from 'viem'

async function fetchQuote(chainId: number, sellToken: string, buyToken: string, sellAmount: number, address: string, wallet: any) {
    const qs = require('qs');

const params = {
    sellToken: sellToken, //WETH
    buyToken: buyToken, //DAI
    sellAmount: sellAmount.toString(), // Note that the WETH token uses 18 decimal places, so `sellAmount` is `100 * 10^18`.
    taker: address, //Address that will make the trade
    chainId: chainId.toString(), // / Ethereum mainnet. See the 0x Cheat Sheet for all supported endpoints: https://0x.org/docs/introduction/0x-cheat-sheet
};

const headers = {
    '0x-api-key': '[api-key]',  // Get your live API key from the 0x Dashboard (https://dashboard.0x.org/apps)
    '0x-version': 'v2',         // Add the version header
};

const response = await fetch(
    `https://api.0x.org/swap/permit2/quote?${qs.stringify(params)}`, { headers }
)
const returned = await response.json()
return returned
}

async function swap0x(chainId: number, sellToken: string, buyToken: string, sellAmount: number, address: string, abi: any) {
    const priceParams = new URLSearchParams({
        chainId: chainId.toString(), // / Ethereum mainnet. See the 0x Cheat Sheet for all supported endpoints: https://0x.org/docs/introduction/0x-cheat-sheet
        sellToken: sellToken, //ETH
        buyToken: buyToken, //DAI
        sellAmount: sellAmount.toString(), // Note that the WETH token uses 18 decimal places, so `sellAmount` is `100 * 10^18`.
        taker: address, //Address that will make the trade
    });
    
    const headers = {
        '0x-api-key': '[api-key]', // Get your live API key from the 0x Dashboard (https://dashboard.0x.org/apps)
        '0x-version': 'v2',
    };
    
    const priceResponse = await fetch('https://api.0x.org/swap/permit2/price?' + priceParams.toString(), { headers });
    
    console.log(await priceResponse.json())

    //then set token allowance:

    const Permit2 = getContract({
        address: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
        abi: exchangeProxyAbi,
        client,
    })
    const usdc = getContract({
        address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        abi: abi,
        client,
    })
    
    // Check allowance is enough for Permit2 to spend sellToken
    if (sellAmount > (await usdc.read.allowance([client.account.address, Permit2.address])))
        try {
            const { request } = await usdc.simulate.approve([Permit2.address, maxUint256]);
            console.log('Approving Permit2 to spend USDC...', request);
            // If not, write approval
            const hash = await usdc.write.approve(request.args);
            console.log('Approved Permit2 to spend USDC.', await client.waitForTransactionReceipt({ hash }));
        } catch (error) {
            console.log('Error approving Permit2:', error);
        }
    else {
        console.log('USDC already approved for Permit2');
    }

    //fetch quote:
    const quote = await fetchQuote(chainId, sellToken, buyToken, sellAmount, address)

    //sign permit with
    let signature: Hex
    signature = await wallet.signTypedData(quote.permit2.eip712);

    //append signature length to transaction data:
    if (Permit2?.eip712) {
        const signature = await wallet.signTypedDataAsync(Permit2.eip712);
        const signatureLengthInHex = numberToHex(size(signature), {
            signed: false,
            size: 32,
        });
        transaction.data = concat([transaction.data, signatureLengthInHex, signature]);
    }

    wallet.sendTransaction({
        account: walletClient?.account.address,
        gas: !!quote?.transaction.gas ? BigInt(quote?.transaction.gas) : undefined,
        to: quote?.transaction.to,
        data: quote?.transaction.data,
        chainId: chainId,
    })
    
}