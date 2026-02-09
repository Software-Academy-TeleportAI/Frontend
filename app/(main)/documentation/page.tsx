import { cookies } from "next/headers";
import { Book, Search } from "lucide-react";
import { NeonInput } from "@/components/NeonInput";
import DocCard from "./_components/DocCard";
import Link from "next/link";

const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

async function getGeneratedDocs() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    console.warn("No auth token found in cookies");
    return [];
  }

  const serverUrl = process.env.SERVER_URL;

  try {
    const res = await fetch(`${serverUrl}/api/repository/analysis`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch docs:", res.statusText);
      return [];
    }

    const data = await res.json();

    return data.map((item: any) => {
      const sizeInBytes =
        (item.readme?.length || 0) + (item.summary?.length || 0);

      const fileCount = item.files
        ? typeof item.files === "string"
          ? JSON.parse(item.files).length
          : Object.keys(item.files).length
        : 0;

      return {
        id: item.id,
        title: item.repo_name || `Repository #${item.repository_id}`,
        version: "v1.0.0",
        language: "Multi-Language",
        generatedAt: new Date(item.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        modules: fileCount,
        size: formatSize(sizeInBytes),
      };
    });
  } catch (error) {
    console.error("Error fetching docs:", error);
    return [];
  }
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
        <div
          style={{
            fontSize: "1.25rem",
            color: "#94a3b8",
            height: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              alignItems: "center",
            }}
          >
            <span>No documentation available</span>
            <Link
              href="/dashboard"
              className="ml-2 text-cyan-400 hover:underline"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc: any) => (
            <DocCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
