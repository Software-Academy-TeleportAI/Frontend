import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import RepoDetailView from "../_components/RepoDetailView";

interface GithubRepo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  default_branch: string;
  owner: {
    login: string;
  };
}

async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("github_token")?.value;
  if (!token) return null;
  return token;
}

async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  return token;
}

async function getRepoData(idOrName: string): Promise<GithubRepo | null> {
  const token = await getToken();

  if (!token) return null;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };

  if (!isNaN(Number(idOrName))) {
    const res = await fetch(`https://api.github.com/repositories/${idOrName}`, {
      headers,
      next: { revalidate: 60 },
    });
    return res.ok ? res.json() : null;
  }

  const userRes = await fetch("https://api.github.com/user", { headers });
  if (!userRes.ok) return null;
  const user = await userRes.json();

  const repoRes = await fetch(
    `https://api.github.com/repos/${user.login}/${idOrName}`,
    {
      headers,
      next: { revalidate: 60 },
    },
  );

  if (!repoRes.ok) return null;
  return repoRes.json();
}

export default async function DocumentationRepoIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getToken();
  const auth_token = await getAuthToken();

  if (!token || !auth_token) {
    redirect("/dashboard");
  }

  const repoData = await getRepoData(id);

  if (!repoData) {
    return notFound();
  }

  const formattedRepo = {
    id: String(repoData.id),
    name: repoData.name,
    description: repoData.description || "No description provided.",
    language: repoData.language || "Plain Text",
    stars: repoData.stargazers_count,
    lastUpdated: new Date(repoData.updated_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    branch: repoData.default_branch,
    html_url: repoData.html_url,
  };

  return (
    <div className="max-w-6xl mx-auto">
      <RepoDetailView repo={formattedRepo} authToken={auth_token} />
    </div>
  );
}
