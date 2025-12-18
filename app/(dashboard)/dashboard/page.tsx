"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Key, RefreshCw, Cpu } from "lucide-react";
import { RepoCard } from "@/components/RepoCard";
import { NeonInput } from "@/components/NeonInput";

// Mock Data
const MOCK_REPOS = [
  {
    id: 1,
    name: "neural-network-v2",
    description: "Deep learning implementation in Node.js",
    language: "TypeScript",
    stars: 124,
  },
  {
    id: 2,
    name: "crypto-bot-alpha",
    description: "High frequency trading bot for crypto markets",
    language: "Python",
    stars: 89,
  },
  {
    id: 3,
    name: "nextjs-starter-kit",
    description: "Production ready boilerplate for Next.js 16",
    language: "TypeScript",
    stars: 450,
  },
  {
    id: 4,
    name: "legacy-systems-wrapper",
    description: "API wrapper for mainframe connections",
    language: "Java",
    stars: 12,
  },
];

export default function DashboardPage() {
  const [token, setToken] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("token", token);

    if (token) setIsConnected(true);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Command Center</h1>
          <p className="text-slate-400">
            Manage your repositories and generate documentation.
          </p>
        </div>

        {/* Token Status / Input */}
        {!isConnected ? (
          <form
            onSubmit={handleConnect}
            className="flex gap-2 w-full md:w-auto"
          >
            <div className="w-64">
              <NeonInput
                type="password"
                placeholder="ghp_xxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                icon={<Key className="w-4 h-4" />}
              />
            </div>
            <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-cyan-900/20">
              Link GitHub
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400 text-sm font-medium">
              Neural Link Active
            </span>
            <button
              onClick={() => setIsConnected(false)}
              className="ml-2 text-slate-500 hover:text-white"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Main Content State */}
      {!isConnected ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 shadow-[0_0_50px_-10px_rgba(8,145,178,0.2)]">
            <Cpu className="w-10 h-10 text-slate-600" />
          </div>
          <div className="max-w-md">
            <h3 className="text-xl font-semibold text-white mb-2">
              Awaiting Access Token
            </h3>
            <p className="text-slate-400">
              To begin the analysis, please provide your GitHub Personal Access
              Token. We require read-only access to scan your repository
              structures.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-cyan-500 rounded-full" />
              Available Repositories
            </h2>
            <div className="w-64">
              <NeonInput
                placeholder="Filter modules..."
                icon={<Search className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_REPOS.map((repo, i) => (
              <RepoCard key={repo.id} {...repo} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
