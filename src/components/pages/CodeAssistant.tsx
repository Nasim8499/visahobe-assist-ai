import { useState } from "react";
import { PageWrap } from "@/components/pages/ChatHistory";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";
import { toast } from "sonner";

const langs = ["TypeScript", "JavaScript", "Python", "SQL", "HTML/CSS", "Bash"];

export const CodeAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [lang, setLang] = useState(langs[0]);

  return (
    <PageWrap title="Code Assistant" subtitle="Generate snippets, scripts and integrations.">
      <div className="gradient-border rounded-2xl p-[1px]">
        <div className="space-y-4 rounded-2xl bg-card p-5">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            placeholder="Describe what you want to build…"
            className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="flex flex-wrap gap-2">
            {langs.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                  (lang === l
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:bg-accent")
                }
              >
                {l}
              </button>
            ))}
          </div>
          <Button
            onClick={() => toast.success("Code generation queued (placeholder)")}
            className="bg-gradient-to-r from-blue to-violet text-primary-foreground"
            disabled={!prompt.trim()}
          >
            <Code2 className="mr-2 h-4 w-4" /> Generate
          </Button>
        </div>
      </div>
    </PageWrap>
  );
};
