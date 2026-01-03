"use client";
import { NeonInput } from "@/components/NeonInput";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { Mail, Lock, Loader2, User } from "lucide-react";
import AuthenticateFlow from "@/flows/autheticate";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await AuthenticateFlow.register(formData);

      if (!data.token) {
        throw new Error("No token returned from server");
      }

      // 3. Success: Save Token & Redirect
      // Note: Ensure your Laravel controller returns a 'token' field
      Cookies.set("auth_token", data.token, { expires: 7 });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <NeonInput
          onChange={handleFormChange}
          name="firstName"
          type="text"
          placeholder="First Name"
          icon={<User className="w-5 h-5" />}
          value={formData.firstName}
        />
        <NeonInput
          onChange={handleFormChange}
          name="lastName"
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
        />
      </div>

      <NeonInput
        onChange={handleFormChange}
        name="email"
        type="email"
        placeholder="email@domain.com"
        icon={<Mail className="w-5 h-5" />}
        value={formData.email}
      />

      <NeonInput
        onChange={handleFormChange}
        name="password"
        type="password"
        placeholder="Set Password"
        icon={<Lock className="w-5 h-5" />}
        value={formData.password}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            PROCESSING...
          </>
        ) : (
          "ESTABLISH LINK"
        )}
      </button>
    </form>
  );
}
