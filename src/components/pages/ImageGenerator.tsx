import { useState } from "react";
import { PageWrap } from "@/components/pages/ChatHistory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext";

const styles = ["Photoreal", "Cinematic", "Flat Illustration", "3D Render", "Minimal", "Editorial"];

export const ImageGenerator = () => {
  const { generatedImages, addGeneratedImage, removeGeneratedImage } = useApp();
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(styles[0]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    addGeneratedImage({ prompt: prompt.trim(), style });
    toast.success("Image generated — saved to My Stuff");
    setPrompt("");
  };

  return (
    <PageWrap title="Image Generator" subtitle="Create on-brand visuals for campaigns.">
      <div className="gradient-border rounded-2xl p-[1px]">
        <div className="space-y-4 rounded-2xl bg-card p-5">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="A professional visa consultant helping a young couple, warm tones…"
          />
          <div className="flex flex-wrap gap-2">
            {styles.map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                  (style === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:bg-accent")
                }
              >
                {s}
              </button>
            ))}
          </div>
          <Button
            onClick={handleGenerate}
            className="bg-gradient-to-r from-blue to-violet text-primary-foreground"
            disabled={!prompt.trim()}
          >
            <Sparkles className="mr-2 h-4 w-4" /> Generate
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 font-display text-sm font-semibold text-muted-foreground">Recent generations</h2>
        {generatedImages.length === 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl border border-dashed border-border bg-muted/40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {generatedImages.slice(0, 8).map((img) => (
              <div key={img.id} className="group relative aspect-square overflow-hidden rounded-2xl">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, hsl(${img.hue} 80% 65%), hsl(${(img.hue + 60) % 360} 80% 55%), hsl(${(img.hue + 120) % 360} 75% 50%))`,
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="line-clamp-2 text-[11px] text-white">{img.prompt}</p>
                  <p className="text-[10px] text-white/70">{img.style}</p>
                </div>
                <button
                  onClick={() => removeGeneratedImage(img.id)}
                  className="absolute right-2 top-2 rounded-full bg-black/40 p-1 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrap>
  );
};
