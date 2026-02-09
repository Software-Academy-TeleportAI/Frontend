import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LayoutInteractive from "@/components/LayoutInteractive";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  try {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const res = await fetch(`${serverUrl}/api/user`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });
    return res.ok ? await res.json() : null;
  } catch (error) {
    return null;
  }
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <LayoutInteractive user={user}>{children}</LayoutInteractive>;
}
