import { useAtom, atom } from "jotai"
import { useState } from "react"
import { motion } from "framer-motion"
import { openState, rotateState, scaleState, translateState } from "../../atoms/opensign"

export default function OpenSign({color}: {color: string}) {
    const [open, setOpen] = useAtom(openState)
    const [rotate, setRotate] = useAtom(rotateState)
    const [scale, setScale] = useAtom(scaleState)
    const [translate, setTranslate] = useAtom(translateState)

    console.log(open)

    function handleClick() {
        setRotate(true)
        setTimeout(() => {
            setScale(true)
            //setRotate(false)
        }, 100)
        setTimeout(() => {
            setTranslate(true)
            setOpen((e) => !e)
        }, 400)
    }

    //on click, animate the span (rotate 3/4 circle around it)

    return (
        <motion.div className={`mt-20 absolute w-fit h-fit mx-auto my-auto`}>
        <motion.button 
            className={`absoute z-[100] h-10 w-10 mx-auto rounded-full bg-neutral-300/20 flex items-center justify-center hover:bg-[${color}]/30 focus:outline-none focus-visible:outline-none outline-none border-none focus:ring-0 focus:ring-offset-0`} 
            onClick={() => handleClick()}
            style={{
                top: "200px",
                left: "50%",
                transform: "translateX(-50%)",
            }}
            animate={{
                translateY: translate ? 700 : 0,
                opacity: translate ? 0 : 1,
            }}
            transition={{ duration: 1, ease: "easeInOut", type: "spring", stiffness: 100 }}
        >
            <motion.div className={`absolute w-full h-full border-2 border-transparent border-t-[${color}] border-r-[${color}] rounded-full -z-10`}
                style={{
                    borderTopColor: `${color}`, // Dynamic top border color
                    borderRightColor: `${color}`, // Dynamic right border color
                }}
                animate={{ 
                    rotate: (rotate ? 360 : 0),
                    scale: scale ? 1 : 1,
                    opacity: (rotate ? 1 : 0),
                 }}
                transition={{ duration: 0.4, ease: "linear", delay: (rotate ? 0 : 0.4), }}
                initial={{ rotate: 0, opacity: 0 }}
            ></motion.div>
            <span className="text-pink-500 text-xl duration-200 ease-in-out z-10 m-2"
                style={{
                    color: `${color}`
                }}
            >+</span>
        </motion.button>
        </motion.div>
    )
}