import { ethers } from "ethers";
import { getEthereumProvider } from '../utils/getEthereumProvider';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { FACTORY_ADDRESS, FeeAmount } from '@uniswap/v3-sdk';
import { computePoolAddress } from '@uniswap/v3-sdk';
import { Token } from "@uniswap/sdk-core";
import IUniswapV3RouterABI from '@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json';

const UNISWAP_ROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const ROUTER_ABI = IUniswapV3RouterABI.abi;

const SUPPORTED_FEES: FeeAmount[] = [500, 3000, 10000];

// Helper: Find the best fee tier for a given token pair
async function findBestFeeTier(
    tokenA: string,
    tokenB: string,
    provider: ethers.providers.Provider,
    chainId: number
): Promise<FeeAmount | null> {
    for (const fee of SUPPORTED_FEES) {
        const poolAvailable = await poolExists(tokenA, tokenB, fee, provider, chainId);
        if (poolAvailable) {
            return fee; // Return the first available fee tier
        }
    }
    return null; // No pool exists for any fee tier
}

// Helper: Create Token object
function createToken(address: string, decimals: number, chainId: number): Token {
    return new Token(chainId, address, decimals);
}

// Helper: Get token decimals
async function getTokenDecimals(tokenAddress: string, provider: ethers.providers.Provider): Promise<number> {
    const erc20Abi = ["function decimals() view returns (uint8)"];
    const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);
    return contract.decimals();
}

async function approveToken(
  tokenAddress: string,
  amount: string,
  signer: ethers.Signer
): Promise<void> {
  const decimals = await getTokenDecimals(tokenAddress, signer.provider!);
  const amountWei = ethers.utils.parseUnits(amount, decimals);
  
  const erc20Abi = ["function approve(address, uint256) returns (bool)"];
  const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);
  const tx = await tokenContract.approve(UNISWAP_ROUTER_ADDRESS, amountWei);
  await tx.wait();
}

// Helper: Check if pool exists
async function poolExists(
    tokenA: string,
    tokenB: string,
    fee: FeeAmount,
    provider: ethers.providers.Provider,
    chainId: number
): Promise<boolean> {
    try {
        const decimalsA = await getTokenDecimals(tokenA, provider);
        const decimalsB = await getTokenDecimals(tokenB, provider);

        const tokenAObj = createToken(tokenA, decimalsA, chainId);
        const tokenBObj = createToken(tokenB, decimalsB, chainId);

        const poolAddress = computePoolAddress({
            factoryAddress: FACTORY_ADDRESS,
            tokenA: tokenAObj,
            tokenB: tokenBObj,
            fee,
        });
        
        const code = await provider.getCode(poolAddress);
        return code !== '0x';
    } catch (error) {
        return false;
    }
}

// Helper: Get current pool price
async function getPoolPrice(
    tokenIn: string,
    tokenOut: string,
    fee: FeeAmount,
    provider: ethers.providers.Provider,
    chainId: number
): Promise<number> {
    const decimalsIn = await getTokenDecimals(tokenIn, provider);
    const decimalsOut = await getTokenDecimals(tokenOut, provider);

    const tokenInObj = createToken(tokenIn, decimalsIn, chainId);
    const tokenOutObj = createToken(tokenOut, decimalsOut, chainId);

    const poolAddress = computePoolAddress({
        factoryAddress: FACTORY_ADDRESS,
        tokenA: tokenInObj,
        tokenB: tokenOutObj,
        fee,
    });

    const pool = new ethers.Contract(poolAddress, IUniswapV3PoolABI.abi, provider);
    
    try {
        const { sqrtPriceX96 } = await pool.slot0();
        const price = (Number(sqrtPriceX96) ** 2) / (2 ** 192);
        return tokenIn < tokenOut ? price : 1 / price;
    } catch (error) {
        throw new Error(`Pool doesn't exist for ${tokenIn}/${tokenOut} with fee ${fee}`);
    }
}

// Main Swap Function
async function swapTokens(
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    signer: ethers.Signer,
    recipient: string,
    chainId: number,
    slippage: number = 0.5
): Promise<string> {
    const provider = signer.provider!;

    // 1. Dynamically determine the best fee tier
    const feeTier = await findBestFeeTier(tokenIn, tokenOut, provider, chainId);
    if (!feeTier) {
        throw new Error(`No pool available for ${tokenIn}/${tokenOut} with any fee tier: ${feeTier}`);
    }

    console.log(`Using fee tier: ${feeTier}`);

    // 2. Get token decimals
    const inDecimals = await getTokenDecimals(tokenIn, provider);
    const outDecimals = await getTokenDecimals(tokenOut, provider);

    // 3. Get pool price
    const price = await getPoolPrice(tokenIn, tokenOut, feeTier, provider, chainId);

    // 4. Calculate amounts
    const amountInWei = ethers.utils.parseUnits(amountIn, inDecimals);
    const expectedOut = Number(amountIn) * price;
    const minAmountOut = ethers.utils.parseUnits(
        (expectedOut * (1 - slippage / 100)).toFixed(outDecimals),
        outDecimals
    );

    // 5. Approve router
    await approveToken(tokenIn, amountIn, signer);

    // 6. Build swap path
    const path = ethers.utils.solidityPack(
        ["address", "uint24", "address"],
        [tokenIn, feeTier, tokenOut]
    );

    // 7. Execute swap
    const router = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, ROUTER_ABI, signer);
    const tx = await router.exactInput({
        path,
        recipient,
        deadline: Math.floor(Date.now() / 1000) + 600, // 10 minutes
        amountIn: amountInWei,
        amountOutMinimum: minAmountOut,
    });

    await tx.wait();
    return tx.hash;
}

// Exported Swap Function
export async function ethersSwap(
    amount: string,
    wallets: any,
    sellToken: string,
    buyToken: string,
    chainId: number,
): Promise<{ txHash?: string; error?: string }> {
    try {
        const { provider: privyProvider, wallet: recipient } = await getEthereumProvider(wallets);
        const web3Provider = new ethers.providers.Web3Provider(privyProvider);
        const signer = web3Provider.getSigner();

        const txHash = await swapTokens(
            sellToken,
            buyToken,
            amount,
            signer,
            recipient,
            chainId
        );

        return { txHash };
    } catch (error) {
        console.error("Swap failed:", error);
        return { error: (error as Error).message };
    }
}