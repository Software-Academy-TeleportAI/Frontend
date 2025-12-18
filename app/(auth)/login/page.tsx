"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Fingerprint, Loader2, AlertCircle } from "lucide-react";
import { NeonInput } from "@/components/NeonInput";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Authentication failed");

      // 2. Save Token to Cookie (Expires in 7 days)
      // Assuming Laravel returns { token: "..." }
      Cookies.set("auth_token", data.token, { expires: 7, secure: true });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

      <div className="text-center mb-8">
        <div className="inline-flex justify-center items-center w-12 h-12 rounded-xl bg-cyan-500/10 mb-4 text-cyan-400">
          <Fingerprint className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-wide">
          Welcome Back
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Enter your credentials to access the grid.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <NeonInput
          type="email"
          placeholder="email@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-5 h-5" />}
          required
        />
        <NeonInput
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-5 h-5" />}
          required
        />

        <button
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "AUTHENTICATE"
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-500">
        New to the network?{" "}
        <Link
          href="/register"
          className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
        >
          Initialize ID
        </Link>
      </div>
    </motion.div>
  );
}
