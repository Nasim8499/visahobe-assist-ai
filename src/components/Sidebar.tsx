import {
  Sparkles, History, Folder, BookOpen, Cpu, KeyRound,
  Building2, Image as ImageIcon, Code2, BarChart3, Settings as SettingsIcon, Plus, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageKey, useApp } from "@/contexts/AppContext";

const items: { key: PageKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "assistant", label: "Assistant", icon: Sparkles },
  { key: "history", label: "Chat History", icon: History },
  { key: "mystuff", label: "My Stuff", icon: Folder },
  { key: "knowledge", label: "Knowledge Base", icon: BookOpen },
  { key: "models", label: "AI Models", icon: Cpu },
  { key: "keys", label: "API Keys", icon: KeyRound },
  { key: "company", label: "Company Profile", icon: Building2 },
  { key: "image", label: "Image Generator", icon: ImageIcon },
  { key: "code", label: "Code Assistant", icon: Code2 },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

export const Sidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { page, setPage, newChat } = useApp();

  const handleSelect = (k: PageKey) => {
    setPage(k);
    onClose();
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="h-7 w-7 rounded-full orb" />
          <span className="font-display text-sm font-semibold">VisaHOBe AI</span>
          <Button variant="ghost" size="icon" className="ml-auto md:hidden" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-3">
          <Button
            onClick={() => { newChat(); onClose(); }}
            className="w-full justify-start gap-2 rounded-full bg-gradient-to-r from-cyan via-blue to-violet text-primary-foreground shadow-md hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> New Chat
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          {items.map((it) => {
            const Icon = it.icon;
            const active = page === it.key;
            return (
              <button
                key={it.key}
                onClick={() => handleSelect(it.key)}
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-cyan via-blue to-violet shadow-[0_0_8px_hsl(var(--primary))]" />
                )}
                <Icon className={cn("h-4 w-4", active && "text-primary")} />
                {it.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-4 text-xs text-muted-foreground">
          VisaHOBe Digital Marketing Agency
        </div>
      </aside>
    </>
  );
};
