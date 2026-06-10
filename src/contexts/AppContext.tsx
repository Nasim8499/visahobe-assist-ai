import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

export type PageKey =
  | "assistant" | "history" | "mystuff" | "knowledge"
  | "models" | "keys" | "company" | "image" | "code" | "analytics" | "settings";

export type ChatMessage = { id: string; role: "user" | "assistant"; content: string; thinking?: boolean };
export type ChatSession = { id: string; title: string; createdAt: number; messages: ChatMessage[] };

export type ModelKey = "gemini" | "openai" | "claude" | "mistral";
export type ApiKeysState = Record<ModelKey, string>;

export type GeneratedImage = {
  id: string;
  prompt: string;
  style: string;
  createdAt: number;
  /** index used to pick a deterministic gradient swatch for the placeholder */
  hue: number;
};

export type KbFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  folder: string;
  uploadedAt: number;
};

export const KB_FOLDERS = ["Marketing", "Visa Policies", "Recruitment", "SEO", "Ads", "General"] as const;

type AppCtx = {
  page: PageKey;
  setPage: (p: PageKey) => void;

  sessions: ChatSession[];
  activeSessionId: string | null;
  activeSession: ChatSession | null;
  newChat: () => void;
  openSession: (id: string) => void;
  sendMessage: (content: string) => void;

  prompt: string;
  setPrompt: (p: string) => void;

  selectedModel: ModelKey;
  setSelectedModel: (m: ModelKey) => void;

  apiKeys: ApiKeysState;
  setApiKey: (m: ModelKey, v: string) => void;
  clearApiKey: (m: ModelKey) => void;

  generatedImages: GeneratedImage[];
  addGeneratedImage: (img: Omit<GeneratedImage, "id" | "createdAt" | "hue">) => void;
  removeGeneratedImage: (id: string) => void;

  kbFiles: KbFile[];
  addKbFiles: (files: FileList | File[], folder: string) => void;
  removeKbFile: (id: string) => void;
  exportKbManifest: () => void;

  resetDemo: () => void;
};

const Ctx = createContext<AppCtx | null>(null);

const initialKeys: ApiKeysState = { gemini: "", openai: "", claude: "", mistral: "" };

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [page, setPage] = useState<PageKey>("assistant");
  const [sessions, setSessions] = useLocalStorage<ChatSession[]>("vh:sessions", []);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useLocalStorage<ModelKey>("vh:model", "gemini");
  const [apiKeys, setApiKeys] = useLocalStorage<ApiKeysState>("vh:keys", initialKeys);
  const [generatedImages, setGeneratedImages] = useLocalStorage<GeneratedImage[]>("vh:images", []);
  const [kbFiles, setKbFiles] = useLocalStorage<KbFile[]>("vh:kb", []);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;

  const newChat = useCallback(() => {
    setActiveSessionId(null);
    setPrompt("");
    setPage("assistant");
  }, []);

  const openSession = useCallback((id: string) => {
    setActiveSessionId(id);
    setPage("assistant");
  }, []);

  const sendMessage = useCallback((content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: trimmed };
    const placeholder: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: "", thinking: true };

    let sId = activeSessionId;
    setSessions((prev) => {
      if (!sId) {
        sId = crypto.randomUUID();
        const newSess: ChatSession = {
          id: sId,
          title: trimmed.slice(0, 48),
          createdAt: Date.now(),
          messages: [userMsg, placeholder],
        };
        setActiveSessionId(sId);
        return [newSess, ...prev];
      }
      return prev.map((s) =>
        s.id === sId ? { ...s, messages: [...s.messages, userMsg, placeholder] } : s
      );
    });
    setPrompt("");

    setTimeout(() => {
      setSessions((prev) =>
        prev.map((s) => {
          if (!s.messages.some((m) => m.id === placeholder.id)) return s;
          return {
            ...s,
            messages: s.messages.map((m) =>
              m.id === placeholder.id
                ? {
                    ...m,
                    thinking: false,
                    content:
                      "**Here's a draft from VisaHOBe AI** — connect a model in **API Keys** to enable live responses.\n\nI can help you with:\n\n- Marketing campaigns & funnels\n- Visa & immigration content\n- Recruitment outreach sequences\n- SEO strategies and audits\n- Meta & Google ad copy\n\n> Tip: pick a chip on the home screen to get started faster.",
                  }
                : m
            ),
          };
        })
      );
    }, 1200);
  }, [activeSessionId, setSessions]);

  const setApiKey = (m: ModelKey, v: string) => setApiKeys((p) => ({ ...p, [m]: v }));
  const clearApiKey = (m: ModelKey) => setApiKeys((p) => ({ ...p, [m]: "" }));

  const addGeneratedImage: AppCtx["addGeneratedImage"] = (img) => {
    setGeneratedImages((prev) => [
      { ...img, id: crypto.randomUUID(), createdAt: Date.now(), hue: Math.floor(Math.random() * 360) },
      ...prev,
    ].slice(0, 60));
  };
  const removeGeneratedImage = (id: string) => setGeneratedImages((p) => p.filter((i) => i.id !== id));

  const addKbFiles: AppCtx["addKbFiles"] = (files, folder) => {
    const arr = Array.from(files);
    const mapped: KbFile[] = arr.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      type: f.type || "application/octet-stream",
      folder,
      uploadedAt: Date.now(),
    }));
    setKbFiles((prev) => [...mapped, ...prev]);
  };
  const removeKbFile = (id: string) => setKbFiles((p) => p.filter((f) => f.id !== id));

  const exportKbManifest = () => {
    const manifest = {
      exportedAt: new Date().toISOString(),
      folders: KB_FOLDERS,
      files: kbFiles,
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visahobe-kb-manifest-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetDemo = () => {
    setSessions([]);
    setActiveSessionId(null);
    setApiKeys(initialKeys);
    setGeneratedImages([]);
    setKbFiles([]);
    setPrompt("");
    setPage("assistant");
  };

  return (
    <Ctx.Provider
      value={{
        page, setPage,
        sessions, activeSessionId, activeSession,
        newChat, openSession, sendMessage,
        prompt, setPrompt,
        selectedModel, setSelectedModel,
        apiKeys, setApiKey, clearApiKey,
        generatedImages, addGeneratedImage, removeGeneratedImage,
        kbFiles, addKbFiles, removeKbFile, exportKbManifest,
        resetDemo,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useApp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp requires AppProvider");
  return c;
};
