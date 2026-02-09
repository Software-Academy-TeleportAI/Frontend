// app/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { WelcomeHero } from "@/components/WelcomeHero";
import { validateToken } from "@/lib/auth";

export default async function LandingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (token) {
    const isValid = await validateToken(token);

    if (isValid) {
      redirect("/dashboard");
    } else {
      // 🟢 FIX: If token exists but is invalid, DELETE IT.
      // This prevents the user from being "logged in" with a bad token.
      cookieStore.delete("auth_token");
    }
  }

  return <WelcomeHero />;
}
