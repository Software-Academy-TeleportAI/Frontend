"use client";

import { motion } from "framer-motion";
import { Star, FileText } from "lucide-react";
import Link from "next/link";

interface RepoProps {
  id: number;
  name: string;
  description: string;
  language: string;
  stars: number;
}

export const RepoCard = ({
  id,
  name,
  description,
  language,
  stars,
}: RepoProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-slate-950/40 backdrop-blur-md border border-white/5 rounded-xl p-6 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(8,145,178,0.3)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-white group-hover:text-cyan-400 transition-colors">
              {name}
            </h3>
          </div>
          <span className="flex items-center gap-1 text-xs font-mono text-slate-500 bg-slate-900/50 px-2 py-1 rounded">
            <Star className="w-3 h-3 text-yellow-500" /> {stars}
          </span>
        </div>

        <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span
              className={`w-2 h-2 rounded-full ${
                language === "TypeScript"
                  ? "bg-blue-400"
                  : language === "Python"
                    ? "bg-yellow-400"
                    : "bg-green-400"
              }`}
            />
            {language}
          </div>
          <Link href={`/documentation/${id}`}>
            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white border border-cyan-500/20 transition-colors">
              View Docs
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
