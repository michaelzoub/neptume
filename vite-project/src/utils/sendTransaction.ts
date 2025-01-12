import {encodeFunctionData} from 'viem';
import { getEthereumProvider } from './getEthereumProvider';

//i need contract address and 
export async function sendTransaction(chainId: number, destination: string, abi: any, value: number, walletsProvided: any) {

  console.log(walletsProvided)
  const body = await getEthereumProvider(walletsProvided)
  const provider = body.provider
  const wallet = body.wallet
  console.log(provider)
  console.log("Available methods on provider:", Object.keys(provider))

  try {
    console.log(abi)
    const data = encodeFunctionData({
      abi: abi,
      functionName: 'transfer', 
      args: [destination, value]
  })
  
  const transactionRequest = {
      from: wallet.address,
      to: destination,
      data: data,
      value: value, 
      chain: chainId
    }

    console.log(destination)
    try {
      const transactionHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [transactionRequest],
      });
      console.log("Transaction Hash:", transactionHash);
    } catch (error) {
      console.error("Transaction Error:", error);
    }
  } catch (error) {
    console.error(error)
  }

}