import { motion, useScroll, useTransform } from "framer-motion";
import { useGradientScroll } from "./hooks/useGradientScroll";
import { useEffect } from 'react';
import Combined from "../../mainchat/combined";
import OpenSign from "../../mainchat/openSign";
import { useAtom } from "jotai";
import { openState } from "../../../atoms/opensign";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const mainColor = "#00CC96";
  const secondaryColor = "#00CC96";
  useGradientScroll();
  const { scrollY } = useScroll();

  const navigate = useNavigate();
  function navigatePaymentPage() {
    navigate("/checkout")
  }

  const [open] = useAtom(openState);
  
  // Different fade points for mobile and desktop
  const fadeOutPoint = typeof window !== 'undefined' ? 
    window.innerWidth < 768 ? 800 : 600 : 600;
  
  // Update the transform ranges
  const titleOpacity = useTransform(scrollY, [0, fadeOutPoint], [1, 0]);
  const walletOpacity = useTransform(scrollY, [0, fadeOutPoint], [1, 0]);

  useEffect(() => {
    const handleResize = () => {
      const newFadePoint = window.innerWidth < 768 ? 500 : 300;
      titleOpacity.set(window.scrollY > newFadePoint ? 0 : 1);
      walletOpacity.set(window.scrollY > newFadePoint ? 0 : 1);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [titleOpacity, walletOpacity]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="flex items-start px-4 relative pt-16 md:pt-20 lg:pt-24 mb-20 lg:mb-0">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-24 lg:gap-16 relative z-10">
          {/* Left side - Text content */}
          <motion.div 
            className="flex-1 max-w-[600px] w-full flex flex-col space-y-6 text-center lg:text-left z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="space-y-6">
              <motion.h1 
                variants={itemVariants}
                className="text-zinc-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium leading-[1.1]"
              >
                <span className="inline-flex gap-4">
                Your <span className="text-[#31efb6]">wallet,</span>
                </span>
                <br/>
                supercharged
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto lg:mx-0"
              >
                Experience seamless crypto management across multiple chains. 
                Trade, swap, and manage your assets with AI-powered intelligence.
              </motion.p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center lg:justify-start pt-4 gap-4 mb-24 lg:mb-0"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#31efb6] px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl font-medium text-[#011826] shadow-lg shadow-[#31efb6]/10 hover:shadow-xl hover:shadow-[#31efb6]/20 hover:bg-[#31efb6]/90 transition-all duration-200"
                onClick={navigatePaymentPage}
              >
                Get Started
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 sm:px-10 py-3.5 bg-zinc-800 sm:py-4 rounded-2xl font-medium text-white border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-200"
              >
                Join Community
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right side - Wallet Demo */}
          <div className="flex-1 relative flex justify-center items-center w-full lg:justify-end mt-8 lg:mt-0 min-h-[600px]">
            <div className={`relative w-full max-w-[400px] h-[460px] rounded-2xl border-zinc-700 transition ease-in-out delay-150 ${open ? "border-[0px]" : "border-[1px]"}`}>
              <OpenSign color={mainColor} />
              <Combined color={mainColor} secondary={secondaryColor} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}