import { getSwap, ChainId } from 'sushi'
import { createPublicClient



, createWalletClient, http, type Hex, custom } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'
import { getEthereumProvider } from '../utils/getEthereumProvider'
 
export async function swapSushi(value: string, abi: any, wallets: any, address: string, chainName: string, chainId:number, parties: any) {

    const receivedBody = await getEthereumProvider(wallets)
    const provider = receivedBody.provider

    const publicClient = createPublicClient({
        chain: mainnet,
        transport: custom(provider),
      })
       
      // Get a swap from the API
      const data = await getSwap({
        chainId: ChainId.ETHEREUM, // ethereum chain id
        tokenIn: parties.to[0], // eth token
        tokenOut: parties.from[0], // sushi token
        to: address as `0x${string}`, // replace with your own address
        amount: BigInt(value), // 1 eth
        maxSlippage: 0.005, // 0.05% max slippage
        includeTransaction: true, // include transaction in response
      })
      console.log(data)
       
      // If the swap status is 'Success'
      if (data.status === 'Success') {
        const { tx } = data
        // Simulate a call to the blockchain for the swap
        const callResult = await publicClient.call({
          account: tx.from,
          data: tx.data,
          to: tx.to,
          value: tx.value,
        })
        // Returns the simulated amount out
        console.log('Output: ', callResult)
        const PRIVATE_KEY = process.env.PRIVATE_KEY as Hex
        // Send a transaction
        const signedTx  = await provider.signTransaction(tx, {
            value: tx.value,
            to: tx.to,
            data: tx.data,
          });
          const hash = await provider.sendTransaction({
            account: PRIVATE_KEY,
            data: signedTx.data,
            to: signedTx.to,
            value: signedTx.value,
          })
  
          // After signing, send the transact
        console.log('Tx: ', hash)
      }
}