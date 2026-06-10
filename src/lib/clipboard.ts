export type CopyResult = { ok: boolean; method: "clipboard" | "execCommand" | "none"; error?: string };

export async function copyText(text: string): Promise<CopyResult> {
  // Modern API
  if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return { ok: true, method: "clipboard" };
    } catch {
      /* fall through */
    }
  }
  // Legacy fallback
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok ? { ok: true, method: "execCommand" } : { ok: false, method: "none", error: "execCommand returned false" };
  } catch (e) {
    return { ok: false, method: "none", error: (e as Error).message };
  }
}
