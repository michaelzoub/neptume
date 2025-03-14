import { motion } from "framer-motion"
import { recommendation } from "../../atoms/recommendation"
import { messageAtom } from "../../atoms/messages"
import { messagesAtom } from "../../atoms/messages"
import { enteredAtom } from "../../atoms/entered"
import { useAtom } from "jotai"
import { useEffect } from "react"
import { initialState } from "../../utils/addressContext/storeAddressContext"

const recommendations = [
    "What's my total balance?",
    "Send 0.001 ETH to Mike",
    "How many NFTs do I own?"
]

export default function Recommendations() {

    const [recommend, setRecommended] = useAtom(recommendation)
    const [message, setMessage] = useAtom(messageAtom)
    const [messages, setMessages] = useAtom(messagesAtom)
    const [, setEntered] = useAtom(enteredAtom);

    async function handleButtonClick(msg: string) {
        if (msg.includes("Mike")) {
            //verify if any address context exists, if not open the address context modal
            if (initialState().length == 0) {
                setTimeout(() => {
                    setEntered(true);
                }, 500)
            }
        }
        setRecommended((e) => !e)
        setMessage(msg)
        const timeSplit = new Date().toLocaleTimeString().split(":")[0] + ":" + new Date().toLocaleTimeString().split(":")[1]
                setMessages((prev) => [...prev,
                    {
                        id: prev[prev.length - 1].id + 1,
                        message: msg,
                        sender: "user",
                        timestamp: timeSplit,
                        neededInfo: {
                            chaindId: 1,
                            to: "",
                            abi: "",
                            wei: 0
                        },
                        jwt: (localStorage.getItem("jwt") || "")
                    },
                ])
    }

    useEffect(() => {
        //setRecommended(false)
        if (messages.length >= 2) {
            setRecommended(false)
        }
    }, [message])

    return (
        <motion.div className={`${recommend? "flex flex-row gap-2 w-fit mx-auto my-2 justify-center" : "hidden flex flex-row gap-2 w-fit mx-auto my-2 justify-center"}`}
            initial={{
                scale: 1,
                opacity: 1
            }}
            animate={{
                translateX: recommend? 0 : 1000,
                scale: recommend? 1 : 0,
                opacity: recommend? 1 : 0
            }}
            transition={{
                type: "spring",
                duration: 0.5,
            }}
        >
            {
                recommendations.map((e: string) =>
                    <button className="text-xs w-[31%] break-words p-2 bg-zinc-800 border-[1px] border-neutral-700 text-neutral-500 text-left shadow shadow-inner" onClick={() => handleButtonClick(e)}>{e}</button>
                )
            }
        </motion.div>
    )
}