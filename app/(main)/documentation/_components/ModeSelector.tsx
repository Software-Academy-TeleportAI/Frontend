import React from "react";
import { motion } from "framer-motion";
import { FileText, Code2 } from "lucide-react"; // Assuming you use lucide-react

const ModeSelector = ({ isTechnical, setIsTechnical }: any) => {
  return (
    <div className="bg-slate-950 p-1 rounded-lg border border-white/10 flex relative w-full mb-6">
      <motion.div
        className="absolute top-1 bottom-1 rounded-md bg-cyan-900/30 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)] z-0"
        initial={false}
        animate={{
          x: isTechnical ? "100%" : "0%",
          width: "50%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      <button
        onClick={() => setIsTechnical(false)}
        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium relative z-10 transition-colors duration-200 ${
          !isTechnical ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"
        }`}
      >
        <FileText className="w-4 h-4" />
        Executive
      </button>

      <button
        onClick={() => setIsTechnical(true)}
        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium relative z-10 transition-colors duration-200 ${
          isTechnical ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"
        }`}
      >
        <Code2 className="w-4 h-4" />
        Technical
      </button>
    </div>
  );
};

export default ModeSelector;
