import { useEffect, useRef, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { AIOrb } from "@/components/AIOrb";
import { Markdown } from "@/components/Markdown";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { copyText } from "@/lib/clipboard";
import { toast } from "sonner";

export const ChatView = () => {
  const { activeSession } = useApp();
  const bottomRef = useRef<HTMLDivElement>(null);

  const lastMsg = activeSession?.messages.at(-1);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeSession?.messages.length, lastMsg?.content, lastMsg?.thinking]);

  if (!activeSession) return null;

  return (
    <div className="flex-1 space-y-6 overflow-y-auto pb-4">
      {activeSession.messages.map((m) => (
        <motion.div
          key={m.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={m.role === "user" ? "flex justify-end" : "flex gap-3"}
        >
          {m.role === "assistant" && (
            <div className="mt-1 shrink-0"><AIOrb size={28} /></div>
          )}
          <div
            className={
              m.role === "user"
                ? "max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-blue to-violet px-4 py-2.5 text-sm text-primary-foreground shadow-md"
                : "group max-w-[85%] text-[15px] leading-relaxed text-foreground"
            }
          >
            {m.thinking ? (
              <ThinkingIndicator />
            ) : m.role === "assistant" ? (
              <>
                <Markdown>{m.content}</Markdown>
                <CopyButton text={m.content} />
              </>
            ) : (
              m.content
            )}
          </div>
        </motion.div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

const ThinkingIndicator = () => (
  <div className="flex flex-col gap-2">
    <span className="shimmer-text text-sm font-medium">Thinking…</span>
    <div className="h-[3px] w-32 overflow-hidden rounded-full bg-muted">
      <motion.div
        className="h-full w-1/3 rounded-full bg-gradient-to-r from-cyan via-blue to-violet"
        animate={{ x: ["-100%", "300%"] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  </div>
);

const CopyButton = ({ text }: { text: string }) => {
  const [done, setDone] = useState(false);
  const handle = async () => {
    const r = await copyText(text);
    if (r.ok) {
      setDone(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setDone(false), 1500);
    } else {
      toast.error("Couldn't copy");
    }
  };
  return (
    <button
      onClick={handle}
      className="mt-2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground group-hover:opacity-100"
    >
      {done ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {done ? "Copied" : "Copy"}
    </button>
  );
};
