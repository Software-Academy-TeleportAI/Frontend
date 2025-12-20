import Link from "next/link";
import { Fingerprint } from "lucide-react";
import LoginForm from "./_components/LoginForm";
import AuthCardWrapper from "../_components/AuthCardWrapper";

export default function LoginPage() {
  return (
    <AuthCardWrapper className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
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

      <LoginForm />

      <div className="mt-8 text-center text-sm text-slate-500">
        New to the network?{" "}
        <Link
          href="/register"
          className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
        >
          Initialize ID
        </Link>
      </div>
    </AuthCardWrapper>
  );
}
