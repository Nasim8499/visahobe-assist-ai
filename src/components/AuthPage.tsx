import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { AIOrb } from "@/components/AIOrb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const AuthPage = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name.trim() || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created — welcome!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("Google sign-in failed");
        setBusy(false);
        return;
      }
      if (result.redirected) return;
    } catch {
      toast.error("Google sign-in failed");
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-background px-4 font-sans">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-grid opacity-50" />
      <div className="pointer-events-none absolute inset-x-0 top-10 -z-10 mx-auto h-80 w-80 rounded-full opacity-40 blur-3xl orb" />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center text-center">
          <AIOrb size={72} />
          <h1 className="mt-5 font-display text-2xl font-bold tracking-tight">
            VisaHOBe <span className="text-gradient">AI</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin" ? "Sign in to your workspace" : "Create your workspace account"}
          </p>
        </div>

        <div className="gradient-border neon-shadow mt-6 rounded-3xl">
          <div className="space-y-3 rounded-3xl bg-card/80 p-5 backdrop-blur-xl">
            <form onSubmit={handleEmail} className="space-y-3">
              {mode === "signup" && (
                <Input
                  placeholder="Display name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              )}
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
              />
              <Button
                type="submit"
                disabled={busy}
                className="w-full bg-gradient-to-r from-cyan via-blue to-violet text-primary-foreground shadow-md hover:opacity-95"
              >
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "signin" ? "Sign in" : "Create account"}
              </Button>
            </form>

            <div className="relative py-1 text-center">
              <span className="bg-card px-2 text-xs text-muted-foreground">or</span>
              <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogle}
              disabled={busy}
              className="w-full gap-2"
            >
              <GoogleIcon /> Continue with Google
            </Button>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "No account yet?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="font-medium text-primary hover:underline"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
  </svg>
);
