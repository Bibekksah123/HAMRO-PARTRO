"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.replace("/my");
        router.refresh();
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/my`,
        },
      });
      if (signUpError) throw signUpError;
      if (data.session) {
        router.replace("/my");
        router.refresh();
        return;
      }
      setMessage("Check your email to confirm your account, then sign in.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "We could not complete that request. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function continueWithGoogle() {
    setBusy(true);
    setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/my`,
        },
      });
      if (oauthError) throw oauthError;
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Google sign in is unavailable right now.",
      );
      setBusy(false);
    }
  }

  const signingUp = mode === "signup";
  return (
    <section className="auth-card" aria-labelledby="auth-title">
      <p className="section-kicker">Your personal tools</p>
      <h1 id="auth-title">
        {signingUp ? "Create your MeroDin account" : "Welcome back"}
      </h1>
      <p className="auth-description">
        {signingUp
          ? "Sign up to keep your expenses, reminders, and notes in sync."
          : "Sign in to open your personal MeroDin space."}
      </p>
      <form className="auth-form" onSubmit={submit}>
        {signingUp && (
          <label>
            Name <span>(optional)</span>
            <input
              autoComplete="name"
              onChange={(event) => setName(event.target.value)}
              value={name}
            />
          </label>
        )}
        <label>
          Email address
          <input
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>
        <label>
          Password
          <input
            autoComplete={signingUp ? "new-password" : "current-password"}
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
          {signingUp && <small>Use at least 8 characters.</small>}
        </label>
        <button className="convert-button" disabled={busy} type="submit">
          {busy ? "Please wait…" : signingUp ? "Create account" : "Sign in"}
          <span aria-hidden="true">→</span>
        </button>
      </form>
      <div className="auth-divider">
        <span>or</span>
      </div>
      <button
        className="auth-google-button"
        disabled={busy}
        onClick={continueWithGoogle}
        type="button"
      >
        Continue with Google
      </button>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="auth-success" role="status">
          {message}
        </p>
      )}
      <p className="auth-switch">
        {signingUp ? "Already have an account?" : "New to MeroDin?"}{" "}
        <Link href={signingUp ? "/login" : "/signup"}>
          {signingUp ? "Sign in" : "Create an account"}
        </Link>
      </p>
      <p className="auth-privacy">
        Your personal data is private to your account. Public tools work without
        signing in.
      </p>
    </section>
  );
}
