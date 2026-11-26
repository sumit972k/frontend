"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MagneticButton({ 
  children, 
  className, 
  variant = "primary",
  ...props 
}: { 
  children: React.ReactNode, 
  className?: string, 
  variant?: "primary" | "secondary",
  onClick?: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
    setMousePosition({ x: clientX - left, y: clientY - top });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const baseClass = "relative px-8 py-3 rounded-full font-semibold transition-colors overflow-hidden cursor-pointer";
  const styles = variant === "primary" 
    ? "bg-white text-black hover:text-black" 
    : "bg-white/10 border border-white/20 backdrop-blur-md text-white";

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClass} ${styles} ${className}`}
      {...props}
    >
      {isHovered && (
        <motion.div
          className="absolute pointer-events-none w-24 h-24 rounded-full blur-xl"
          style={{
            background: variant === "primary" ? "rgba(168, 85, 247, 0.4)" : "rgba(168, 85, 247, 0.6)",
            left: mousePosition.x - 48,
            top: mousePosition.y - 48,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}