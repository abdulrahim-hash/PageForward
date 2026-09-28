"use client";

import { FormEvent, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function AdminLoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")).trim().toLowerCase();
    const client = createBrowserSupabaseClient();

    if (!client) {
      setError("Supabase is not configured for this deployment.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await client.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
        shouldCreateUser: false,
      },
    });

    if (signInError) {
      setError("We couldn’t send a sign-in link. Check the email and try again.");
      setLoading(false);
      return;
    }

    setSentTo(email);
    setLoading(false);
  }

  if (sentTo) {
    return (
      <div className="admin-login-form">
        <p className="safety-copy" role="status">
          Check <strong>{sentTo}</strong> for a secure one-time sign-in link. The link expires automatically.
        </p>
      </div>
    );
  }

  return (
    <form className="admin-login-form" onSubmit={submit}>
      <label>
        Approved admin email
        <input type="email" name="email" required autoComplete="email" />
      </label>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="button" type="submit" disabled={loading}>
        {loading ? "Sending…" : "Email me a sign-in link"}<span>→</span>
      </button>
    </form>
  );
}
