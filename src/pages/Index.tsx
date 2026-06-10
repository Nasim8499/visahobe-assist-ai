import { useState } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { AuthPage } from "@/components/AuthPage";
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
import { Loader2 } from "lucide-react";

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

const Gate = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <AuthPage />;
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
};

const Index = () => (
  <ThemeProvider>
    <AuthProvider>
      <Gate />
    </AuthProvider>
  </ThemeProvider>
);

export default Index;
