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

    const txReqTest = {
      from: wallet.address,
      to: '0xd19b72e027cD66bDe41d8f60a13740A26C4be8f3',
      value: 10,
      //chainId: chainId
      //chainId: 137,
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