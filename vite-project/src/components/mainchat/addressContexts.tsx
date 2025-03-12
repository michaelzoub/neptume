import { storeAddressContext, initialState } from "../../utils/addressContext/storeAddressContext"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { ArrowRight } from 'lucide-react'
import { enteredAtom } from "../../atoms/entered"

export default function AddressContexts({state}: {state: boolean}) {

    const [contexts, setContexts] = useState([{name: "Add a username!", address: "Add an address!"}])
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [, setEntered] = useAtom(enteredAtom);

    useEffect(() => {
        const init = initialState()
        console.log(init)
        setContexts(init)
    }, [])

    function handleButtonClick() {
        const contextObject = { name: name, address: address }
        setContexts((prev) => [...prev, contextObject])
        storeAddressContext(contextObject)
        setName("")
        setAddress("")
    }

    return (
        <AnimatePresence mode="wait">
            {state && (
        <motion.div className={` ${state ? "absolute top-[100%] mt-[3px] w-[250px] h-[200px] max-h-[300px] border-[1px] bg-zinc-800 border-neutral-700 rounded-lg p-2 gap-1 text-white py-4" : "hidden"}`}
            initial={{
                scale: 0,
                translateY: -200,
                opacity: 0
            }}
            animate={{
                scale: state? 1 : 0,
                translateY: state? 0 : -200,
                opacity: state? 1 : 0
            }}
            exit={{
                scale: 0,          
                translateY: -100,   
                opacity: 0          
            }}
            transition={{
                type: "spring",
                duration: 0.5,
            }}
        >
            <div className="flex flex-row justify-between mb-3">
                <h2 className="text-sm text-neutral-400">Map names to addresses!</h2>
                <div className="h-fit mt-[3px] text-neutral-400 mr-[10px] hover:text-neutral-300 hover:cursor-pointer ease-in-out transition" onClick={() => setEntered(false)}>
                    <svg  width="14" height="14" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <line x1="3" y1="3" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" />
                        <line x1="13" y1="3" x2="3" y2="13" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                </div>
            </div>
            <div className="w-full h-fit flex flex-row gap-[6px] text-xs px-1">
                <input className="h-fit p-2 rounded-lg border-[0px] border-neutral-600 bg-zinc-700 w-[30%]" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}></input>
                <input className="h-fit p-2 rounded-lg border-[0px] border-neutral-600 bg-zinc-700 w-[60%]" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)}></input>
                <button className="text-neutral-500 bg-neutral-300 px-[7px] py-0 rounded-lg border-[1px] border-neutral-100 flex-grow" onClick={handleButtonClick}><ArrowRight className="w-[12px] h-[12px]" /></button>
            </div>
            <motion.div className="w-full flex flex-col gap-2 text-xs text-neutral-500 mt-4 px-1 h-[198px] overflow-y-auto scrollbar-hide">
            <h2 className="mt-1">Your current name list:</h2>
            {contexts?.map((e, index) => (
                <div key={index} className="w-full flex flex-row gap-1">
                    <div className="flex w-[30%] items-center pl-2 rounded-lg hover:bg-zinc-700 p-[3px]">
                        {e.name}
                    </div>
                    <div className="w-[70%] break-all pl-2 rounded-lg hover:bg-zinc-700 p-[3px]">
                        {e.address}
                    </div>
                </div>
            ))}
        </motion.div>
        </motion.div>)}
        </AnimatePresence>
    )
}