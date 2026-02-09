"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateDocumentation(repoId: number, content: string) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
      throw new Error("User is not authenticated");
    }

    const server_url = process.env.SERVER_URL;
    const res = await fetch(`${server_url}/api/repository/analysis/${repoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ readme: content }),
    });

    if (!res.ok) {
      throw new Error("Failed to update backend");
    }

    revalidatePath("/documentation");

    return { success: true };
  } catch (error) {
    console.error("Update Action Error:", error);
    return { success: false, error: "Failed to save changes." };
  }
}
