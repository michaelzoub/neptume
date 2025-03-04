import Header from "./extras/Header";
import Hero from "./extras/Hero";
import Features from "./extras/Features";
import SupportedChains from "./extras/SupportedChains";
import Footer from "./extras/Footer";
import BackgroundLines from "./extras/BackgroundLines";
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

