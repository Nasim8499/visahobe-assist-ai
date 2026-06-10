
## Goal

Level up VisaHOBe AI Assistant with a futuristic visual language and finish the loose UX threads: smarter chat, working Image Generator → My Stuff pipeline, real Knowledge Base UI, persisted settings, and a bulletproof .env copy.

---

## 1. Futuristic UI Refresh (still White Neutral Expressive by default)

Keep the Gemini-style centered home, but push the visuals into a premium "soft-futurism" register.

- **Tokens (`src/index.css` + `tailwind.config.ts`)**
  - Richer gradient stack: aurora blue → violet → cyan, plus a subtle iridescent accent.
  - New semantic tokens: `--surface-glass`, `--ring-neon`, `--glow-primary`, `--grid-line`.
  - Add `.glass` (backdrop-blur + translucent border), `.neon-ring` (animated conic gradient border), `.bg-grid` (faint dotted/grid background), `.shine` (sheen sweep on hover).
- **AIOrb**: layered conic + radial gradients, slow rotation, inner pulse ring, soft particle haze. Reduced-motion safe.
- **Home (Assistant)**: faint animated grid backdrop, larger orb with halo, glass prompt box, chips become pill-glass with hover shine, suggestion cards get neon gradient border + subtle tilt on hover (CSS only, no JS window reads).
- **Sidebar/Header**: glass surface, active nav item shows neon underglow; model badge in header.
- **Page wrappers**: consistent glass cards, gradient hairline dividers.
- All colors via HSL semantic tokens — no hardcoded hex in components.

## 2. Chat Experience

`src/components/ChatView.tsx` + `src/components/pages/Assistant.tsx`
- Auto-scroll: keep current ref, also trigger on `thinking` flip and on streaming content updates; smooth scroll with `block: "end"`.
- Markdown-friendly assistant replies: add `react-markdown` + `remark-gfm`, render assistant messages through a styled `<Markdown>` wrapper (prose tokens, code blocks, lists, links). User bubbles stay plain text.
- Smoother thinking animation: replace 3-dot keyframe with a shimmer text ("Thinking…") plus an animated gradient bar under the orb avatar; respects `prefers-reduced-motion`.
- Minor: copy-message button on hover for assistant replies.

## 3. Image Generator → My Stuff

- Extend `AppContext` with `generatedImages: { id, prompt, style, createdAt }[]` and `addGeneratedImage()`.
- `ImageGenerator.tsx`: on Generate, push a placeholder entry (gradient tile + prompt label), toast success, clear prompt. Show the latest 8 in the grid below.
- `MyStuff.tsx`: "Generated Images" card shows real count; clicking it routes to Image Generator. Add a small recent-images strip in the card.
- All persisted (see §5).

## 4. Knowledge Base

`src/components/pages/KnowledgeBase.tsx`
- Drag-and-drop dropzone (HTML5 DnD, no extra deps) + "Choose files" `<input type="file" multiple>`.
- File list with name, size, type icon, uploaded-at, delete button. Stored in context (metadata only — no actual upload).
- Folder chips (Marketing, Visa Policies, Recruitment, SEO, Ads, General) for filtering/assigning.
- Export: "Export manifest" downloads a JSON of folders + files via Blob; toast feedback.
- Empty state with illustration-style orb.

## 5. Persistence (localStorage)

- `ThemeContext`: already persists — verify and harden SSR guard.
- `AppContext`: persist `apiKeys`, `selectedModel`, `sessions`, `generatedImages`, `knowledgeFiles` under namespaced keys (`vh:keys`, `vh:model`, `vh:sessions`, `vh:images`, `vh:kb`).
- Small `useLocalStorage<T>` hook in `src/hooks/use-local-storage.ts` with try/catch + JSON guard.
- Migration-safe defaults so first load works.

## 6. .env Copy Button

`ModelsAndKeys.tsx`
- Extract `copyText(text)` util in `src/lib/clipboard.ts`:
  1. Try `navigator.clipboard.writeText` (requires secure context).
  2. Fallback: hidden `<textarea>` + `document.execCommand("copy")`.
  3. Final fallback: open a modal/toast with selectable text + "Select all" hint.
- Returns `{ ok: boolean, method: string }`; UI shows `toast.success("✓ .env copied")` or `toast.error("Couldn't copy — text shown for manual copy")`.
- Button shows transient ✓ state for 1.5s after success.

---

## Technical Notes

- New dep: `react-markdown`, `remark-gfm`.
- No `window.innerWidth` in render; rely on Tailwind breakpoints + existing `use-mobile` hook where needed.
- All animations use Tailwind keyframes or Framer Motion, gated by `motion-safe:`.
- No mobile bottom nav (unchanged).
- Files touched: `index.css`, `tailwind.config.ts`, `AIOrb.tsx`, `Assistant.tsx`, `ChatView.tsx`, `PromptBox.tsx`, `Sidebar.tsx`, `Header.tsx`, `ImageGenerator.tsx`, `MyStuff.tsx`, `KnowledgeBase.tsx`, `ModelsAndKeys.tsx`, `AppContext.tsx`, `ThemeContext.tsx`, plus new `hooks/use-local-storage.ts`, `lib/clipboard.ts`, `components/Markdown.tsx`.

## Out of Scope

- Real backend / real AI calls (still placeholder responses).
- Real file uploads to storage (metadata-only KB).
