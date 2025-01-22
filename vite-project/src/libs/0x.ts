import {
  createWalletClient,
  http,
  custom,
  getContract,
  erc20Abi,
  parseUnits,
  maxUint256,
  publicActions,
  concat,
  numberToHex,
  size,
} from "viem";
import type { Hex } from "viem";
import { getEthereumProvider } from "../utils/getEthereumProvider";
import { mainnet, sepolia, arbitrum, avalanche, base, optimism, polygon, worldchain } from 'viem/chains';
import { Chain } from "viem";
const chainConfig = {
    Arbitrum: arbitrum,
    Avalanche: avalanche,
    Base: base,
    Optimism: optimism,
    Polygon: polygon,
    Worldchain: worldchain,
    Ethereum: mainnet,
    EthSepolia: sepolia,
  }
  import { To } from "../interfaces/Message";
  
//TO DO: create single function and implement ABI properly

// load env vars
const ZERO_EX_API_KEY = import.meta.env.ZERO_EX_API_KEY;       // Vite
const ALCHEMY_HTTP_TRANSPORT_URL = import.meta.env.VITE_ALCHEMY_HTTP_TRANSPORT_URL;


// fetch headers
const headers = new Headers({
  "Content-Type": "application/json",
  "0x-api-key": ZERO_EX_API_KEY,
  "0x-version": "v2",
});

// set up contracts

export const main = async (value: string, abi: any, wallets: any, address: string, chainName: string, chainId:number, parties: any) => {

    const receivedBody = await getEthereumProvider(wallets)
    const provider = receivedBody.provider

    //setup wallet client
    const client = createWalletClient({
        chain: sepolia, //temporary chain
        transport: custom(provider),
      })

    const usdc = getContract({
        address: parties.from[0],
        abi: erc20Abi,
        client,
      });
      const weth = getContract({
        address: parties.to[0],
        abi: abi,
        client,
      });

  // specify sell amount
  const sellAmount = parseUnits(value, await usdc.read.decimals());

  // 1. fetch price
  const priceParams = new URLSearchParams({
    chainId: client.chain.id.toString(),
    sellToken: usdc.address,
    buyToken: weth.address,
    sellAmount: sellAmount.toString(),
    taker: address,
  });

  const priceResponse = await fetch(
    "https://api.0x.org/swap/permit2/price?" + priceParams.toString(),
    {
      headers,
    }
  );

  const price = await priceResponse.json();
  console.log("Fetching price to swap ? USDC for WETH");
  console.log(
    `https://api.0x.org/swap/permit2/price?${priceParams.toString()}`
  );
  console.log("priceResponse: ", price);

  // 2. check if taker needs to set an allowance for Permit2

  if (price.issues.allowance !== null) {
    try {
      const { request } = await usdc.simulate.approve([
        price.issues.allowance.spender,
        maxUint256,
      ]);
      console.log("For debugging purpoes, logging request object", + request)
      console.log("Approving Permit2 to spend USDC...", request.args);
      //TO DO: Debug here: verify what request.args outputs, usdc.write.approve expects 2 arguments (chain + data type with account, gas etc) - CONVERT CURRENT CHAIN TO viem's Chain type
      // set approval
// Call approve with correct arguments
const chainApprove: Chain | undefined = chainConfig.EthSepolia
const chainTuple: readonly [`0x${string}`, bigint] = [`0x${chainId.toString(16)}`, BigInt(0)]
const approvalArgs = {
  account: address.startsWith("0x") ? address : `0x${address}` as `0x${string}`, // Ensure address is in the correct format
  chain: [`0x${chainId.toString(16)}`, BigInt(chainId)] as readonly [`0x${string}`, bigint], // Correctly format chain
  gas: BigInt(100000),  // optional, adjust based on your transaction needs
  nonce: await provider.getTransactionCount({ address }), // optional, get nonce if needed
  value: BigInt(0),  // if no value is sent with the transaction
};

const hash = await usdc.write.approve(approvalArgs.chain, approvalArgs)
      console.log(
        "Approved Permit2 to spend USDC.",
        await provider.waitForTransactionReceipt({ hash })
      );
    } catch (error) {
      console.log("Error approving Permit2:", error);
    }
  } else {
    console.log("USDC already approved for Permit2");
  }

  // 3. fetch quote
  const quoteParams = new URLSearchParams();
  for (const [key, value] of priceParams.entries()) {
    quoteParams.append(key, value);
  }

  const quoteResponse = await fetch(
    "https://api.0x.org/swap/permit2/quote?" + quoteParams.toString(),
    {
      headers,
    }
  );

  const quote = await quoteResponse.json();
  console.log("Fetching quote to swap 0.1 USDC for WETH");
  console.log("quoteResponse: ", quote);

  // 4. sign permit2.eip712 returned from quote
  let signature: Hex | undefined;
  if (quote.permit2?.eip712) {
    try {
      signature = await client.signTypedData(quote.permit2.eip712);
      console.log("Signed permit2 message from quote response");
    } catch (error) {
      console.error("Error signing permit2 coupon:", error);
    }

    // 5. append sig length and sig data to transaction.data
    if (signature && quote?.transaction?.data) {
      const signatureLengthInHex = numberToHex(size(signature), {
        signed: false,
        size: 32,
      });

      const transactionData = quote.transaction.data as Hex;
      const sigLengthHex = signatureLengthInHex as Hex;
      const sig = signature as Hex;

      quote.transaction.data = concat([transactionData, sigLengthHex, sig]);
    } else {
      throw new Error("Failed to obtain signature or transaction data");
    }
  }
  // 6. submit txn with permit2 signature
  if (signature && quote.transaction.data) {
    const nonce = await provider.getTransactionCount({
      address: address,
    });

    const signedTransaction = await provider.signTransaction({
      account: client.account,
      chain: client.chain,
      gas: !!quote?.transaction.gas
        ? BigInt(quote?.transaction.gas)
        : undefined,
      to: quote?.transaction.to,
      data: quote.transaction.data,
      value: quote?.transaction.value
        ? BigInt(quote.transaction.value)
        : undefined, // value is used for native tokens
      gasPrice: !!quote?.transaction.gasPrice
        ? BigInt(quote?.transaction.gasPrice)
        : undefined,
      nonce: nonce,
    });
    const hash = await client.sendRawTransaction({
      serializedTransaction: signedTransaction,
    });

    console.log("Transaction hash:", hash);

    console.log(`See tx details at https://basescan.org/tx/${hash}`);
  } else {
    console.error("Failed to obtain a signature, transaction not sent.");
  }
};