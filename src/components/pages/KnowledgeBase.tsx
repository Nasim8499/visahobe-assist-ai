import { useRef, useState } from "react";
import { PageWrap } from "@/components/pages/ChatHistory";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileText, Trash2, FolderOpen, Loader2 } from "lucide-react";
import { useApp, KB_FOLDERS } from "@/contexts/AppContext";

const formatBytes = (b: number) => {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
};

export const KnowledgeBase = () => {
  const { kbFiles, addKbFiles, removeKbFile, exportKbManifest, kbBusy } = useApp();
  const [activeFolder, setActiveFolder] = useState<string>("General");
  const [filter, setFilter] = useState<string>("All");
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const visible = filter === "All" ? kbFiles : kbFiles.filter((f) => f.folder === filter);

  const handleFiles = (files: FileList | File[]) => {
    if (!files || (files as FileList).length === 0) return;
    void addKbFiles(files, activeFolder);
  };

  return (
    <PageWrap title="Knowledge Base" subtitle="Upload company docs to ground AI answers.">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={
          "gradient-border rounded-2xl p-[1px] transition-transform " +
          (drag ? "scale-[1.01]" : "")
        }
      >
        <div className={"rounded-2xl bg-card p-8 text-center " + (drag ? "bg-accent/40" : "")}>
          <Upload className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-3 font-display font-semibold">Drop files to upload</p>
          <p className="mt-1 text-sm text-muted-foreground">TXT, MD, CSV, JSON are read & made queryable from the Assistant</p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="text-xs text-muted-foreground self-center">Target folder:</span>
            {KB_FOLDERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFolder(f)}
                className={
                  "rounded-full border px-3 py-1 text-xs transition-colors " +
                  (activeFolder === f
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:bg-accent")
                }
              >
                {f}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
            <Button onClick={() => inputRef.current?.click()} disabled={kbBusy}>
              {kbBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {kbBusy ? "Uploading…" : "Choose files"}
            </Button>
            <Button variant="outline" onClick={exportKbManifest}>
              <Download className="mr-2 h-4 w-4" /> Export manifest
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Filter:</span>
        {(["All", ...KB_FOLDERS] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              "rounded-full border px-3 py-1 text-xs transition-colors " +
              (filter === f
                ? "border-primary bg-accent text-foreground"
                : "border-border bg-card hover:bg-accent")
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card">
        {visible.length === 0 ? (
          <div className="flex items-center gap-3 p-6 text-sm text-muted-foreground">
            <FolderOpen className="h-4 w-4" /> No documents in this view yet.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {visible.map((f) => (
              <li key={f.id} className="flex items-center gap-3 p-3">
                <FileText className="h-4 w-4 text-primary" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{f.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {f.folder} · {formatBytes(f.size)} · {new Date(f.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeKbFile(f.id)} aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageWrap>
  );
};
