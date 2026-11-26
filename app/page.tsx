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
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Interactive Background Glow */}
      <motion.div
        className="absolute w-[800px] h-[800px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      <div className="relative z-10 text-center space-y-8 max-w-2xl">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm text-gray-300">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Version 1.0 is live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Welcome to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            College Connect
          </span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl">
          Your private, encrypted campus network. Connect with professors, share research, and join your department groups.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <MagneticButton variant="primary" onClick={() => setIsModalOpen(true)}>
            Sign In
          </MagneticButton>
          <MagneticButton variant="secondary" onClick={() => setIsModalOpen(true)}>
            Create Account
          </MagneticButton>
        </div>
        
      </div>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}