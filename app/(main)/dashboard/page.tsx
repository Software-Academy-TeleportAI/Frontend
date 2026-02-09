import { cookies } from "next/headers";
import DashboardPage from "../_components/DashboardPage";

async function getRepos(token: string) {
  try {
    const response = await fetch(
      "https://api.github.com/user/repos?sort=updated&per_page=10",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch repos");
    }

    return await response.json();
  } catch (error) {
    console.error("GitHub Fetch Error:", error);
    return null;
  }
}

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("github_token")?.value;

  let repos = [];
  let error = "";

  if (token) {
    const data = await getRepos(token);
    if (data) {
      repos = data;
    } else {
      error = "Invalid token or connection error. Please reconnect.";
    }
  }

  return (
    <main className="w-full">
      <DashboardPage
        isConnected={!!token && !error}
        repos={repos}
        error={error}
      />
    </main>
  );
}
