import Header from "../pagedesignmarketingsite/Moneo/src/components/Header";
import Hero from "../pagedesignmarketingsite/Moneo/src/components/Hero";
import Features from "../pagedesignmarketingsite/Moneo/src/components/Features";
import SupportedChains from "../pagedesignmarketingsite/Moneo/src/components/SupportedChains";
import Footer from "../pagedesignmarketingsite/Moneo/src/components/Footer";
import BackgroundLines from "../pagedesignmarketingsite/Moneo/src/components/BackgroundLines";
import "./globals.css";
import "./hero.css"

export default function Home() {
  return (
    <div lang="en" className="font-sans antialiased">
      <BackgroundLines />
      <div id="heroGradient" className="hero-gradient" />
      <main className="bg-zinc-950">
        <Header />
        <Hero />
        <SupportedChains />
        <Features />
        <Footer />
      </main>
    </div>
  );
}

