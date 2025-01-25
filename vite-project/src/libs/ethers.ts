import { ethers } from "ethers";
import { getEthereumProvider } from '../utils/getEthereumProvider';

// Uniswap V3 Router Address (Mainnet)
const UNISWAP_ROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

// Minimal ABI for Router
const routerAbi = [
  "function exactInput(tuple(address,address,uint24,address,uint256,uint256,uint256,uint160) params) external payable returns (uint256)",
];

async function approveToken(
  tokenAddress: string,
  spenderAddress: string,
  amount: string,
  signer: ethers.Signer
): Promise<string> {
  // ERC20 ABI (only approve function)
  const erc20Abi = [
    "function approve(address spender, uint256 amount) returns (bool)",
  ];

  const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);
  const tx = await tokenContract.approve(spenderAddress, amount);
  await tx.wait();
  return tx.hash;
}

async function swapTokens(
  tokenIn: string,
  tokenOut: string,
  amountIn: string,
  fee: number,
  signer: ethers.Signer,
  recipientAddress: string,
  slippage: number = 1
): Promise<string> {
  // 1. Approve Router to spend tokens
  await approveToken(tokenIn, UNISWAP_ROUTER_ADDRESS, amountIn, signer);

  // 2. Build swap parameters
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes
  const minAmountOut = "0"; // Should calculate based on price feed and slippage

  // 3. Encode path (tokenIn -> fee -> tokenOut)
  const path = ethers.utils.solidityPack(
    ["address", "uint24", "address"],
    [tokenIn, fee, tokenOut]
  );

  // 4. Execute swap
  const router = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, routerAbi, signer);
  const tx = await router.exactInput({
    path,
    recipient: recipientAddress,
    deadline,
    amountIn,
    amountOutMinimum: minAmountOut,
  });

  await tx.wait();
  return tx.hash;
}

export async function ethersSwap(
  TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER: string,
  wallets: any,
  sellTokenAddress: string,
  buyTokenAddress: string,
  chainId: number,
  feeTier: number = 3000
): Promise<{ txHash?: string; error?: string }> {
  try {
    // Get provider and signer from connected wallet
    const { provider: privyProvider, wallet: walletAddress } = await getEthereumProvider(wallets);
    const provider = new ethers.providers.Web3Provider(privyProvider);
    const signer = provider.getSigner();

    // Execute swap with parameters
    const txHash = await swapTokens(
      sellTokenAddress,
      buyTokenAddress,
      TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
      feeTier,
      signer,
      walletAddress // Use connected wallet as recipient
    );

    return { txHash };
  } catch (error) {
    console.error("Swap failed:", error);
    return { error: (error as Error).message };
  }
}