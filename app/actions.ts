"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function saveToken(formData: FormData) {
  const token = formData.get("token") as string;

  if (token) {
    const cookieStore = await cookies();
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
