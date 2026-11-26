"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import MagneticButton from "./MagneticButton";
import AuthModal from "./AuthModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mouse tracking for the background glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Grid Pattern (Depth) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Interactive Background Glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none"
        style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%" }}
      />

      {/* Top Left Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-3 z-20">
        <img src="/logo.png" alt="Aeris Logo" className="w-10 h-10 object-contain" />
        <span className="text-2xl font-bold tracking-widest uppercase">Aeris</span>
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-3xl">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm text-gray-300"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Private Beta is Live
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter"
        >
          Connect beyond <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 animate-gradient">
            the ordinary.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed"
        >
          The private, encrypted social network built for real connections. No noise. No tracking. Just you and your circle.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
        >
          <MagneticButton variant="primary" onClick={() => setIsModalOpen(true)}>
            Get Started
          </MagneticButton>
          <MagneticButton variant="secondary" onClick={() => setIsModalOpen(true)}>
            Sign In
          </MagneticButton>
        </motion.div>
        
      </div>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}