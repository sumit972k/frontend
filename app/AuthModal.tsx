"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "./supabase";
import { useRouter } from "next/navigation";

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setMessage("");
      setShowPassword(false);
      setIsSignUp(false);
    }
  }, [isOpen]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage("Account created! Logging you in...");
        setTimeout(() => {
          onClose();
          router.push("/dashboard");
        }, 1500);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage("Successfully logged in!");
        setTimeout(() => {
          onClose();
          router.push("/dashboard");
        }, 1000);
      }
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-8 z-[101] shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">{isSignUp ? "Create Account" : "Welcome Back"}</h2>
            <p className="text-gray-400 text-sm mb-6">{isSignUp ? "Join your campus network." : "Sign in to continue."}</p>

            <form className="space-y-4" onSubmit={handleAuth}>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">College Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" required autoComplete="off" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="new-password" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors mt-2 disabled:opacity-50">
                {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button onClick={() => { setIsSignUp(!isSignUp); setMessage(""); }} className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
            </div>

            {message && <p className="mt-4 text-sm text-center text-purple-400 bg-purple-400/10 py-2 rounded-lg">{message}</p>}

            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">✕</button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}