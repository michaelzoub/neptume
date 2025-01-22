import {
    Currency,
    CurrencyAmount,
    Percent,
    Token,
    TradeType,
  } from '@uniswap/sdk-core'
  import {
    Pool,
    Route,
    SwapOptions,
    SwapQuoter,
    SwapRouter,
    Trade,
  } from '@uniswap/v3-sdk'
  import { ethers } from 'ethers'
  import JSBI from 'jsbi'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { computePoolAddress } from '@uniswap/v3-sdk'
import { FeeAmount } from '@uniswap/v3-sdk'
  import {
    ERC20_ABI,
  } from './constants'
  import { MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS } from './constants'
  import {
    sendTransaction,
    TransactionState,
  } from './providers'
  import { getEthereumProvider } from '../utils/getEthereumProvider'
  import { BigNumber } from 'ethers'
 import { ChainId } from '@uniswap/sdk-core'

 const mediumFee = FeeAmount.MEDIUM
  
  export type TokenTrade = Trade<Token, Token, TradeType>
  
  function fromReadableAmount(
    amount: number,
    decimals: number
  ): BigNumber {
    return ethers.utils.parseUnits(amount.toString(), decimals)
  }
  
  // Trading Functions
  
  export async function createTrade(
    QUOTER_CONTRACT_ADDRESS: string, 
    wallets: any, 
    sellToken: Token, 
    buyToken: Token,
    TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER: number
  ): Promise<TokenTrade> {
    const receivedBody = await getEthereumProvider(wallets)
    const privyProvider = receivedBody.provider
    const provider = new ethers.providers.Web3Provider(privyProvider);
    console.log(wallets)
    console.log(provider)

    const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: buyToken,
    tokenB: sellToken,
    fee: mediumFee,
  })

  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    provider
  )

  const [token0, token1, fee, tickSpacing, liquidity, slot0] =
    await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ])

  const poolInfo = {
    token0,
    token1,
    fee,
    tickSpacing,
    liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  }
  
    const pool = new Pool(
      buyToken,
      sellToken,
      mediumFee, // Assuming poolFee is still from CurrentConfig
      poolInfo.sqrtPriceX96.toString(),
      poolInfo.liquidity.toString(),
      poolInfo.tick
    )
  
    const swapRoute = new Route(
      [pool],
      buyToken,
      sellToken,
    )
  
    const amountOut = await getOutputQuote(swapRoute, QUOTER_CONTRACT_ADDRESS, wallets, buyToken, TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER)
  
    const uncheckedTrade = Trade.createUncheckedTrade({
      route: swapRoute,
      inputAmount: CurrencyAmount.fromRawAmount(
        buyToken,
        fromReadableAmount(
          TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER, // Assuming amountIn is still from CurrentConfig
          buyToken.decimals
        ).toString()
      ),
      outputAmount: CurrencyAmount.fromRawAmount(
        sellToken,
        JSBI.BigInt(amountOut)
      ),
      tradeType: TradeType.EXACT_INPUT,
    })
  
    return uncheckedTrade
  }
  
  export async function executeTrade(
    trade: TokenTrade,
    SWAP_ROUTER_ADDRESS: string,
    TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER: number,
    wallets: any,
    sellToken: Token
  ): Promise<TransactionState> {
    const receivedBody = await getEthereumProvider(wallets)
    const privyProvider = receivedBody.provider
    const provider = new ethers.providers.Web3Provider(privyProvider);
    const walletAddress = receivedBody.wallet
  
    if (!walletAddress || !provider) {
      throw new Error('Cannot execute a trade without a connected wallet')
    }
  
    // Give approval to the router to spend the token
    const tokenApproval = await getTokenTransferApproval(sellToken, SWAP_ROUTER_ADDRESS, TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER, wallets)
  
    // Fail if transfer approvals do not go through
    if (tokenApproval !== TransactionState.Sent) {
      return TransactionState.Failed
    }
  
    const options: SwapOptions = {
      slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
      deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
      recipient: walletAddress,
    }
  
    const methodParameters = SwapRouter.swapCallParameters([trade], options)
  
    const tx = {
      data: methodParameters.calldata,
      to: SWAP_ROUTER_ADDRESS,
      value: methodParameters.value,
      from: walletAddress,
      maxFeePerGas: MAX_FEE_PER_GAS,
      maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    }
  
    const res = await sendTransaction(tx, provider)
  
    return res
  }
  
  // Helper Quoting and Pool Functions
  
  async function getOutputQuote(route: Route<Currency, Currency>, QUOTER_CONTRACT_ADDRESS: string, wallets: any, buyToken: Token, TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER: number) {
    const receivedBody = await getEthereumProvider(wallets)
    const privyProvider = receivedBody.provider
    const provider = new ethers.providers.Web3Provider(privyProvider);
  
    if (!provider) {
      throw new Error('Provider required to get pool state')
    }
  
    const { calldata } = await SwapQuoter.quoteCallParameters(
      route,
      CurrencyAmount.fromRawAmount(
        buyToken, // buyToken is passed instead of CurrentConfig.tokens.in
        fromReadableAmount(
          TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
          buyToken.decimals
        ).toString()
      ),
      TradeType.EXACT_INPUT,
      {
        useQuoterV2: true,
      }
    )
  
    const quoteCallReturnData = await provider.call({
      to: QUOTER_CONTRACT_ADDRESS,
      data: calldata,
    })
  
    return ethers.utils.defaultAbiCoder.decode(['uint256'], quoteCallReturnData)
  }
  
  export async function getTokenTransferApproval(
    token: Token,
    SWAP_ROUTER_ADDRESS: string,
    TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER: number,
    wallets: any
  ): Promise<TransactionState> {
    const receivedBody = await getEthereumProvider(wallets)
    const privyProvider = receivedBody.provider
    const provider = new ethers.providers.Web3Provider(privyProvider);
    const address = receivedBody.wallet
    if (!provider || !address) {
      console.log('No Provider Found')
      return TransactionState.Failed
    }
  
    try {
      const tokenContract = new ethers.Contract(
        token.address,
        ERC20_ABI,
        provider
      )
  
      const transaction = await tokenContract.populateTransaction.approve(
        SWAP_ROUTER_ADDRESS,
        fromReadableAmount(
          TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
          token.decimals
        ).toString()
      )
  
      return sendTransaction({
        ...transaction,
        from: address,
      }, provider)
    } catch (e) {
      console.error(e)
      return TransactionState.Failed
    }
  }
  
  export async function performSwap(
    QUOTER_CONTRACT_ADDRESS: string,  // Quoter contract address for quoting prices
    SWAP_ROUTER_ADDRESS: string,      // SwapRouter contract address for executing the trade
    TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER: number,  // The amount of tokens to approve for transfer
    wallets: any,  // Wallet provider object (e.g., Metamask, WalletConnect)
    sellTokens: string,  // sellTokens parameter (Array of strings)
    buyTokens: string    // buyTokens parameter (Array of strings)
  ) {
    try {
      // Create Token objects:
      const sellToken = new Token(
        ChainId.MAINNET,
        sellTokens,  // Address of the token
        18,  // Token decimals
        'SELL', 
        'Sell Token'   // Token name (adjust this if necessary)
      )
  
      const buyToken = new Token(
        ChainId.MAINNET,
        buyTokens,  // Address of the token
        18,  // Token decimals
        'BUY', 
        'Buy Token' // Token name (adjust this if necessary)
      )
  
      // Step 1: Create the trade
      const trade = await createTrade(QUOTER_CONTRACT_ADDRESS, wallets, sellToken, buyToken, TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER)
  
      // Step 2: Execute the trade
      const result = await executeTrade(trade, SWAP_ROUTER_ADDRESS, TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER, wallets, sellToken)
      
      // Log the result of the trade execution
      console.log('Trade executed, result:', result)
    } catch (error) {
      console.error('Error performing swap:', error)
    }
  }