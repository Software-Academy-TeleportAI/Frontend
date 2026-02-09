"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteDocument } from "../actions/delete";

interface DeleteDocButtonProps {
  id: number;
}

export default function DeleteDocButton({ id }: DeleteDocButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this documentation?",
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await deleteDocument(id);

      if (result?.error) {
        alert(result.error);
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded text-xs font-mono transition-all disabled:opacity-50"
      title="Delete Documentation"
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
      DELETE
    </button>
  );
}
