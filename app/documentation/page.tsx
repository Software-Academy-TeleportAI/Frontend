import Link from "next/link";
import {
  Book,
  Database,
  ArrowRight,
  Clock,
  FileCode,
  Search,
  AlertCircle,
} from "lucide-react";
import { NeonInput } from "@/components/NeonInput";

async function getGeneratedDocs() {
  const MOCK_DOCS = [
    {
      id: "neural-network-v2",
      title: "neural-network-v2",
      version: "v1.0.4",
      language: "TypeScript",
      generatedAt: "2 hrs ago",
      modules: 12,
      size: "1.4 MB",
    },
    {
      id: "crypto-bot-alpha",
      title: "crypto-bot-alpha",
      version: "v0.9.2",
      language: "Python",
      generatedAt: "1 day ago",
      modules: 8,
      size: "890 KB",
    },
  ];

  return MOCK_DOCS;
}

export default async function DocumentationPage() {
  const docs = await getGeneratedDocs();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Book className="w-8 h-8 text-cyan-500" />
            Neural Archives
          </h1>
          <p className="text-slate-400">
            Access and manage previously generated technical documentation.
          </p>
        </div>

        {docs.length > 0 && (
          <div className="w-full md:w-64">
            <NeonInput
              placeholder="Search archives..."
              icon={<Search className="w-4 h-4" />}
            />
          </div>
        )}
      </div>

      {docs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <DocCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/20">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05),transparent_70%)]" />

      <div className="relative z-10 space-y-6 max-w-lg mx-auto px-4">
        <div className="w-24 h-24 bg-slate-900/50 rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_30px_-5px_rgba(6,182,212,0.15)] mx-auto">
          <Database className="w-10 h-10 text-slate-600" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">
            Memory Banks Empty
          </h3>
          <p className="text-slate-400 leading-relaxed">
            No documentation has been synthesized yet. Navigate to the Command
            Center to select a repository and initiate the generation sequence.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-lg transition-all hover:scale-105 active:scale-95"
          >
            <ArrowRight className="w-4 h-4" />
            Go to Command Center
          </Link>
        </div>
      </div>
    </div>
  );
}

function DocCard({ doc }: { doc: any }) {
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
