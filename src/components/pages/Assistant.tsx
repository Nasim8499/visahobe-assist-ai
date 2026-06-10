import { motion } from "framer-motion";
import { AIOrb } from "@/components/AIOrb";
import { PromptBox } from "@/components/PromptBox";
import { useApp } from "@/contexts/AppContext";
import { Lightbulb, PenLine, Search, Megaphone, Users, FileText } from "lucide-react";
import { ChatView } from "@/components/ChatView";

const chips = [
  { label: "Research", icon: Search, fill: "Research the latest visa policy updates for skilled workers in the GCC region." },
  { label: "Write Content", icon: PenLine, fill: "Write a LinkedIn post promoting our worker recruitment services." },
  { label: "SEO Plan", icon: Lightbulb, fill: "Create a 30-day SEO plan for a visa consultancy website." },
  { label: "Campaign Idea", icon: Megaphone, fill: "Suggest a Q1 paid ad campaign for healthcare recruitment." },
  { label: "Worker Recruitment", icon: Users, fill: "Draft outreach copy for hiring construction workers from Bangladesh." },
  { label: "Visa Copy", icon: FileText, fill: "Write a landing page hero for Canada work permit assistance." },
];

const cards = [
  { title: "Build a marketing funnel", subtitle: "From cold lead to signed client.", fill: "Build a complete marketing funnel for VisaHOBe's visa consultancy services." },
  { title: "Recruitment email sequence", subtitle: "5-step outreach for new candidates.", fill: "Write a 5-step recruitment email sequence for overseas job seekers." },
  { title: "Audit our SEO", subtitle: "Quick wins for higher rankings.", fill: "Audit a visa agency website and suggest SEO quick wins." },
  { title: "Ad copy variations", subtitle: "Meta + Google ready.", fill: "Generate 6 ad copy variations for a Dubai work visa campaign." },
];

export const Assistant = () => {
  const { activeSession, setPrompt } = useApp();
  const hasChat = activeSession && activeSession.messages.length > 0;

  if (hasChat) {
    return (
      <div className="relative mx-auto flex h-full max-w-3xl flex-col gap-4 px-4 py-6">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40" />
        <ChatView />
        <div className="sticky bottom-4">
          <PromptBox compact />
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-3xl flex-col items-center justify-center px-4 py-10">
      {/* Futuristic backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-grid opacity-50" />
      <div className="pointer-events-none absolute inset-x-0 top-10 -z-10 mx-auto h-80 w-80 rounded-full opacity-40 blur-3xl orb" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center"
      >
        <AIOrb size={120} />
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          How can I help <span className="text-gradient">VisaHOBe</span> today?
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          Marketing, visa content, recruitment workflows, SEO, ads and automation.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-8 w-full"
      >
        <PromptBox />
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {chips.map((c) => (
            <button
              key={c.label}
              onClick={() => setPrompt(c.fill)}
              className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-accent hover:shadow-md"
            >
              <c.icon className="h-3.5 w-3.5 text-primary" />
              {c.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {cards.map((c) => (
          <button
            key={c.title}
            onClick={() => setPrompt(c.fill)}
            className="gradient-border neon-ring group rounded-2xl p-[1px] text-left transition-all hover:-translate-y-1"
          >
            <div className="rounded-2xl bg-card p-4">
              <div className="font-display text-sm font-semibold">{c.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{c.subtitle}</div>
            </div>
          </button>
        ))}
      </motion.div>
    </div>
  );
};
