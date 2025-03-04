import { motion } from 'framer-motion';

// Base set of chains
const chains = [
  { logo: '/optimism.svg' },
  { logo: '/polygon.svg' },
  { logo: '/avalanche.svg' },
  { logo: '/arbitrum.svg' },
  { logo: '/worldchain.svg' },
];

// Create a much longer array by repeating the chains multiple times
const infiniteChains = Array(45).fill(chains).flat();

export default function SupportedChains() {
  return (
    <section className="flex flex-col justify-bottom py-0 overflow-hidden">
      <div className="max-w-[1600px] mx-auto mb-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-lg tracking-wider font-medium mb-0 text-white">
            Supported Chains
          </h2>
        </motion.div>
      </div>

      {/* Scrolling Container */}
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-100%"] }} // Moves left infinitely
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 100, // Adjust speed here
          }}
          style={{ display: "flex" }}
        >
          {infiniteChains.map((chain, index) => (
            <div
              key={index}
              className="inline-flex flex-shrink-0 mx-10"
              style={{ transform: "translateZ(0)" }}
            >
              <div className="w-32 h-32 relative flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity duration-300">
                <img
                  src={chain.logo}
                  alt="Chain logo"
                  width={128}
                  height={128}
                  className="object-contain"
                  style={{
                    filter: "brightness(0) invert(1)",
                    transform: "translateZ(0)",
                  }}
                />
              </div>
            </div>
          ))}
          {/* Duplicate the images again to ensure smooth looping */}
          {infiniteChains.map((chain, index) => (
            <div
              key={`duplicate-${index}`}
              className="inline-flex flex-shrink-0 mx-10"
              style={{ transform: "translateZ(0)" }}
            >
              <div className="w-32 h-32 relative flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity duration-300">
                <img
                  src={chain.logo}
                  alt="Chain logo"
                  width={128}
                  height={128}
                  className="object-contain"
                  style={{
                    filter: "brightness(0) invert(1)",
                    transform: "translateZ(0)",
                  }}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
