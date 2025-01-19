import { atom,useAtom } from "jotai"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { messageAtom } from "../../atoms/messages"
import { messagesAtom } from "../../atoms/messages"
import { enteredAtom } from "../../atoms/entered"
import { chatUpdate } from "../../state/chatUpdate"
import { address, chainId } from "../../atoms/walletinfo"
import { useWallets } from "@privy-io/react-auth"
import { sendTransaction } from "../../utils/sendTransaction"
import { swapSushi } from "../../libs/sushiswap"
import { To } from "../../interfaces/Message"

export default function Input({color}: {color: string}) {

    const {wallets} = useWallets()

    const [message, setMessage] = useAtom(messageAtom)
    const [messages, setMessages] = useAtom(messagesAtom)
    const [hovered, setHovered] = useState(false)
    const [entered, setEntered] = useAtom(enteredAtom)

    const [addresss] = useAtom(address)
    const [chainIdd] = useAtom(chainId)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        e.currentTarget.reset()
        console.log(message)
        //keep optimism for now
        console.log(`address and chainid: ${addresss}, ${chainIdd}`)
        setEntered(false)
        const timeSplit = new Date().toLocaleTimeString().split(":")[0] + ":" + new Date().toLocaleTimeString().split(":")[1]
        const query = {
            message: message,
            address: addresss,
            time: new Date().toString(),
            chainId: chainIdd,
            contextInfo: ""
        }
        setMessages((prev) => [...prev,
            {
                id: prev[prev.length - 1].id + 1,
                message: message,
                sender: "user",
                timestamp: timeSplit,
                neededInfo: {
                    chaindId: 1,
                    to: "",
                    abi: "",
                    wei: 0
                }
            },
        ])
        //TO DO: perfom swap and transaction logic here for now, organize this once performance is critical
        const additionalInfo = await chatUpdate(query)
        const neededInfo = additionalInfo.neededInfo
        if (additionalInfo.message == "Sending transaction..." && typeof neededInfo.to == "string") {
            await sendTransaction(neededInfo.chaindId, neededInfo.to, JSON.parse(neededInfo.abi), neededInfo.wei, wallets)
        } else if (additionalInfo.message == "Swapping...") {
            await swapSushi(neededInfo.wei.toString(), neededInfo.abi, wallets, addresss, "", chainIdd , neededInfo.to)
        }
        setMessage("")
        setTimeout(() => {
            console.log(messages)
        }, 1000)
    }

    return (
        <div className={`flex flex-col w-full h-fit self-end h-[12%] p-2 py-4 border-t border-neutral-600`}>
            <form className="flex flex-row w-full h-fit relative items-center text-white" onSubmit={handleSubmit}>
                <input className={`w-full text-sm h-fit p-2 py-[10px] rounded-xl border-[0px] pr-20 border-neutral-600 bg-neutral-700`} type="text" placeholder="Type a message..." onChange={(e) => setMessage(e.target.value)} />
                <motion.button 
                    className="outline-none absolute end-0  text-black py-[3px] px-4 text-sm rounded-xl m-2 shadow-md hover:shadow-lg hover:shadow-white focus:outline-none focus-visible:outline-none border-none focus:ring-0 focus:ring-offset-0" 
                    style={{
                        backgroundColor: hovered ? "#ffffff" : color, 
                        transition: "background-color 0.3s ease, box-shadow 0.3s ease" 
                    }}
                    onClick={() => handleSubmit}
                    onMouseEnter={() => setHovered((e) => !e)}
                    onMouseLeave={() => setHovered((e) => !e)}
                    whileHover={{
                        scale: 1.05,
                        opacity: 1,
                    }}
                    transition={{ duration: 0.1, ease: "easeInOut", type: "spring", stiffness: 100 }}
                >Send</motion.button>
            </form>
        </div>
    )
}