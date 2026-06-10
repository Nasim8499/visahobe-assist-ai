import { useApp } from "@/contexts/AppContext";
import { MessageSquare } from "lucide-react";

export const PageWrap = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
    <header className="mb-6">
      <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </header>
    {children}
  </div>
);

export const ChatHistory = () => {
  const { sessions, openSession } = useApp();
  return (
    <PageWrap title="Chat History" subtitle="Resume any past conversation.">
      {sessions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No chats yet — start a new conversation from the Assistant page.
        </div>
      ) : (
        <ul className="space-y-2">
          {sessions.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => openSession(s.id)}
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-accent"
              >
                <MessageSquare className="h-4 w-4 text-primary" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{s.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(s.createdAt).toLocaleString()} · {s.messages.length} msgs
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </PageWrap>
  );
};
