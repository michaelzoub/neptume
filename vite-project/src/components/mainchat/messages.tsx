import { useAtom } from "jotai"
import { messageAtom, messagesAtom } from "../../atoms/messages"
import { useEffect, useRef } from "react"
import { Message } from "../../interfaces/Message"
import { motion } from "framer-motion"

const timeSplit = new Date().toLocaleTimeString().split(":")[0] + ":" + new Date().toLocaleTimeString().split(":")[1]

const messagesInitial = [
    {
        id: 2,
        message: "I'm your personal wallet assistant. Ask me anything!",
        sender: "assistant",
        timestamp: timeSplit,
        neededInfo: {
            chaindId: 1,
            to: "",
            abi: "",
            wei: 0
        },
        jwt: ""
    }, 
]

export default function Messages({color, secondary}: {color: string, secondary: string}) {
    const [messages, setMessages] = useAtom<Message[]>(messagesAtom)
    const [message] = useAtom(messageAtom)

    const messageRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMessages(messagesInitial)
        const curr = messageRef.current
        if (curr) {
            curr.scrollTop = curr.scrollHeight
        }
    }, [])

    useEffect(() => {
        const curr = messageRef.current;
        if (curr) {
            setTimeout(() => {
                curr.scrollTop = curr.scrollHeight;
            }, 0)
        }
    }, [message, messages])

    return (
        <div className="z-100 flex flex-col h-[77%] mx-2 py-0 border-neutral-600 bg-zinc-800">
            <div className="z-100 sidebar flex flex-col w-full h-full gap-2 overflow-y-auto py-2 bg-zinc-800" ref={messageRef}>
                {messages.map((message) => (
                    <motion.div className={`z-100 flex flex-col h-fit w-fit max-w-[150px] text-black ${message.sender === "user" ? "self-end" : "self-start"}`} key={message.id}
                    initial={{ scale: 0, opacity: 0, translateY: 150 }}
                    animate={{ scale: 1, opacity: 1, translateY: 0 }}
                    transition={{
                        delay: 0.1,
                        type: "spring",
                        stiffness: 400,
                        damping: 45,
                    }}
                    >
                        <div className={`text-neutral-200 shadow-lg ${
                            message.sender === "user" 
                                ? ` border-[1px] border-${secondary} self-end text-left text-black`
                                : `text-left bg-zinc-700 border-[1px] border-neutral-600`
                        } break-words rounded-xl p-2 flex flex-col w-fit max-w-full h-fit`}
                        style={{
                            backgroundColor: (message.sender === "user" ? `${color}` : ""), 
                            borderColor: (message.sender === "user" ? `${secondary}` : ""), 
                          }}
                        >
                            {message.message}
                        </div>
                        <div className={`${message.sender === "user" ? "text-right" : "text-left"} text-xs mx-1 my-1 text-neutral-400`}>{message.timestamp}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
