"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

interface SaveAnalysisPayload {
  repo_id: string;
  repo_name: string;
  summary: string;
  architecture_diagram: string;
  readme: string;
  files: any[];
}

export async function saveAnalysis(payload: SaveAnalysisPayload) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  if (!authToken) {
    throw new Error("User is not authenticated");
  }

  try {
    const serverUrl = process.env.SERVER_URL;
    const response = await fetch(`${serverUrl}/api/repository/analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Backend Error: ${response.statusText}`);
    }

    const data = await response.json();

    revalidatePath("/dashboard");

    return { success: true, data };
  } catch (error) {
    console.error("Save Analysis Action Error:", error);
    return { success: false, error: "Failed to save analysis to backend." };
  }
}
