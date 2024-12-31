import { atom,useAtom } from "jotai"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Message } from "../../interfaces/Message"
export const messageAtom = atom("")
export const messagesAtom = atom<Message[]>([])

export default function Input({color}: {color: string}) {

    const [message, setMessage] = useAtom(messageAtom)
    const [messages, setMessages] = useAtom(messagesAtom)
    const [hovered, setHovered] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        e.currentTarget.reset()
        console.log(message)
        setMessages((prev) => [...prev, {
            id: messages.length + 1,
            message: message,
            sender: "user",
            timestamp: new Date().toLocaleTimeString().split(":")[0] + ":" + new Date().toLocaleTimeString().split(":")[1]
        }])
        setMessage("")
        setTimeout(() => {
            console.log(messages)
        }, 1000)
    }

    return (
        <div className={`flex flex-col w-full h-fit self-end h-[12%] p-2 py-4 border-t border-neutral-600`}>
            <form className="flex flex-row w-full h-fit relative items-center text-white" onSubmit={handleSubmit}>
                <input className={`w-full text-sm h-fit p-2 py-[10px] rounded-xl border-[0px] border-neutral-600 bg-neutral-700`} type="text" placeholder="Type a message..." onChange={(e) => setMessage(e.target.value)} />
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