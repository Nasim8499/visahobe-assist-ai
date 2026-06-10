import { useRef } from "react";
import { Paperclip, Image as ImageIcon, Mic, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";

export const PromptBox = ({ compact = false }: { compact?: boolean }) => {
  const { prompt, setPrompt, sendMessage } = useApp();
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!prompt.trim()) return;
    sendMessage(prompt);
  };

  return (
    <div className="gradient-border neon-shadow rounded-3xl">
      <div className="rounded-3xl bg-card/80 p-3 backdrop-blur-xl sm:p-4">
        <textarea
          ref={ref}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={compact ? 1 : 2}
          placeholder="Ask VisaHOBe AI anything — marketing, visa content, recruitment, SEO…"
          className="w-full resize-none border-0 bg-transparent px-2 py-1 font-sans text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <div className="mt-2 flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Attach"><Paperclip className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" aria-label="Image"><ImageIcon className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" aria-label="Mic"><Mic className="h-4 w-4" /></Button>
          <div className="ml-auto">
            <Button
              onClick={handleSend}
              disabled={!prompt.trim()}
              size="icon"
              className="rounded-full bg-gradient-to-br from-cyan via-blue to-violet text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:opacity-95 disabled:opacity-50"
              aria-label="Send"
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
