"use client";

import { useState, useEffect, useRef } from "react";
import {
  FileText,
  Save,
  Edit2,
  X,
  CheckCircle,
  AlertCircle,
  Download,
  Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

interface ReadmeEditorProps {
  initialContent: string;
  repoId: number;
  authToken: string;
}

type NotificationState = {
  show: boolean;
  type: "success" | "error";
  message: string;
};

export default function ReadmeEditor({
  initialContent,
  repoId,
  authToken,
}: ReadmeEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const showMessage = (type: "success" | "error", message: string) => {
    setNotification({ show: true, type, message });
  };

  const handleDownloadPdf = async () => {
    if (!contentRef.current) return;
    setIsDownloading(true);

    try {
      const dataUrl = await toPng(contentRef.current, {
        quality: 0.95,
        backgroundColor: "#0B0F17",
      });

      const imgProps = new Image();
      imgProps.src = dataUrl;

      await new Promise((resolve) => (imgProps.onload = resolve));

      const pdfWidth = imgProps.width;
      const pdfHeight = imgProps.height;

      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
        unit: "px",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Documentation-${repoId}.pdf`);

      showMessage("success", "PDF downloaded successfully.");
    } catch (error) {
      console.error("PDF generation failed:", error);
      showMessage("error", "Failed to generate PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/repository/analysis/${repoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
          },
          body: JSON.stringify({ readme: content }),
        },
      );

      if (!res.ok) throw new Error("Failed to save");

      setIsEditing(false);
      showMessage("success", "Documentation updated successfully.");
    } catch (error) {
      console.error(error);
      showMessage("error", "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#0B0F17] border border-white/10 rounded-xl overflow-hidden shadow-lg min-h-[800px] flex flex-col relative">
      {notification.show && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-2xl backdrop-blur-md ${
              notification.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                : "bg-red-500/10 border-red-500/50 text-red-400"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
            <button
              onClick={() =>
                setNotification((prev) => ({ ...prev, show: false }))
              }
              className="ml-2 hover:opacity-70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center justify-between sticky top-0 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <h2 className="font-semibold text-slate-200">Full Documentation</h2>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 rounded text-xs font-medium transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 rounded text-xs font-medium transition-all group disabled:opacity-50 disabled:cursor-wait"
                title="Download as PDF"
              >
                {isDownloading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5 group-hover:text-cyan-400 transition-colors" />
                )}
                PDF
              </button>

              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 rounded text-xs font-medium transition-all"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 relative">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full min-h-[800px] bg-[#0B0F17] text-slate-300 p-8 font-mono text-sm focus:outline-none resize-none"
            spellCheck={false}
          />
        ) : (
          <div ref={contentRef} className="p-8 bg-[#0B0F17]">
            <article
              className="prose prose-invert prose-slate max-w-none 
              prose-headings:text-slate-100 prose-headings:font-semibold
              prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-8 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2
              prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
              prose-code:text-cyan-200 prose-code:bg-slate-800/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-slate-900 prose-pre:border prose-pre:border-white/10
              prose-blockquote:border-l-cyan-500 prose-blockquote:bg-slate-800/30 prose-blockquote:py-1 prose-blockquote:not-italic
            "
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </article>
          </div>
        )}
      </div>
    </div>
  );
}
