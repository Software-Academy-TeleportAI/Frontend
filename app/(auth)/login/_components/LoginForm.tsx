"use client";
import { NeonInput } from "@/components/NeonInput";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { Mail, Lock, Loader2 } from "lucide-react";
import AuthenticateFlow from "@/flows/autheticate";

export default function LoginForm() {
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
      const data = await AuthenticateFlow.login(email, password);

      if (!data.token) {
        throw new Error("No token returned from server");
      }

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
  );
}
