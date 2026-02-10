"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteDocument } from "../actions/delete";

interface DeleteDocButtonProps {
  id: number;
}

export default function DeleteDocButton({ id }: DeleteDocButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleConfirmDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteDocument(id);

        if (result?.error) {
          showToast("error", result.error);
          setShowConfirm(false);
        } else {
          showToast("success", "Documentation deleted successfully.");
          setShowConfirm(false);
        }
      } catch (e) {
        showToast("error", "An unexpected error occurred.");
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded text-xs font-mono transition-all disabled:opacity-50"
        title="Delete Documentation"
      >
        {isPending ? (
          <Loader2 key="loader" className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Trash2 key="trash" className="w-3.5 h-3.5" />
        )}
        DELETE
      </button>

      <AnimatePresence mode="wait">
        {showConfirm && (
          <div
            key="delete-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-sm bg-slate-900 border border-red-500/30 rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-white mb-1">
                      Confirm Deletion
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Permanently remove this documentation? Data cannot be
                      recovered.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/50 p-3 flex justify-end gap-2 border-t border-white/5">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isPending}
                  className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded transition-colors disabled:opacity-50"
                >
                  {isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  {isPending ? "..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {toast && (
          <motion.div
            key="delete-toast"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className={`
              fixed bottom-6 right-6 z-[60] flex items-center gap-2 px-4 py-2 rounded-lg border shadow-xl backdrop-blur-md
              ${
                toast.type === "success"
                  ? "bg-slate-900/90 border-green-500/30 text-green-400"
                  : "bg-slate-900/90 border-red-500/30 text-red-400"
              }
            `}
          >
            {toast.type === "success" ? (
              <Loader2 className="w-3 h-3 text-green-400 animate-spin" />
            ) : (
              <AlertTriangle className="w-3 h-3 text-red-400" />
            )}
            <span className="text-xs font-bold">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
