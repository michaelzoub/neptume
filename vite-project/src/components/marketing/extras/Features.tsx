

import { motion, useScroll, useTransform } from "framer-motion";

const features = [
  {
    id: "wallet-management-feature",
    title: "Manage your wallet",
    description: "Your AI assistant for managing crypto. Ask questions, perform actions, and get insights instantly.",
    video: "/videos/chat-demo.mp4",
  },
  {
    id: "batch-transactions-feature", 
    title: "Batch Transactions",
    description: "Swap multiple tokens at once. No more tedious individual transactions.",
    video: "/videos/batch-demo.mp4",
  },
  {
    id: "smart-analysis-feature",
    title: "Smart Analysis", 
    description: "Get real-time insights into your portfolio and trading patterns.",
    video: "/videos/analysis-demo.mp4",
  }
];

export default function Features() {
  const { scrollY } = useScroll();
  const featureGradientOpacity = useTransform(
    scrollY,
    [0, window.innerHeight, window.innerHeight * 2, window.innerHeight * 3],
    [0, 1, 1, 0]
  );

  return (
    <section id="features" className="hidden py-24 relative">
      <motion.div 
        className="feature-gradient"
        style={{ opacity: featureGradientOpacity }}
      />

      <div className="max-w-[1600px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-24"
        >
          <div className="inline-block">
            <motion.span 
              className="inline-block px-4 py-1 text-sm font-medium text-[#31ef90]"
            >
              POWERED BY AI
            </motion.span>
            <motion.h2 
              className="text-5xl md:text-6xl font-semibold text-white mb-6"
              whileInView={{
                textShadow: [
                  "0 0 0px rgba(255,255,255,0)",
                  "0 0 10px rgba(255,255,255,0.3)",
                  "0 0 0px rgba(255,255,255,0)"
                ]
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                delay: 0.2
              }}
            >
              Game-Changing Features
            </motion.h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Discover the powerful features that make NeptuneAI your ultimate crypto companion
            </p>
          </div>
        </motion.div>

        <div className="space-y-32">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex items-center gap-16"
            >
              <div className="flex-1">
                <div className="space-y-4 mb-8">
                  <h3 className="text-4xl font-bold">{feature.title}</h3>
                </div>
                <p className="text-gray-400 text-lg mb-6">{feature.description}</p>
              </div>
              
              <div className="flex-1">
                <div className="w-[400px] h-[480px] glass-darker rounded-2xl overflow-hidden">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src={feature.video} type="video/mp4" />
                  </video>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 