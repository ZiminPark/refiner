import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GoogleSignInButton } from "./google-sign-in-button";

interface LoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const [{ data: { session } }, params] = await Promise.all([
    supabase.auth.getSession(),
    searchParams,
  ]);
  const messageParam = params.message;
  const message =
    typeof messageParam === "string"
      ? messageParam
      : Array.isArray(messageParam)
        ? messageParam[0]
        : undefined;

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 py-16">
      <div className="mx-auto w-full max-w-md space-y-10">
        <div className="space-y-3 text-center">
          <p className="font-sans text-xs uppercase tracking-[0.28em] text-secondary">
            Welcome back
          </p>
          <h1 className="text-[2.5rem] font-light leading-tight text-foreground">
            Sign in to continue
          </h1>
          <p className="text-base leading-relaxed text-secondary">
            Connect with your Google account to resume refining your English.
          </p>
        </div>

        {message ? (
          <div className="rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {message}
          </div>
        ) : null}

        <div className="rounded-sm border border-border bg-card/70 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}
