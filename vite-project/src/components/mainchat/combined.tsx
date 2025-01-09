import Input from "./input"
import Messages from "./messages"
import OpenSign from "./openSign"
import { openState, rotateState, scaleState, translateState } from "../../atoms/opensign"
import { useAtom } from "jotai"
import { motion } from "framer-motion"
import Modal from "../modal"

export default function Combined({color, secondary}: {color: string, secondary: string}) {

    const [open, setOpen] = useAtom(openState)
    const [translate, setTranslate] = useAtom(translateState)
    const [rotate, setRotate] = useAtom(rotateState)
    const [scale, setScale] = useAtom(scaleState)


    function handleClose() {
        setOpen(false)
        setTimeout(() => {
            setTranslate(false)
            setRotate(false)
            setScale(false)
        }, 150)
    }

    return (
            <motion.div className={`z-100 shadow-lg shadow-neutral-700 flex flex-col h-[600px] w-[400px] mx-auto my-auto rounded-lg border-[1px] border-neutral-500 bg-neutral-800 px-0 flex flex-col overflow-hidden`}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0 }}
                            transition={{
                                duration: 0.4,
                                scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                            }}
            >
            <div className="p-2 px-4 h-[10%] flex items-center justify-between border-b border-neutral-600">
                <div className="text-neutral-500 bg-neutral-700 flex items-center justify-center text-sm w-[34px] h-[34px] rounded-lg border-[1px] border-neutral-600">🤖</div>
                <h2 className="text-neutral-500">Neptume</h2>
                <button className="text-neutral-500 bg-neutral-700 p-1 px-[10px] rounded-lg border-[1px] border-neutral-600" onClick={() => handleClose()}>✖</button>
            </div>
            <Messages color={color} secondary={secondary} />
            <Input color={color}  />
            </motion.div>
    )
}