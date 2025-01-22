import { storeAddressContext, initialState } from "../../utils/storeAddressContext"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { ArrowRight } from 'lucide-react'

export default function AddressContexts({state}: {state: boolean}) {

    const [contexts, setContexts] = useState([{name: "Add a username!", address: "Add an address!"}])
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")

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
        <motion.div className={` ${state ? "absolute mt-[345px] w-[250px] h-[300px] max-h-[300px] border-[1px] bg-neutral-800 border-neutral-700 rounded-lg p-2 gap-1 text-white py-4" : "hidden"}`}
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
            <h2 className="text-sm mb-3 text-neutral-400 font-">Add names to addresses!</h2>
            <div className="w-full h-fit flex flex-row gap-[6px] text-xs px-1">
                <input className="h-fit p-2 rounded-lg border-[0px] border-neutral-600 bg-neutral-700 w-[30%]" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}></input>
                <input className="h-fit p-2 rounded-lg border-[0px] border-neutral-600 bg-neutral-700 w-[60%]" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)}></input>
                <button className="text-neutral-500 bg-neutral-300 px-[7px] py-0 rounded-lg border-[1px] border-neutral-100 flex-grow" onClick={handleButtonClick}><ArrowRight className="w-[12px] h-[12px]" /></button>
            </div>
            <motion.div className="w-full flex flex-col gap-2 text-xs text-neutral-500 mt-4 px-1 h-[198px] overflow-y-auto scrollbar-hide">
            <h2 className="mt-1">Your current name list:</h2>
            {contexts?.map((e, index) => (
                <div key={index} className="w-full flex flex-row gap-1">
                    <div className="flex w-[30%] items-center pl-1 rounded-lg hover:bg-neutral-700 p-[3px]">
                        {e.name}
                    </div>
                    <div className="w-[70%] break-all pl-1 rounded-lg hover:bg-neutral-700 p-[3px]">
                        {e.address}
                    </div>
                </div>
            ))}
        </motion.div>
        </motion.div>)}
        </AnimatePresence>
    )
}