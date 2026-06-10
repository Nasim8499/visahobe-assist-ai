import { PageWrap } from "@/components/pages/ChatHistory";
import { useApp } from "@/contexts/AppContext";
import { MessageSquare, KeyRound, Activity, FileText } from "lucide-react";

export const Analytics = () => {
  const { sessions, apiKeys } = useApp();
  const totalMessages = sessions.reduce((n, s) => n + s.messages.length, 0);
  const activeKeys = Object.values(apiKeys).filter((v) => v.length > 0).length;

  const stats = [
    { icon: MessageSquare, label: "Total Chats", value: sessions.length },
    { icon: KeyRound, label: "Active API Keys", value: `${activeKeys}/4` },
    { icon: Activity, label: "Messages", value: totalMessages },
    { icon: FileText, label: "Content Generated", value: Math.floor(totalMessages / 2) },
  ];

  return (
    <PageWrap title="Analytics" subtitle="Usage at a glance.">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <s.icon className="h-5 w-5 text-primary" />
            <div className="mt-3 font-display text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </PageWrap>
  );
};
