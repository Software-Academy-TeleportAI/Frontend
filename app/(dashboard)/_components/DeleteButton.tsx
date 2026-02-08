"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteDocButtonProps {
  id: number;
  authToken: string;
}

export default function DeleteDocButton({
  id,
  authToken,
}: DeleteDocButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this documentation?",
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch(
        `http://localhost:8000/api/repository/analysis/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
          },
        },
      );

      if (!res.ok) throw new Error("Failed to delete");

      router.push("/documentation");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete documentation.");
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded text-xs font-mono transition-all disabled:opacity-50"
      title="Delete Documentation"
    >
      {isDeleting ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
      DELETE
    </button>
  );
}
