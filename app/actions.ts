"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function saveToken(formData: FormData) {
  const token = formData.get("token") as string;
  const cookieStore = await cookies();

  const authToken = cookieStore.get("auth_token")?.value;

  if (!authToken) {
    throw new Error("User is not authenticated");
  }

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  if (token) {
    const res = await fetch(`${serverUrl}/api/user/github_access_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        access_token: token,
      }),
    });

    const data = await res.json();

    if (data.error) {
      throw new Error(data.error);
    }

    cookieStore.set("github_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    revalidatePath("/");
  }
}

export async function removeToken() {
  const cookieStore = await cookies();
  cookieStore.delete("github_token");
  revalidatePath("/");
}

export async function removeAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  revalidatePath("/");
}
