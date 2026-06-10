import { useState } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Assistant } from "@/components/pages/Assistant";
import { ChatHistory } from "@/components/pages/ChatHistory";
import { MyStuff } from "@/components/pages/MyStuff";
import { KnowledgeBase } from "@/components/pages/KnowledgeBase";
import { ModelsAndKeys } from "@/components/pages/ModelsAndKeys";
import { CompanyProfile } from "@/components/pages/CompanyProfile";
import { ImageGenerator } from "@/components/pages/ImageGenerator";
import { CodeAssistant } from "@/components/pages/CodeAssistant";
import { Analytics } from "@/components/pages/Analytics";
import { Settings } from "@/components/pages/Settings";

const Content = () => {
  const { page } = useApp();
  switch (page) {
    case "assistant": return <Assistant />;
    case "history": return <ChatHistory />;
    case "mystuff": return <MyStuff />;
    case "knowledge": return <KnowledgeBase />;
    case "models": return <ModelsAndKeys mode="models" />;
    case "keys": return <ModelsAndKeys mode="keys" />;
    case "company": return <CompanyProfile />;
    case "image": return <ImageGenerator />;
    case "code": return <CodeAssistant />;
    case "analytics": return <Analytics />;
    case "settings": return <Settings />;
    default: return <Assistant />;
  }
};

const Shell = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen w-full bg-background font-sans">
      <div className="flex">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className="min-w-0 flex-1">
          <Header onMenu={() => setOpen(true)} />
          <main className="min-h-[calc(100vh-3.5rem)] animate-fade-in">
            <Content />
          </main>
        </div>
      </div>
    </div>
  );
};

const Index = () => (
  <ThemeProvider>
    <AppProvider>
      <Shell />
    </AppProvider>
  </ThemeProvider>
);

export default Index;
