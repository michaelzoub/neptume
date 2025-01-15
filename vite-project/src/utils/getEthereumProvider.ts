export async function getEthereumProvider(walletsHook: any) {
    if (walletsHook == "") {
        const insideWallet = localStorage.getItem("wallet")
        const parsed = JSON.parse(insideWallet || "null")
        console.log(parsed)
        return {
            wallet: insideWallet,
            provider: parsed
        }
    }
    const walleth = walletsHook[0]; // Replace this with your desired wallet
    const provider = await walleth.getEthereumProvider()
    //set wallet as wallet atom:
    return {
        wallet: walleth,
        provider: provider
    }

}