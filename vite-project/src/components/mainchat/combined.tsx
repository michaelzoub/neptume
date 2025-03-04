import Input from "./input";
import Messages from "./messages";
import { openState, rotateState, scaleState, translateState } from "../../atoms/opensign";
import { enteredAtom } from "../../atoms/entered";
import { useAtom } from "jotai";
import { motion } from "framer-motion";
import Recommendations from "./recommendations";
import AddressContexts from "./addressContexts";

export default function Combined({color, secondary}: {color: string, secondary: string}) {
    const [open, setOpen] = useAtom(openState);
    const [, setTranslate] = useAtom(translateState);
    const [, setRotate] = useAtom(rotateState);
    const [, setScale] = useAtom(scaleState);
    const [entered, setEntered] = useAtom(enteredAtom);

    function handleClose() {
        setOpen(false);
        setTimeout(() => {
            setTranslate(false);
            setRotate(false);
            setScale(false);
        }, 150);
    }

    return (
        <motion.div 
            className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div 
                className="z-10 shadow-lg shadow-black flex flex-col h-[450px] w-full max-w-[400px] rounded-lg border-[1px] border-neutral-700 bg-zinc-800 px-0 overflow-hidden"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0 }}
                transition={{
                    duration: 0.4,
                    scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                }}
            >
                <div className="py-4 px-4 h-[12%] flex items-center justify-between border-b border-neutral-600">
                    <div className="relative">
                        <button 
                            className="text-neutral-500 bg-zinc-700 flex items-center justify-center text-sm w-[34px] h-[34px] rounded-lg border-[1px] border-neutral-600" 
                            onMouseEnter={() => setEntered((e) => !e)}
                        >
                            🤖
                        </button>
                        <AddressContexts state={entered} />
                    </div>
                    <h2 className="text-neutral-500">Neptume</h2>
                    <button 
                        className="text-neutral-500 bg-zinc-700 p-1 px-[10px] rounded-lg border-[1px] border-neutral-600" 
                        onClick={() => handleClose()}
                    >
                        ✖
                    </button>
                </div>
                <Messages color={color} secondary={secondary} />
                <Recommendations />
                <Input color={color} />
            </motion.div>
        </motion.div>
    );
}