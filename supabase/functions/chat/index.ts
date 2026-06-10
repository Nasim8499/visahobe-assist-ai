// VisaHOBe AI — streaming chat with knowledge-base grounding
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

import { createClient } from "npm:@supabase/supabase-js@2";

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return json({ error: "AI is not configured." }, 500);

    const { messages } = await req.json();
    if (!Array.isArray(messages)) return json({ error: "messages must be an array" }, 400);

    // Pull the user's knowledge base documents (RLS-scoped to the caller).
    let kbContext = "";
    const authHeader = req.headers.get("Authorization") ?? "";
    if (authHeader) {
      try {
        const supa = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_ANON_KEY")!,
          { global: { headers: { Authorization: authHeader } } }
        );
        const { data: docs } = await supa
          .from("kb_documents")
          .select("name, folder, content")
          .neq("content", "")
          .limit(15);
        if (docs && docs.length) {
          kbContext = docs
            .map((d: any) => `# ${d.name} (${d.folder})\n${(d.content || "").slice(0, 4000)}`)
            .join("\n\n")
            .slice(0, 24000);
        }
      } catch (_) {
        /* knowledge base is optional */
      }
    }

    const systemPrompt =
      "You are VisaHOBe AI, an expert assistant for a visa consultancy and digital marketing agency. " +
      "Help with marketing, visa & immigration content, recruitment, SEO and ad copy. Be clear, practical, and format with markdown." +
      (kbContext
        ? `\n\nUse the following knowledge base documents to ground your answers when relevant. Cite the document name when you rely on it:\n\n${kbContext}`
        : "");

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        stream: true,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
    });

    if (resp.status === 429) return json({ error: "Rate limit reached. Try again shortly." }, 429);
    if (resp.status === 402) return json({ error: "AI credits exhausted." }, 402);
    if (!resp.ok || !resp.body) {
      const t = await resp.text().catch(() => "");
      return json({ error: t || "Upstream AI error" }, resp.status || 500);
    }

    return new Response(resp.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
});
