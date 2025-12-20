"use client";
import { NeonInput } from "@/components/NeonInput";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { Mail, Lock, Loader2, User } from "lucide-react";

export default function RegisterForm() {
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
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <NeonInput
          type="text"
          placeholder="First Name"
          icon={<User className="w-5 h-5" />}
        />
        <NeonInput type="text" placeholder="Last Name" />
      </div>

      <NeonInput
        type="email"
        placeholder="email@domain.com"
        icon={<Mail className="w-5 h-5" />}
      />

      <NeonInput
        type="password"
        placeholder="Set Password"
        icon={<Lock className="w-5 h-5" />}
      />

      <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all duration-300 transform hover:-translate-y-0.5">
        ESTABLISH LINK
      </button>
    </form>
  );
}
