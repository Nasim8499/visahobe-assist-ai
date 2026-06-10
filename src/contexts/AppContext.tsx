import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
  imageUrl: string;
  createdAt: number;
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

const TEXT_EXT = /\.(txt|md|markdown|csv|json|html|htm|xml|log|yaml|yml|ts|tsx|js|jsx|css)$/i;

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
  imageBusy: boolean;
  generateImage: (prompt: string, style: string) => Promise<void>;
  removeGeneratedImage: (id: string) => void;

  kbFiles: KbFile[];
  kbBusy: boolean;
  addKbFiles: (files: FileList | File[], folder: string) => Promise<void>;
  removeKbFile: (id: string) => void;
  exportKbManifest: () => void;

  resetDemo: () => void;
};

const Ctx = createContext<AppCtx | null>(null);

const initialKeys: ApiKeysState = { gemini: "", openai: "", claude: "", mistral: "" };

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [page, setPage] = useState<PageKey>("assistant");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useLocalStorage<ModelKey>("vh:model", "gemini");
  const [apiKeys, setApiKeys] = useLocalStorage<ApiKeysState>("vh:keys", initialKeys);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [kbFiles, setKbFiles] = useState<KbFile[]>([]);
  const [imageBusy, setImageBusy] = useState(false);
  const [kbBusy, setKbBusy] = useState(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;

  // ---------- Initial load from the database ----------
  useEffect(() => {
    if (!user) {
      setSessions([]);
      setGeneratedImages([]);
      setKbFiles([]);
      setActiveSessionId(null);
      return;
    }
    let cancelled = false;

    (async () => {
      const [sessRes, msgRes, imgRes, kbRes] = await Promise.all([
        supabase.from("chat_sessions").select("*").order("updated_at", { ascending: false }),
        supabase.from("chat_messages").select("*").order("created_at", { ascending: true }),
        supabase.from("generated_images").select("*").order("created_at", { ascending: false }),
        supabase.from("kb_documents").select("id,name,size,mime_type,folder,created_at").order("created_at", { ascending: false }),
      ]);
      if (cancelled) return;

      const msgsBySession = new Map<string, ChatMessage[]>();
      (msgRes.data ?? []).forEach((m: any) => {
        const arr = msgsBySession.get(m.session_id) ?? [];
        arr.push({ id: m.id, role: m.role, content: m.content });
        msgsBySession.set(m.session_id, arr);
      });

      setSessions(
        (sessRes.data ?? []).map((s: any) => ({
          id: s.id,
          title: s.title,
          createdAt: new Date(s.created_at).getTime(),
          messages: msgsBySession.get(s.id) ?? [],
        }))
      );
      setGeneratedImages(
        (imgRes.data ?? []).map((i: any) => ({
          id: i.id,
          prompt: i.prompt,
          style: i.style,
          imageUrl: i.image_url,
          createdAt: new Date(i.created_at).getTime(),
        }))
      );
      setKbFiles(
        (kbRes.data ?? []).map((f: any) => ({
          id: f.id,
          name: f.name,
          size: Number(f.size),
          type: f.mime_type,
          folder: f.folder,
          uploadedAt: new Date(f.created_at).getTime(),
        }))
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const newChat = useCallback(() => {
    setActiveSessionId(null);
    setPrompt("");
    setPage("assistant");
  }, []);

  const openSession = useCallback((id: string) => {
    setActiveSessionId(id);
    setPage("assistant");
  }, []);

  // ---------- Streaming chat ----------
  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || !user) return;

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) {
        toast.error("Please sign in again.");
        return;
      }

      // Resolve / create the session.
      let sId = activeSessionId;
      let history: ChatMessage[] = activeSession?.messages ?? [];
      if (!sId) {
        const { data: created, error } = await supabase
          .from("chat_sessions")
          .insert({ user_id: user.id, title: trimmed.slice(0, 48) })
          .select()
          .single();
        if (error || !created) {
          toast.error("Could not start a new chat.");
          return;
        }
        sId = created.id;
        history = [];
        setSessions((prev) => [
          { id: created.id, title: created.title, createdAt: Date.now(), messages: [] },
          ...prev,
        ]);
        setActiveSessionId(created.id);
      }

      const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: trimmed };
      const placeholderId = crypto.randomUUID();
      const placeholder: ChatMessage = { id: placeholderId, role: "assistant", content: "", thinking: true };

      setSessions((prev) =>
        prev.map((s) => (s.id === sId ? { ...s, messages: [...s.messages, userMsg, placeholder] } : s))
      );
      setPrompt("");

      // Persist the user message.
      await supabase.from("chat_messages").insert({
        session_id: sId,
        user_id: user.id,
        role: "user",
        content: trimmed,
      });

      const modelMessages = [...history, userMsg].map((m) => ({ role: m.role, content: m.content }));

      try {
        const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ messages: modelMessages }),
        });

        if (resp.status === 429) {
          throw new Error("Rate limit reached — please wait a moment and try again.");
        }
        if (resp.status === 402) {
          throw new Error("AI credits exhausted. Add credits in workspace settings.");
        }
        if (!resp.ok || !resp.body) {
          throw new Error("The assistant is unavailable right now.");
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let full = "";

        const apply = (text: string) => {
          setSessions((prev) =>
            prev.map((s) =>
              s.id === sId
                ? {
                    ...s,
                    messages: s.messages.map((m) =>
                      m.id === placeholderId ? { ...m, thinking: false, content: text } : m
                    ),
                  }
                : s
            )
          );
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let nl: number;
          while ((nl = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, nl).trim();
            buffer = buffer.slice(nl + 1);
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const json = JSON.parse(data);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) {
                full += delta;
                apply(full);
              }
            } catch {
              /* ignore partial frames */
            }
          }
        }

        if (!full) full = "I wasn't able to generate a response. Please try again.";
        apply(full);

        await supabase.from("chat_messages").insert({
          session_id: sId,
          user_id: user.id,
          role: "assistant",
          content: full,
        });
        await supabase.from("chat_sessions").update({ updated_at: new Date().toISOString() }).eq("id", sId);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong.";
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sId
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === placeholderId ? { ...m, thinking: false, content: `⚠️ ${message}` } : m
                  ),
                }
              : s
          )
        );
        toast.error(message);
      }
    },
    [user, activeSessionId, activeSession]
  );

  const setApiKey = (m: ModelKey, v: string) => setApiKeys((p) => ({ ...p, [m]: v }));
  const clearApiKey = (m: ModelKey) => setApiKeys((p) => ({ ...p, [m]: "" }));

  // ---------- Image generation ----------
  const generateImage = useCallback(
    async (rawPrompt: string, style: string) => {
      const p = rawPrompt.trim();
      if (!p || !user || imageBusy) return;
      setImageBusy(true);
      try {
        const { data, error } = await supabase.functions.invoke("generate-image", {
          body: { prompt: p, style },
        });
        if (error) throw error;
        const imageUrl: string | undefined = data?.imageUrl;
        if (!imageUrl) throw new Error(data?.error || "No image returned.");

        const { data: row, error: insErr } = await supabase
          .from("generated_images")
          .insert({ user_id: user.id, prompt: p, style, image_url: imageUrl })
          .select()
          .single();
        if (insErr || !row) throw insErr || new Error("Could not save image.");

        setGeneratedImages((prev) => [
          { id: row.id, prompt: p, style, imageUrl, createdAt: Date.now() },
          ...prev,
        ]);
        toast.success("Image generated — saved to My Stuff");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Image generation failed.");
      } finally {
        setImageBusy(false);
      }
    },
    [user, imageBusy]
  );

  const removeGeneratedImage = async (id: string) => {
    setGeneratedImages((p) => p.filter((i) => i.id !== id));
    await supabase.from("generated_images").delete().eq("id", id);
  };

  // ---------- Knowledge base ----------
  const addKbFiles: AppCtx["addKbFiles"] = async (files, folder) => {
    if (!user) return;
    const arr = Array.from(files);
    if (arr.length === 0) return;
    setKbBusy(true);
    try {
      for (const f of arr) {
        let content = "";
        if (TEXT_EXT.test(f.name) && f.size < 500 * 1024) {
          try {
            content = (await f.text()).slice(0, 60000);
          } catch {
            /* binary fallback */
          }
        }
        const path = `${user.id}/${crypto.randomUUID()}-${f.name}`;
        await supabase.storage.from("kb-files").upload(path, f, { upsert: false });

        const { data: row, error } = await supabase
          .from("kb_documents")
          .insert({
            user_id: user.id,
            name: f.name,
            folder,
            size: f.size,
            mime_type: f.type || "application/octet-stream",
            storage_path: path,
            content,
          })
          .select()
          .single();
        if (error || !row) continue;

        setKbFiles((prev) => [
          {
            id: row.id,
            name: f.name,
            size: f.size,
            type: f.type || "application/octet-stream",
            folder,
            uploadedAt: Date.now(),
          },
          ...prev,
        ]);
      }
      toast.success(`Added ${arr.length} file(s) to ${folder}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setKbBusy(false);
    }
  };

  const removeKbFile = async (id: string) => {
    const file = kbFiles.find((f) => f.id === id);
    setKbFiles((p) => p.filter((f) => f.id !== id));
    const { data } = await supabase.from("kb_documents").select("storage_path").eq("id", id).single();
    if (data?.storage_path) await supabase.storage.from("kb-files").remove([data.storage_path]);
    await supabase.from("kb_documents").delete().eq("id", id);
    void file;
  };

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

  const resetDemo = async () => {
    if (!user) return;
    setSessions([]);
    setActiveSessionId(null);
    setGeneratedImages([]);
    setKbFiles([]);
    setPrompt("");
    setPage("assistant");
    await Promise.all([
      supabase.from("chat_sessions").delete().eq("user_id", user.id),
      supabase.from("generated_images").delete().eq("user_id", user.id),
      supabase.from("kb_documents").delete().eq("user_id", user.id),
    ]);
    toast.success("Your saved data was cleared.");
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
        generatedImages, imageBusy, generateImage, removeGeneratedImage,
        kbFiles, kbBusy, addKbFiles, removeKbFile, exportKbManifest,
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
