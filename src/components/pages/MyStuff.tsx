import { PageWrap } from "@/components/pages/ChatHistory";
import { Image as ImageIcon, Bookmark, FileText, Video } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export const MyStuff = () => {
  const { generatedImages, kbFiles, sessions, setPage } = useApp();

  const items = [
    {
      icon: ImageIcon,
      title: "Generated Images",
      count: generatedImages.length,
      desc: "AI-generated banners, ads and visuals.",
      go: () => setPage("image" as const),
    },
    {
      icon: Bookmark,
      title: "Saved Prompts",
      count: sessions.length,
      desc: "Your past conversations & prompts.",
      go: () => setPage("history" as const),
    },
    {
      icon: FileText,
      title: "Knowledge Documents",
      count: kbFiles.length,
      desc: "Briefs, policies and reference docs.",
      go: () => setPage("knowledge" as const),
    },
    {
      icon: Video,
      title: "Video Ideas",
      count: 0,
      desc: "Scripts and concepts for reels.",
      go: () => {},
    },
  ];

  return (
    <PageWrap title="My Stuff" subtitle="Everything you've created with VisaHOBe AI.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <button
            key={it.title}
            onClick={it.go}
            className="gradient-border rounded-2xl p-[1px] text-left transition-transform hover:-translate-y-0.5"
          >
            <div className="rounded-2xl bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                  <it.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display font-semibold">{it.title}</div>
                  <div className="text-xs text-muted-foreground">{it.desc}</div>
                </div>
                <div className="ml-auto text-2xl font-semibold">{it.count}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {generatedImages.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 font-display text-sm font-semibold text-muted-foreground">Recent images</h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {generatedImages.slice(0, 6).map((img) => (
              <img
                key={img.id}
                src={img.imageUrl}
                alt={img.prompt}
                title={img.prompt}
                loading="lazy"
                className="aspect-square w-full rounded-xl border border-border object-cover"
              />
            ))}
          </div>
        </div>
      )}
    </PageWrap>
  );
};
