import { Menu, Moon, Sun, User, Cpu } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";

const MODEL_LABEL: Record<string, string> = {
  gemini: "Gemini",
  openai: "ChatGPT",
  claude: "Claude",
  mistral: "Mistral",
};

export const Header = ({ onMenu }: { onMenu: () => void }) => {
  const { theme, toggle } = useTheme();
  const { selectedModel, setPage } = useApp();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border/60 bg-background/70 px-3 backdrop-blur-xl sm:px-5">
      <Button variant="ghost" size="icon" onClick={onMenu} className="md:hidden" aria-label="Menu">
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-full orb" />
        <span className="font-display text-base font-semibold tracking-tight">
          VisaHOBe <span className="text-gradient">AI</span>
        </span>
      </div>
      <button
        onClick={() => setPage("models")}
        className="ml-3 hidden items-center gap-1.5 rounded-full border border-border bg-card/60 px-2.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-foreground sm:inline-flex"
      >
        <Cpu className="h-3 w-3 text-primary" />
        {MODEL_LABEL[selectedModel] ?? selectedModel}
      </button>
      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" aria-label="Profile">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
