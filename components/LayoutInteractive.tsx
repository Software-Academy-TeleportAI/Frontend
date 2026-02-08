"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Github,
  Settings,
  LogOut,
  TerminalSquare,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: TerminalSquare, label: "Documentation", href: "/documentation" },
  { icon: Settings, label: "Config", href: "/settings" },
];

interface LayoutInteractiveProps {
  children: React.ReactNode;
  user: any;
}

export default function LayoutInteractive({
  children,
  user,
}: LayoutInteractiveProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    Cookies.remove("auth_token");
    router.push("/login");
  };

  const NavContent = () => (
    <>
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-8 h-8 rounded bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
          <Github className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg tracking-wider text-white">
          GIT_SYNTH
        </span>
      </div>

      <div className="px-4 pt-4">
        <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
          <p className="text-xs text-cyan-400 font-medium mb-0.5">
            Welcome back,
          </p>
          <p className="text-sm text-slate-200 font-semibold truncate">
            {user?.first_name || "User"}
          </p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${isActive ? "animate-pulse" : ""}`}
                />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_currentColor]"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Disconnect</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#030014] overflow-hidden">
      <aside className="hidden md:flex w-64 bg-slate-950/50 backdrop-blur-xl border-r border-white/5 flex-col relative z-20">
        <NavContent />
      </aside>

      <div className="flex-1 flex flex-col h-full relative">
        <header className="md:hidden h-16 border-b border-white/10 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 z-30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
              <Github className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-md tracking-wider text-white">
              GIT_SYNTH
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 relative overflow-y-auto">
          <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
            <div className="absolute top-[-10%] right-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/10 rounded-full blur-[80px] md:blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-600/10 rounded-full blur-[80px] md:blur-[120px]" />
          </div>
          <div className="relative z-10 w-full max-w-7xl mx-auto p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-[#0B0F17] border-r border-white/10 z-50 md:hidden flex flex-col shadow-2xl"
            >
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
