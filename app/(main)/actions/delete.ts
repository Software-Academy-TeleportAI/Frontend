"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteDocument(id: number) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
      throw new Error("User is not authenticated");
    }

    const server_url = process.env.SERVER_URL;
    const res = await fetch(`${server_url}/api/repository/analysis/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete from backend");
    }

    revalidatePath("/documentation");
  } catch (error) {
    console.error("Delete Action Error:", error);
    return { error: "Failed to delete documentation." };
  }

  redirect("/documentation");
}
