import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Sign in",
  description: "Sign in to your MeroDin personal space.",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page-shell auth-page">
        <AuthForm mode="login" />
      </main>
      <SiteFooter />
    </>
  );
}
