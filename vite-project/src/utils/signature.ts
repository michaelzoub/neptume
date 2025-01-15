import { getEthereumProvider } from "./getEthereumProvider";
import { getDefaultStore } from "jotai";

export async function sign(walletsHook: any) {

    const body = await getEthereumProvider(walletsHook)
    const walleth = body.wallet
    const provider = body.provider
    const address = walleth.address
    
    const chainId = await provider.request({ method: 'eth_chainId' })
    console.log(chainId)
    const store = getDefaultStore()
    console.log(body)
    console.log(store)
    console.log(Object.keys(provider))
      try {
        const message = 'Please connect your wallet if you want to perform transactions using Neptume.';
        const signature = await provider.request({
          method: 'personal_sign',
          params: [message, address],
        });
        console.log(signature)
        if (signature) {
          console.log(true)
            return body
        } else {
          console.log("false")
            return ""
        }
      } catch (error) {
        console.error("Error sending transaction: ", error);
        return ""
      }
        }