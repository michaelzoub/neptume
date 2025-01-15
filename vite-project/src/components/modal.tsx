import { chains } from "../data/chains"
import { chainId, connected } from "../atoms/walletinfo"
import { useAtom } from "jotai"
import { modal } from "../atoms/modal"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { useWallets } from "@privy-io/react-auth"

export default function Modal({color}: {color: string}) {


    const {wallets} = useWallets();
    const wallet = wallets[0]; // Replace this with your desired wallet
    //const chainid = wallet.chainId

    const [, setId] = useAtom(chainId)
    const [opened, setOpened] = useAtom(modal)

    useEffect(() => {
        console.log("TESTING")
    }, [connected])

    async function clickBehavior(e) {
        setId(e)
        //switches chain on privy's network
        await wallet.switchChain(e)
        console.log(e)
        setOpened(false)
    }
    
    return (
      <div className={`${opened ? "backdrop-blur-xl flex items-center justify-center z-[10000] absolute w-full h-screen" : "hidden"}`}>
  <motion.div
    className="flex gap-2 p-4 justify-center flex-col w-[360px] h-fit min-h-[560px] h-fit rounded-2xl bg-white shadow-lg border-[1px]"
    initial={{ opacity: 0 }}  // Start with invisible
    animate={{ opacity: opened ? 1 : 0 }}  // Fade in and out
    exit={{ opacity: 0 }}  // Ensure smooth exit
    transition={{ duration: 0.3, ease: "easeInOut" }}  // Simple fade in/out transition
  >
    <button className="self-end rounded-full p-1 px-2 text-neutral-500 text-sm" onClick={() => setOpened(false)}>✖</button>
    <h2 className="text-xl font-semibold">Switch chains</h2>
    <h2 className="mt-[-6px] mb-[10px] text-sm text-neutral-500">Select another chain Neptume supports</h2>
    {
      chains.map((e) => 
        <button 
          className="flex flex-row gap-2 py-4 bg-white w-full shadow shadow-inner rounded-2xl text-left font-medium" 
          style={{ borderColor: color }} 
          key={e.chainId} 
          onClick={() => clickBehavior(e.chainId)}
        >
          <img src={e.logo} alt={e.chainName} className="w-6 h-6" loading="lazy" />
          <div>{e.chainName}</div>
        </button>
      )
    }
  </motion.div>
</div>
    );
}