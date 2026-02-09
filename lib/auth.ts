import "server-only";

export async function validateToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

    const res = await fetch(`${apiUrl}/api/user/auth_token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },

      cache: "no-store",
    });

    return res.ok;
  } catch (error) {
    console.error("Auth validation failed:", error);
    return false;
  }
}
