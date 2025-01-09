import Navbar from "../navbar"
import StarBackground from "./stars"
import Combined from "../mainchat/combined"
import OpenSign from "../mainchat/openSign"

export default function Marketing({color, secondary}: {color: string, secondary: string}) {

    return (
        <main className="w-full min-h-screen bg-neutral-900 text-white">
            <Navbar></Navbar>
            <StarBackground />
            <div className="z-100 flex flex-col w-full pt-[80px] mx-auto md:w-[90%]">
                <section className="w-full h-fit flex flex-col gap-2 justify-center">
                    
                </section>
                <section className="z-100 mt-20 flex flex-col md:flex-row gap-10 justify-center md:justify-between">
                    <div className="flex flex-col w-full md:w-[45%] p-4 gap-2">
                        <h2 className="rounded-full py-1 px-4 bg-neutral-800 border-[1px] border-neutral-700 w-fit text-gray text-sm text-neutral-500">Neptume V.0 ⌖</h2>
                        <h2 className="text-4xl font-bold">Meet Neptume</h2>
                        <h2 className="w-full md:w-[350px] text-">Personal AI assistant revolutionizing the way we interact with wallets. Swap, transfer and modify wallet settings in seconds.</h2>
                        <button className="w-full md:w-[350px] py-2 text-white font-semibold rounded-lg mt-10"
                            style={{
                                backgroundColor: `${color}`
                            }}
                        >Try it for free →</button>
                    </div>
                    <div className="z-100 flex w-full justify-center md:w-[55%] text-center">
                        <OpenSign color={color}  />
                        <Combined color={color} secondary={secondary}></Combined>
                    </div>
                </section>
            </div>
        </main>
    )
}