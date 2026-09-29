import "server-only";
import { hasSupabaseConfig } from "@merodin/auth";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./server";

export type CurrentUser = {
  id: string;
  email?: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!hasSupabaseConfig()) return null;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  const subject = data?.claims?.sub;
  if (error || !data || typeof subject !== "string") return null;
  const email = data.claims.email;
  return {
    id: subject,
    ...(typeof email === "string" ? { email } : {}),
  };
}

export async function requireCurrentUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/my");
  return user;
}
