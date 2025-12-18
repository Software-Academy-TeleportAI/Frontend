"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, Globe, Zap } from "lucide-react";

export default function WelcomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Grid Animation */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="z-10 w-full max-w-5xl px-5 text-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          Teleport your projects to the next dimension
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-cyan-500 tracking-tight mb-6"
        >
          ARCHITECT THE <br /> FUTURE
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10"
        >
          Experience the next generation of web architecture. Built with React
          Server Components, high-velocity animations, and a seamless
          glassmorphic UI.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/register">
            <button className="group relative px-8 py-3 rounded-lg bg-cyan-600 text-white font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(8,145,178,0.5)]">
              <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12" />
              <span className="relative flex items-center gap-2">
                Register <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </Link>

          <Link href="/login">
            <button className="px-8 py-3 rounded-lg border border-slate-700 text-slate-300 font-medium hover:bg-slate-800/50 hover:text-white transition-all backdrop-blur-sm">
              Login
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Floating Features (Decorative) */}
      <div className="absolute bottom-10 w-full flex justify-center gap-12 text-slate-600 opacity-40">
        <Cpu className="w-8 h-8 animate-pulse" />
        <Globe className="w-8 h-8 animate-pulse delay-75" />
        <Zap className="w-8 h-8 animate-pulse delay-150" />
      </div>
    </main>
  );
}
