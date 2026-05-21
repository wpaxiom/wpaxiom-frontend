import { Square, AlignLeft, Circle } from "lucide-react";

export function EditorPreview() {
  return (
    <div className="lg:col-span-5 lg:mt-2">
      <div className="rounded-xl border border-line bg-surface overflow-hidden shadow-2xl shadow-black/40">
        <div className="px-3 py-2 flex items-center gap-2 border-b border-line bg-elevated/60">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
          </div>
          <span className="ml-2 text-[11px] font-mono text-subtle">wp-admin/post.php?action=edit</span>
        </div>
        <div className="grid grid-cols-[1fr,140px]">
          <div className="p-5 space-y-3">
            <div className="h-2.5 w-3/5 rounded bg-elevated" />
            <div className="h-2 w-full rounded bg-elevated/70" />
            <div className="h-2 w-11/12 rounded bg-elevated/70" />
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="aspect-square rounded-md bg-elevated border border-line/80 flex items-center justify-center">
                <Square size={14} strokeWidth={1.6} className="text-coral" />
              </div>
              <div className="aspect-square rounded-md bg-coral/10 border border-coral/30 flex items-center justify-center">
                <AlignLeft size={14} strokeWidth={1.6} className="text-coral" />
              </div>
              <div className="aspect-square rounded-md bg-elevated border border-line/80 flex items-center justify-center">
                <Circle size={14} strokeWidth={1.6} className="text-coral" />
              </div>
            </div>
            <div className="h-2 w-4/5 rounded bg-elevated/70 mt-3" />
          </div>
          <aside className="border-l border-line bg-base/40 p-3 space-y-3">
            <div className="text-[10px] font-mono text-subtle uppercase tracking-wider">Inspector</div>
            <div className="space-y-2">
              <div className="h-1.5 rounded bg-elevated" />
              <div className="h-6 rounded border border-line bg-base/60" />
              <div className="h-1.5 w-2/3 rounded bg-elevated" />
              <div className="h-6 rounded border border-line bg-base/60" />
              <div className="h-1.5 w-1/2 rounded bg-elevated" />
              <div className="grid grid-cols-3 gap-1">
                <div className="h-5 rounded bg-coral/30 border border-coral/40" />
                <div className="h-5 rounded bg-elevated" />
                <div className="h-5 rounded bg-elevated" />
              </div>
            </div>
          </aside>
        </div>
      </div>
      <div className="mt-3 text-[11px] font-mono text-subtle uppercase tracking-wider text-center">
        // block editor preview
      </div>
    </div>
  );
}
