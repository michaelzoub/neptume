import { useState, useEffect } from 'react'
import './App.css'
import Combined from './components/mainchat/combined'
import OpenSign from './components/mainchat/openSign'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Marketing from './components/marketing/combined'
import ConnectWalletButton from './components/wallet/connectPrompt'
import { PrivyProvider } from '@privy-io/react-auth'
import Modal from './components/modal'
import { base, polygon, mainnet, optimism, avalanche, worldchain, arbitrum, sepolia, baseSepolia} from 'viem/chains'
import { Link } from 'react-router-dom'
import CheckoutForm from './components/payment/CheckoutForm'
import CompletePage from './components/payment/CompletePage'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51Q2bQIGE5A9UAgyNu086KZ7FhBZf5FY14qzqcOOIHpfRGWyv3s42PpQt2vEFxD0npnIdtq1YyRMfT8xCKhcSXoZB00oxrKwmuE");

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

    const [clientSecret, setClientSecret] = useState("");
  
    useEffect(() => {
      // Create PaymentIntent as soon as the page loads
      fetch("http://localhost:8080/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ id: "Subscription", amount: 1 }] }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }, []);
  
    const appearance = {
      theme: 'stripe' as const,
    };
    // Enable the skeleton loader UI for optimal loading.
    const loader = 'auto';

  return (
    <Router>
      {clientSecret && (
      <Elements options={{clientSecret, appearance, loader}} stripe={stripePromise}>
      <Routes>
        <Route path="/" element={<Comb></Comb>}></Route>
        <Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/complete" element={<CompletePage />} />
      </Routes>
      </Elements>)}
    </Router>
  )
}

export default App
