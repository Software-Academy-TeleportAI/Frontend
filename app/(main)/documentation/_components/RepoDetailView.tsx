"use client";

import { useState, useEffect } from "react";
import {
  Bot,
  FileText,
  Terminal,
  ArrowLeft,
  Zap,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import mermaid from "mermaid";
import RefreshCw from "./IconHelper";
import ModeSelector from "./ModeSelector";
import GenerationFlowEntity from "@/flows/generation";
import MermaidDiagram from "./MermaidDiagram";
import { saveAnalysis } from "../actions/saveAnalysis";

if (typeof window !== "undefined") {
  mermaid.initialize({ startOnLoad: false, theme: "dark" });
}

interface RepoDetailViewProps {
  repo: {
    id: string;
    name: string;
    description: string;
    language: string;
    stars: number;
    lastUpdated: string;
    branch: string;
    html_url: string;
  };
  authToken: string;
}

interface JobResult {
  summary: string;
  architecture_diagram: string;
  files: any[];
  readme: string;
}

type NotificationState = {
  type: "success" | "error";
  message: string;
} | null;

export default function RepoDetailView({
  repo,
  authToken,
}: RepoDetailViewProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [isTechnical, setIsTechnical] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [jobId, setJobId] = useState<number | null>(null);
  const [result, setResult] = useState<JobResult | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [notification, setNotification] = useState<NotificationState>(null);
  const [isSaving, setIsSaving] = useState(false);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });

    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleGenerate = async (isTechnical: boolean) => {
    setIsGenerating(true);
    setLogs((prev) => [...prev, "> Initializing connection to Neural Core..."]);

    const data = {
      repo_url: repo.html_url,
      repo_name: repo.name,
    };

    try {
      const data = {
        repo_url: repo.html_url,
        repo_name: repo.name,
        tehnical: isTechnical,
        authToken: authToken,
      };

      const responseData =
        await GenerationFlowEntity.generateRepositoryAnalysis(data);

      const { job_id } = responseData;
      setJobId(job_id);
      setLogs((prev) => [...prev, `> Job #${job_id} queued successfully.`]);
    } catch (error) {
      console.error(error);
      setLogs((prev) => [...prev, "> ❌ Error: Failed to contact backend."]);
      setIsGenerating(false);
      showNotification("error", "Failed to contact backend system.");
    }
  };

  const checkHandler = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    if (!jobId) return;

    const poll = setInterval(async () => {
      try {
        const responseData = await GenerationFlowEntity.generateStatus({
          jobId: jobId.toString(),
          authToken: authToken,
        });
        const status = responseData.status;

        if (status === "pending") {
          setLogs((prev) => {
            if (
              prev[prev.length - 1] ===
              "> System is analyzing repository structure..."
            )
              return prev;
            return [...prev, "> System is analyzing repository structure..."];
          });
        } else if (status === "completed") {
          setLogs((prev) => [
            ...prev,
            "> ✅ Analysis Complete. Rendering Output.",
          ]);

          setResult(responseData.result);
          setIsGenerating(false);
          setJobId(null);
        } else if (status === "failed") {
          setLogs((prev) => [...prev, "> ❌ Job failed on server side."]);
          setIsGenerating(false);
          setJobId(null);
          showNotification("error", "Analysis job failed.");
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 3000);

    setPollingInterval(poll);

    return () => clearInterval(poll);
  }, [jobId]);

  const handleSaveAnalysis = async () => {
    if (!result) return;
    setIsSaving(true);

    try {
      const payload = {
        repo_id: repo.id,
        repo_name: repo.name,
        summary: result.summary,
        architecture_diagram: result.architecture_diagram,
        readme: result.readme,
        files: result.files,
      };

      const response = await saveAnalysis(payload);

      if (!response.success) {
        throw new Error(response.error);
      }

      showNotification("success", "Analysis successfully saved to database.");
    } catch (error) {
      console.error("Failed to save analysis:", error);
      showNotification("error", "Failed to save data. Check logs.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`
              fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl border shadow-2xl backdrop-blur-md
              ${
                notification.type === "success"
                  ? "bg-slate-900/90 border-green-500/30 text-green-400 shadow-[0_0_30px_rgba(74,222,128,0.1)]"
                  : "bg-slate-900/90 border-red-500/30 text-red-400 shadow-[0_0_30px_rgba(248,113,113,0.1)]"
              }
            `}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <XCircle className="w-6 h-6" />
            )}
            <div className="flex flex-col">
              <span className="font-bold text-sm uppercase tracking-wider">
                {notification.type === "success"
                  ? "System Success"
                  : "System Error"}
              </span>
              <span className="text-sm text-slate-300">
                {notification.message}
              </span>
            </div>

            <button
              onClick={() => setNotification(null)}
              className="ml-4 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <XCircle className="w-4 h-4 opacity-50" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <Link
        href="/dashboard"
        className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition-colors gap-2 text-sm mb-4 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Command Center
      </Link>

      <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">{repo.name}</h1>
          <p className="text-slate-400">{repo.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-xl p-6 shadow-2xl">
            <h2 className="text-white font-semibold flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-cyan-400" />
              Generator Controls
            </h2>

            <p className="text-sm text-slate-400 mb-6">
              Select output complexity and initiate parsing.
            </p>

            <ModeSelector
              isTechnical={isTechnical}
              setIsTechnical={setIsTechnical}
            />

            <div className="flex items-center gap-3 mb-6 p-3 rounded bg-white/5 border border-white/5">
              <input
                type="checkbox"
                id="checkbox"
                checked={isChecked}
                onChange={checkHandler}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500/50 focus:ring-offset-0"
              />
              <label
                htmlFor="checkbox"
                className="text-sm text-slate-300 cursor-pointer select-none"
              >
                Authorization granted for codebase analysis
              </label>
            </div>

            <button
              onClick={() => handleGenerate(isTechnical)}
              disabled={isGenerating || !!result || !isChecked}
              className={`w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all relative overflow-hidden group border ${
                isGenerating || result || !isChecked
                  ? "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed"
                  : "bg-cyan-900/20 border-cyan-500/50 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]"
              }`}
            >
              {isGenerating ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : result ? (
                <>Analysis Complete</>
              ) : (
                <>
                  <Zap className="w-5 h-5 group-hover:text-yellow-300 transition-colors" />
                  Initialize {isTechnical ? "Deep" : "Surface"} Scan
                </>
              )}
            </button>
            {result && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleSaveAnalysis}
                  disabled={isSaving}
                  className={`
        flex items-center gap-2 py-2 px-6 rounded-lg font-medium transition-all
        border
        ${
          isSaving
            ? "bg-purple-900/10 border-purple-500/20 text-purple-500/50 cursor-not-allowed"
            : "bg-purple-900/20 border-purple-500/50 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
        }
      `}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>Save Analysis</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-[#0c0c14] border border-white/10 rounded-xl overflow-hidden flex flex-col min-h-[500px] shadow-2xl">
            <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-mono text-slate-400">
                  system_output.log
                </span>
              </div>
              {result && (
                <div
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${
                    isTechnical
                      ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                      : "bg-green-500/10 border-green-500/30 text-green-400"
                  }`}
                >
                  Mode: {isTechnical ? "Architecture_View" : "Executive_View"}
                </div>
              )}
            </div>

            <div className="p-6 font-mono text-sm overflow-y-auto flex-1 max-h-[600px] custom-scrollbar">
              {!result && (
                <div className="space-y-2 mb-6">
                  {logs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-cyan-400/80 font-mono"
                    >
                      <span className="opacity-50 mr-2">
                        [{new Date().toLocaleTimeString()}]
                      </span>
                      {log}
                    </motion.div>
                  ))}
                  {isGenerating && (
                    <div className="text-cyan-500 animate-pulse">_</div>
                  )}
                </div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  {isTechnical ? (
                    <>
                      <div className="border border-purple-500/20 bg-purple-900/10 p-4 rounded-lg">
                        <h2 className="text-xl text-purple-400 mb-2 font-bold">
                          System Architecture
                        </h2>
                        <p className="text-slate-300 mb-4">{result.summary}</p>
                      </div>

                      {result.architecture_diagram && (
                        <div className="border border-white/10 rounded-lg overflow-hidden">
                          <div className="bg-white/5 px-4 py-2 text-xs font-mono text-slate-400 border-b border-white/5">
                            Architecture Diagram
                          </div>
                          <MermaidDiagram code={result.architecture_diagram} />
                        </div>
                      )}

                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {result.readme}
                        </ReactMarkdown>
                      </div>
                    </>
                  ) : (
                    <div className="bg-slate-900 p-8 rounded-lg border border-white/5 text-center space-y-6">
                      <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                        <FileText className="w-8 h-8 text-green-400" />
                      </div>
                      <h2 className="text-2xl text-white font-light">
                        Project Executive Summary
                      </h2>
                      <>
                        <div className="border border-purple-500/20 bg-purple-900/10 p-4 rounded-lg">
                          <h2 className="text-xl text-purple-400 mb-2 font-bold">
                            System Architecture
                          </h2>
                          <p className="text-slate-300 mb-4">
                            {result.summary}
                          </p>
                        </div>

                        {result.architecture_diagram && (
                          <div className="border border-white/10 rounded-lg overflow-hidden">
                            <div className="bg-white/5 px-4 py-2 text-xs font-mono text-slate-400 border-b border-white/5">
                              Architecture Diagram
                            </div>
                            <MermaidDiagram
                              code={result.architecture_diagram}
                            />
                          </div>
                        )}

                        <div className="prose prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {result.readme}
                          </ReactMarkdown>
                        </div>
                      </>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
