import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Create an account",
  description: "Create a MeroDin account for expenses, reminders, and notes.",
  noIndex: true,
});

export default function SignupPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page-shell auth-page">
        <AuthForm mode="signup" />
      </main>
      <SiteFooter />
    </>
  );
}
