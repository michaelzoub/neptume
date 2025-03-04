
import { Link } from "react-router-dom";
import { useScrollDirection } from "./hooks/useScrollDirection";
import ConnectWalletButton from "../../wallet/connectPrompt";

export default function Header() {
  const scrollDirection = useScrollDirection();
  const mainColor = "#00CC96";

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
    }`}>
      <nav className="max-w-[1600px] mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="relative w-48 h-12">
            <img
              src="/neptume.png"
              alt="Neptume AI"
              className="object-contain w-full h-full"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="#features" className="text-white/80 hover:text-white transition-colors">
              Features
            </Link>
            <Link to="#" className="text-white/80 hover:text-white transition-colors">
              Documentation
            </Link>
            <Link to="#" className="text-white/80 hover:text-white transition-colors">
              Community
            </Link>
          </div>

          {/* Connect Wallet Button */}
          <ConnectWalletButton color={mainColor}></ConnectWalletButton>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2">
            <svg 
              className="w-6 h-6 text-white"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}