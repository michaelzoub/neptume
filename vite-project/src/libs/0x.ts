import { config as dotenv } from "dotenv";
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
import { privateKeyToAccount } from "viem/accounts";
import { getEthereumProvider } from "../utils/getEthereumProvider";
import { mainnet, sepolia, arbitrum, avalanche, base, optimism, polygon, worldchain } from 'viem/chains';
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
  
//TO DO: create single function and implement ABI properly

// load env vars
dotenv();
const { ZERO_EX_API_KEY, ALCHEMY_HTTP_TRANSPORT_URL } =
  process.env;

// validate requirements
if (!ZERO_EX_API_KEY) throw new Error("missing ZERO_EX_API_KEY.");
if (!ALCHEMY_HTTP_TRANSPORT_URL)
  throw new Error("missing ALCHEMY_HTTP_TRANSPORT_URL.");

// fetch headers
const headers = new Headers({
  "Content-Type": "application/json",
  "0x-api-key": ZERO_EX_API_KEY,
  "0x-version": "v2",
});

// set up contracts

export const main = async (value: string, abi: any, wallets: any, address: string) => {

    const receivedBody = await getEthereumProvider(wallets)
    const provider = receivedBody.provider

    //setup wallet client
    const client = createWalletClient({
        chain: sepolia,
        transport: custom(provider),
      })

    const usdc = getContract({
        address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
        abi: erc20Abi,
        client,
      });
      const weth = getContract({
        address: "0x4200000000000000000000000000000000000006",
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
      console.log("Approving Permit2 to spend USDC...", request);
      // set approval
      const hash = await usdc.write.approve(request.args);
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