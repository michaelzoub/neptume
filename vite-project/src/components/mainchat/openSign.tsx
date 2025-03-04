import { useAtom } from "jotai";
import { motion } from "framer-motion";
import { openState, rotateState, scaleState, translateState } from "../../atoms/opensign";

export default function OpenSign({color}: {color: string}) {
    const [, setOpen] = useAtom(openState);
    const [rotate, setRotate] = useAtom(rotateState);
    const [scale, setScale] = useAtom(scaleState);
    const [translate, setTranslate] = useAtom(translateState);

    function handleClick() {
        setRotate(true);
        setTimeout(() => {
            setScale(true);
        }, 100);
        setTimeout(() => {
            setTranslate(true);
            setOpen((e) => !e);
        }, 400);
    }

    return (
        <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.button 
                className="h-10 w-10 rounded-full bg-neutral-300/20 flex items-center justify-center hover:bg-neutral-300/30 focus:outline-none focus-visible:outline-none outline-none border-none focus:ring-0 focus:ring-offset-0" 
                onClick={() => handleClick()}
                animate={{
                    translateY: translate ? 700 : 0,
                    opacity: translate ? 0 : 1,
                }}
                transition={{ duration: 1, ease: "easeInOut", type: "spring", stiffness: 100 }}
                style={{
                    backgroundColor: translate ? 'transparent' : `${color}30`,
                }}
            >
                <motion.div 
                    className="absolute w-full h-full border-2 border-transparent rounded-full -z-10"
                    style={{
                        borderTopColor: color,
                        borderRightColor: color,
                    }}
                    animate={{ 
                        rotate: (rotate ? 360 : 0),
                        scale: scale ? 1 : 1,
                        opacity: (rotate ? 1 : 0),
                    }}
                    transition={{ duration: 0.4, ease: "linear", delay: (rotate ? 0 : 0.4) }}
                    initial={{ rotate: 0, opacity: 0 }}
                />
                <span 
                    className="flex text-xl duration-200 ease-in-out z-10 items-center justify-center"
                    style={{ color: color }}
                >+</span>
            </motion.button>
        </motion.div>
    );
}