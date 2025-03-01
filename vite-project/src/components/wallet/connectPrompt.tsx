import {useConnectWallet} from '@privy-io/react-auth';
import {useLogin} from '@privy-io/react-auth';
import { useAtom, atom } from 'jotai';
import { connected } from '../../atoms/walletinfo';
import { motion } from "framer-motion"
import { useEffect, useState } from 'react';
import { connectWalletFunc } from '../../state/connectWalletFunc';
import { modal } from '../../atoms/modal';
import { useWallets } from "@privy-io/react-auth";
import { sign } from '../../utils/signature';

export default function ConnectWalletButton({color}: {color: string}) {

  const {wallets} = useWallets();
    const [isHovered, setIsHovered] = useState(false)
    const [modals, setModal] = useAtom(modal)
    const [connect, setConnect] = useAtom(connected)
    const [signing, setSigning] = useState(false)


    const {connectWallet} = useConnectWallet({
        onSuccess: (wallet) => {
          console.log(wallet)
          connectWalletFunc(wallet)
          setSigning((e) => !e)
        },
        onError: (error) => {
          console.log(error)
        }
      })

    async function handleConnect() {
      if (connect) {
        setModal((e) => !e)
        console.log("Modal set opposite", modals)
        //change network
      } else {
        connectWallet()
      }
      console.log("Connected: ", connect)
    }

    useEffect(() => {
      async function fun() {
        console.log("signing hit")
        console.log(wallets[0])
        //const ethProvider = await wallets[0].getEthereumProvider()
        //localStorage.setItem("wallet", JSON.stringify(ethProvider))
        const truthy = await sign(wallets)
        //set wallet atom as provider:
        if (truthy !== "") {
          setConnect(true)
        } else {
          setConnect(false)
        }
      }
      fun()
    }, [signing])

    return <motion.button
    style={{ backgroundColor: color }}
    className="text-black font-medium py-3 px-4 text-sm rounded-xl m-4 self-end"
    onClick={handleConnect}
    transition={{
      delay: 0.02,
      type: "spring",
      stiffness: 300, 
      damping: 25 
    }}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    whileHover={{
      scale: 1.1, 
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    }}
  >
    <motion.span
      key={connect ? (isHovered ? 'Disconnect' : 'Connected') : 'Connect Wallet'}
      initial={{ opacity: 0, x: -50 }} 
      animate={{ opacity: 1, x: 0 }}  
      exit={{ opacity: 0, x: 50 }}    
      transition={{ duration: 0.1 }}   
    >
      {connect ? (isHovered ? "Change network" : "Connected") : "Connect Wallet"}
    </motion.span>
  </motion.button>
  }