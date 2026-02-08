import { ArrowRight, Clock, Database, FileCode } from "lucide-react";
import Link from "next/link";

export default function DocCard({ doc }: { doc: any }) {
  return (
    <Link
      href={`/dashboard/docs/${doc.id}`}
      className="group relative bg-slate-900/40 border border-white/10 hover:border-cyan-500/30 rounded-xl p-5 transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.15)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-slate-800 rounded-lg border border-white/5 group-hover:border-cyan-500/20 transition-colors">
            <FileCode className="w-6 h-6 text-slate-400 group-hover:text-cyan-400" />
          </div>
          <span className="px-2 py-1 rounded text-xs font-mono bg-white/5 text-slate-400 border border-white/5">
            {doc.version}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors truncate">
          {doc.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-500/50" />
          {doc.language}
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/5 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            {doc.generatedAt}
          </div>
          <div className="flex items-center gap-2 justify-end">
            <Database className="w-3.5 h-3.5" />
            {doc.size}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 text-xs font-medium text-cyan-600/0 group-hover:text-cyan-400 transition-all transform translate-y-2 group-hover:translate-y-0">
          <span>View Documentation</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}
