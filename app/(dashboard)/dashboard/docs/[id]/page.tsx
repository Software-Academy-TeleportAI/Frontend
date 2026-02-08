import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import {
  ArrowLeft,
  Calendar,
  Layers,
  LayoutTemplate,
  Terminal,
} from "lucide-react";
import MermaidDiagram from "@/app/documentation/_components/MermaidDiagram";
import ReadmeEditor from "@/app/(dashboard)/_components/ReadmeEditor";
import DeleteDocButton from "@/app/(dashboard)/_components/DeleteButton";

interface AnalysisData {
  id: number;
  repo_name: string;
  repository_id: number;
  summary: string;
  architecture_diagram: string;
  readme: string;
  files: any;
  created_at: string;
}

async function getAnalysis(id: string): Promise<AnalysisData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  try {
    const res = await fetch(
      `http://localhost:8000/api/repository/analysis/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export default async function DocDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = await getAnalysis(id);

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    notFound();
  }

  if (!doc) {
    return notFound();
  }

  const date = new Date(doc.created_at).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      <div className="space-y-4">
        <Link
          href="/documentation"
          className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition-colors gap-2 text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Archives
        </Link>

        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-8 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                  {doc.repo_name || `Repository #${doc.repository_id}`}
                </h1>
                <div className="flex items-center gap-4 text-slate-400 text-sm font-mono">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-500" />
                    Generated on {date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-500" />
                    ID: {doc.id}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono">
                  STATUS: ARCHIVED
                </div>
                <DeleteDocButton id={doc.id} authToken={token} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {doc.architecture_diagram && (
          <div className="bg-[#0B0F17] border border-white/10 rounded-xl overflow-hidden shadow-lg">
            <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <h2 className="font-semibold text-slate-200">
                System Architecture
              </h2>
            </div>
            <div className="p-4 bg-slate-900/50 min-h-[300px] flex items-center justify-center">
              <MermaidDiagram code={doc.architecture_diagram} />
            </div>
          </div>
        )}
        <div className="w-full">
          <ReadmeEditor
            initialContent={doc.readme}
            repoId={doc.id}
            authToken={(await cookies()).get("auth_token")?.value || ""}
          />
        </div>
        <div className="bg-[#0B0F17] border border-white/10 rounded-xl overflow-hidden shadow-lg">
          <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-cyan-400" />
            <h2 className="font-semibold text-slate-200">Executive Summary</h2>
          </div>
          <div className="p-8 text-slate-300 leading-relaxed text-base">
            {doc.summary}
          </div>
        </div>
      </div>
    </div>
  );
}
