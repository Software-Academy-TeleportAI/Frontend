"use client";

import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";
import { Download, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

const MermaidDiagram = ({ code }: { code: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [elementId, setElementId] = useState<string>("");
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    setElementId(`mermaid-svg-${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMaximized) {
        setIsMaximized(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMaximized]);

  useEffect(() => {
    if (!elementId || !ref.current || !code) return;

    const renderDiagram = async () => {
      try {
        const cleanCode = code
          .replace(/^```mermaid/, "")
          .replace(/^```/, "")
          .replace(/```$/, "")
          .trim();

        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          fontFamily: "monospace",
        });

        const { svg } = await mermaid.render(elementId, cleanCode);
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
        setRenderError(null);
      } catch (error: any) {
        console.error("Mermaid Render Error:", error);
        setRenderError(error.message || "Invalid Mermaid Syntax");
      }
    };

    const raf = requestAnimationFrame(() => renderDiagram());
    return () => cancelAnimationFrame(raf);
  }, [code, elementId]);

  const handleDownloadPdf = async () => {
    if (!containerRef.current) return;
    setIsDownloading(true);

    try {
      const dataUrl = await toPng(containerRef.current, {
        backgroundColor: "#0f172a",
        quality: 1.0,
        pixelRatio: 2,
      });

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const ratio = Math.min(
        pdfWidth / imgProps.width,
        pdfHeight / imgProps.height,
      );

      const width = imgProps.width * ratio;
      const height = imgProps.height * ratio;

      const x = (pdfWidth - width) / 2;
      const y = (pdfHeight - height) / 2;

      pdf.addImage(dataUrl, "PNG", x, y, width, height);
      pdf.save("architecture-diagram.pdf");
    } catch (err) {
      console.error("Failed to download PDF", err);
      alert("Failed to generate PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!elementId) {
    return (
      <div className="w-full h-32 flex items-center justify-center bg-slate-800/50 rounded animate-pulse">
        <span className="text-slate-500 text-xs">Initializing diagram...</span>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center w-full transition-all duration-300 ${
        isMaximized
          ? "fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-8"
          : "relative group"
      }`}
    >
      {renderError ? (
        <div className="text-red-400 text-xs font-mono bg-red-900/20 p-2 rounded border border-red-900/50 w-full">
          Error: {renderError}
        </div>
      ) : (
        <div
          className={`
            relative transition-all duration-300 border border-white/5 rounded bg-slate-800/50
            ${isMaximized ? "w-full h-full shadow-2xl bg-[#0f172a] overflow-hidden flex flex-col" : "w-full"}
          `}
        >
          <div
            className={`
            absolute top-2 right-2 z-10 flex gap-2
            ${!isMaximized ? "opacity-0 group-hover:opacity-100 transition-opacity" : "opacity-100"}
          `}
          >
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="p-2 bg-slate-900/80 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/50 rounded-lg transition-all backdrop-blur-sm"
              title="Download as PDF"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-2 bg-slate-900/80 hover:bg-purple-500/20 text-slate-400 hover:text-purple-400 border border-white/10 hover:border-purple-500/50 rounded-lg transition-all backdrop-blur-sm"
              title={isMaximized ? "Minimize" : "Maximize"}
            >
              {isMaximized ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>

          <div
            ref={containerRef}
            className={`
              w-full flex justify-center p-6 overflow-auto
              ${isMaximized ? "h-full items-center custom-scrollbar" : "overflow-x-auto"}
            `}
          >
            <div ref={ref} className="mermaid" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MermaidDiagram;
