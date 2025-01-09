import { useState } from 'react'
import './App.css'
import Combined from './components/mainchat/combined'
import OpenSign from './components/mainchat/openSign'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Marketing from './components/marketing/combined'
import ConnectWalletButton from './components/wallet/connectPrompt'
import { PrivyProvider } from '@privy-io/react-auth'
import Modal from './components/modal'
import { base, polygon, mainnet, optimism, avalanche, worldchain, arbitrum, sepolia, baseSepolia} from 'viem/chains'

const mainColor = "#00CC96"
const secondaryColor = "#00CC96"

const Comb = () => <main className='flex w-full h-screen overflow-hidden justify-center items-center'>
      <PrivyProvider
      appId="cm5hc8qro0ec3l1zrv6xwfx99" 
      config={{
        defaultChain: base,
        supportedChains: [base, polygon, mainnet, optimism, avalanche, worldchain, arbitrum, sepolia, baseSepolia] 
    }}
    >
      <Modal color={mainColor} />
      <ConnectWalletButton color={mainColor} />
      <OpenSign color={mainColor}  />
      <Combined color={mainColor} secondary={secondaryColor} />
    </PrivyProvider>
</main>


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/test" element={<Marketing color={mainColor} secondary={secondaryColor} />} />
        <Route path="/" element={<Comb></Comb>}></Route>
      </Routes>
    </Router>
  )
}

export default App
