export default function Navbar() {

    return (
        <header className=" flex flex-row fixed w-full px-[5%] h-[80px] justify-between items-center">
            <div>
                <h1 className="text-2xl font-semibold text-[#00CC96]">Neptume</h1>
            </div>
            <div className="flex flex-row gap-20 text-sm text-gray">
                <h2>About</h2>
                <h2>Docs</h2>
                <h2>Pricing</h2>
            </div>
        </header>
    )
}