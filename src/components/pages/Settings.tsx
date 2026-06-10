import { PageWrap } from "@/components/pages/ChatHistory";
import { useTheme } from "@/contexts/ThemeContext";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const tones = ["Professional", "Warm", "Bold", "Friendly", "Concise"];

export const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { resetDemo } = useApp();
  const [tone, setTone] = useState(tones[0]);

  return (
    <PageWrap title="Settings" subtitle="Personalize VisaHOBe AI.">
      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display font-semibold">Theme</h2>
          <p className="mt-1 text-xs text-muted-foreground">Switch between light and dark mode.</p>
          <div className="mt-4 flex gap-2">
            <Button variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" /> Light
            </Button>
            <Button variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" /> Dark
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display font-semibold">Brand Tone</h2>
          <p className="mt-1 text-xs text-muted-foreground">Tone the AI uses when writing for VisaHOBe.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {tones.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                  (tone === t
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:bg-accent")
                }
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
          <h2 className="font-display font-semibold text-destructive">Reset Demo Data</h2>
          <p className="mt-1 text-xs text-muted-foreground">Clears chats, prompts and API keys from this device.</p>
          <Button
            variant="destructive"
            className="mt-4"
            onClick={() => { resetDemo(); toast.success("Demo data reset"); }}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </section>
      </div>
    </PageWrap>
  );
};
