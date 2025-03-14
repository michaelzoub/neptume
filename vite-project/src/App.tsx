import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { PrivyProvider } from '@privy-io/react-auth'
import { base, polygon, mainnet, optimism, avalanche, worldchain, arbitrum, sepolia, baseSepolia} from 'viem/chains'
import CheckoutPage from './components/marketing/checkout'
import CompletePage from './components/payment/CompletePage'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Home from './components/marketing/combined'
import { apiEndpoint } from './data/apiEndpoint'
//
const stripePromise = loadStripe("pk_test_51Q2bQIGE5A9UAgyNu086KZ7FhBZf5FY14qzqcOOIHpfRGWyv3s42PpQt2vEFxD0npnIdtq1YyRMfT8xCKhcSXoZB00oxrKwmuE");

const MainPage = () =>  
      <PrivyProvider
        appId="cm5hc8qro0ec3l1zrv6xwfx99" 
        config={{
          defaultChain: base,
          supportedChains: [base, polygon, mainnet, optimism, avalanche, worldchain, arbitrum, sepolia, baseSepolia] 
      }}
      >
        <Home />
    </PrivyProvider>


function App() {

    const [clientSecret, setClientSecret] = useState("");
  
    useEffect(() => {
      const createPaymentIntent = async () => {
        const response = await fetch(`${apiEndpoint}/create-payment-intent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: [{ id: "Subscription", amount: 1 }] }),
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      };
    
      createPaymentIntent();
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
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/complete" element={<CompletePage />} />
        <Route path="/mainpage" element={<MainPage />}></Route>
      </Routes>
      </Elements>)}
    </Router>
  )
}

export default App
