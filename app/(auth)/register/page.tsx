import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import RegisterForm from "./_components/RegisterForm";
import AuthCardWrapper from "../_components/AuthCardWrapper";

export default function RegisterPage() {
  return (
    <AuthCardWrapper className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

      <div className="text-center mb-8">
        <div className="inline-flex justify-center items-center w-12 h-12 rounded-xl bg-purple-500/10 mb-4 text-purple-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-wide">
          Create Identity
        </h2>
        <p className="text-slate-400 text-sm mt-1">Join the secure network.</p>
      </div>

      <RegisterForm />

      <div className="mt-8 text-center text-sm text-slate-500">
        Already registered?{" "}
        <Link
          href="/login"
          className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
        >
          Access Log
        </Link>
      </div>
    </AuthCardWrapper>
  );
}
