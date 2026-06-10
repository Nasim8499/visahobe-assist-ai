import { PageWrap } from "@/components/pages/ChatHistory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp, ModelKey } from "@/contexts/AppContext";
import { Check, Copy, Trash2, KeyRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { copyText } from "@/lib/clipboard";

const MODELS: { key: ModelKey; name: string; desc: string; color: string }[] = [
  { key: "gemini", name: "Google Gemini", desc: "Fast, multimodal, great for marketing & vision tasks.", color: "from-blue to-cyan" },
  { key: "openai", name: "OpenAI ChatGPT", desc: "Versatile reasoning, content and structured outputs.", color: "from-violet to-fuchsia" },
  { key: "claude", name: "Claude AI", desc: "Long-context writing, careful tone and analysis.", color: "from-fuchsia to-blue" },
  { key: "mistral", name: "Mistral AI", desc: "Lightweight, efficient European LLM.", color: "from-cyan to-violet" },
];

export const ModelsAndKeys = ({ mode }: { mode: "models" | "keys" }) => {
  const { apiKeys, setApiKey, clearApiKey, selectedModel, setSelectedModel } = useApp();
  const [show, setShow] = useState<Record<ModelKey, boolean>>({ gemini: false, openai: false, claude: false, mistral: false });
  const [copied, setCopied] = useState(false);
  const [fallbackText, setFallbackText] = useState<string | null>(null);

  const buildEnv = () =>
    MODELS.map((m) => `${m.key.toUpperCase()}_API_KEY=${apiKeys[m.key] || ""}`).join("\n");

  const handleCopy = async () => {
    const env = buildEnv();
    const r = await copyText(env);
    if (r.ok) {
      setCopied(true);
      setFallbackText(null);
      toast.success("✓ .env copied to clipboard");
      setTimeout(() => setCopied(false), 1600);
    } else {
      setFallbackText(env);
      toast.error("Couldn't copy automatically — select the text below to copy manually.");
    }
  };

  return (
    <PageWrap
      title={mode === "models" ? "AI Models" : "API Keys"}
      subtitle={mode === "models" ? "Choose your default model." : "Manage provider keys. Keys are stored locally in this browser."}
    >
      {mode === "keys" && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
          <KeyRound className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Keep production API keys server-side. This local storage is for demo only.</span>
        </div>
      )}
      <div className="mb-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? <><Check className="mr-2 h-4 w-4 text-emerald-500" /> Copied</> : <><Copy className="mr-2 h-4 w-4" /> Copy .env</>}
        </Button>
      </div>
      {fallbackText && (
        <div className="mb-4 rounded-xl border border-border bg-muted/40 p-3">
          <p className="mb-2 text-xs text-muted-foreground">Auto-copy was blocked by the browser. Select and copy manually:</p>
          <textarea
            readOnly
            value={fallbackText}
            onFocus={(e) => e.currentTarget.select()}
            className="h-28 w-full resize-none rounded-md border border-border bg-background p-2 font-mono text-xs"
          />
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {MODELS.map((m) => {
          const active = apiKeys[m.key].length > 0;
          const selected = selectedModel === m.key;
          return (
            <div key={m.key} className="gradient-border rounded-2xl p-[1px]">
              <div className="rounded-2xl bg-card p-5">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${m.color} shadow-md`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-display font-semibold">{m.name}</div>
                      <span
                        className={
                          active
                            ? "rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
                            : "rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                        }
                      >
                        {active ? "Active" : "Empty"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{m.desc}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Input
                    type={show[m.key] ? "text" : "password"}
                    value={apiKeys[m.key]}
                    onChange={(e) => setApiKey(m.key, e.target.value)}
                    placeholder={`Enter ${m.name} API key`}
                  />
                  <Button variant="outline" size="sm" onClick={() => setShow((s) => ({ ...s, [m.key]: !s[m.key] }))}>
                    {show[m.key] ? "Hide" : "Show"}
                  </Button>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={selected ? "default" : "outline"}
                    onClick={() => setSelectedModel(m.key)}
                  >
                    {selected ? <><Check className="mr-1 h-4 w-4" /> Selected</> : "Use this model"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => clearApiKey(m.key)}>
                    <Trash2 className="mr-1 h-4 w-4" /> Clear
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageWrap>
  );
};
