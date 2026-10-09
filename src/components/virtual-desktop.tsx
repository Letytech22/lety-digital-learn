import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Folder, FileText, Trash2, Image as ImageIcon, MousePointer2, X, Music, LayoutGrid } from 'lucide-react';
import type { LabExercise } from '@/lib/courses';

type Item = { id: string; label: string; kind: 'folder' | 'file' | 'bin'; x: number; y: number };
const layouts: Record<LabExercise['id'], Item[]> = {
  'single-click': [
    { id: 'photos', label: 'Photos', kind: 'folder', x: 6, y: 8 },
    { id: 'documents', label: 'Documents', kind: 'folder', x: 6, y: 42 },
    { id: 'notes', label: 'Notes', kind: 'file', x: 40, y: 18 },
    { id: 'bin', label: 'Recycle Bin', kind: 'bin', x: 74, y: 8 },
  ],
  'double-click': [
    { id: 'documents', label: 'Documents', kind: 'folder', x: 6, y: 8 },
    { id: 'music', label: 'Music', kind: 'folder', x: 6, y: 42 },
    { id: 'photos', label: 'Photos', kind: 'folder', x: 42, y: 24 },
    { id: 'bin', label: 'Recycle Bin', kind: 'bin', x: 74, y: 8 },
  ],
  'drag-file': [
    { id: 'letter', label: 'Letter', kind: 'file', x: 10, y: 14 },
    { id: 'music', label: 'Music', kind: 'folder', x: 70, y: 8 },
    { id: 'documents', label: 'Documents', kind: 'folder', x: 70, y: 46 },
  ],
};
const targets: Record<LabExercise['id'], string> = { 'single-click': 'documents', 'double-click': 'photos', 'drag-file': 'letter' };

export function VirtualDesktop({ exercise, showMe, onFeedback, onComplete, completed }: { exercise: LabExercise; showMe: boolean; onFeedback: (message: string) => void; onComplete: () => void; completed: boolean }) {
  const items = layouts[exercise.id];
  const desk = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [filed, setFiled] = useState(false);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const [drag, setDrag] = useState<{ id: string; dx: number; dy: number } | null>(null);
  const [moved, setMoved] = useState<Record<string, { x: number; y: number }>>({});
  const press = useRef<{ id: string; x: number; y: number; dragging: boolean } | null>(null);
  const lastTap = useRef<{ id: string; t: number } | null>(null);
  const target = targets[exercise.id];
  const label = (id: string) => items.find(i => i.id === id)?.label ?? id;

  function track(e: ReactPointerEvent) {
    const r = desk.current?.getBoundingClientRect();
    if (r) setPointer({ x: e.clientX - r.left, y: e.clientY - r.top });
  }
  function single(id: string) {
    setSelected(id);
    if (completed) return;
    if (exercise.id === 'single-click') {
      if (id === target) { onFeedback('Correct! Well done.'); onComplete(); }
      else onFeedback(`Not quite. That is ${label(id)}. Look for Documents.`);
    } else if (exercise.id === 'double-click') {
      onFeedback(id === target ? 'You selected Photos with one click. Now tap twice quickly to open it.' : `That is ${label(id)}. Look for the Photos folder.`);
    } else if (id === 'letter') onFeedback('Good, the file is selected. Now press, hold and slide it onto Documents.');
  }
  function double(id: string) {
    setSelected(id);
    if (items.find(i => i.id === id)?.kind !== 'file') setOpen(id);
    if (completed || exercise.id !== 'double-click') return;
    if (id === target) { onFeedback('Correct! Well done.'); onComplete(); }
    else onFeedback(`That opened ${label(id)}. Close it and open Photos instead.`);
  }
  function down(e: ReactPointerEvent, item: Item) {
    e.stopPropagation(); track(e);
    press.current = { id: item.id, x: e.clientX, y: e.clientY, dragging: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function move(e: ReactPointerEvent) {
    track(e);
    const p = press.current; if (!p) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    if (!p.dragging && Math.hypot(dx, dy) > 8) p.dragging = true;
    if (p.dragging) setDrag({ id: p.id, dx, dy });
  }
  function up(e: ReactPointerEvent) {
    track(e);
    const p = press.current; press.current = null; if (!p) return;
    if (!p.dragging) {
      const now = Date.now(); const last = lastTap.current;
      if (last && last.id === p.id && now - last.t < 450) { lastTap.current = null; double(p.id); }
      else { lastTap.current = { id: p.id, t: now }; single(p.id); }
      return;
    }
    setDrag(null);
    const over = document.elementsFromPoint(e.clientX, e.clientY).map(el => (el as HTMLElement).closest('[data-icon]')?.getAttribute('data-icon')).find(id => id && id !== p.id);
    if (p.id === 'letter' && over === 'documents') {
      setFiled(true); setSelected(null);
      if (!completed && exercise.id === 'drag-file') { onFeedback('Correct! Well done.'); onComplete(); }
      return;
    }
    const r = desk.current?.getBoundingClientRect(); const item = items.find(i => i.id === p.id);
    if (r && item) {
      const base = moved[p.id] ?? { x: item.x, y: item.y };
      setMoved(m => ({ ...m, [p.id]: { x: Math.min(85, Math.max(0, base.x + ((e.clientX - p.x) / r.width) * 100)), y: Math.min(70, Math.max(0, base.y + ((e.clientY - p.y) / r.height) * 100)) } }));
    }
    if (!completed && exercise.id === 'drag-file') onFeedback(over ? `You dropped it on ${label(over)}. Let go over Documents.` : 'Nearly! Keep holding until the file is over Documents, then let go.');
  }
  const hint = showMe && !completed ? (exercise.id === 'drag-file' ? ['letter', 'documents'] : [target]) : [];

  return (
    <div ref={desk} onPointerMove={track} onPointerDown={e => { track(e); setSelected(null); }} className="lab-desktop relative h-[380px] touch-none select-none overflow-hidden rounded-lg border border-border sm:h-[440px]" aria-label="Virtual computer desktop" role="application">
      {items.filter(i => !(i.id === 'letter' && filed)).map(item => {
        const pos = moved[item.id] ?? { x: item.x, y: item.y };
        const Icon = item.kind === 'folder' ? Folder : item.kind === 'bin' ? Trash2 : FileText;
        const dragging = drag?.id === item.id;
        return (
          <button key={item.id} data-icon={item.id} type="button" aria-label={item.label} onPointerDown={e => down(e, item)} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { press.current = null; setDrag(null); }}
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: dragging ? `translate(${drag.dx}px, ${drag.dy}px)` : undefined, zIndex: dragging ? 30 : 10 }}
            className={`absolute flex w-24 cursor-default flex-col items-center gap-1.5 rounded-md p-2 text-center outline-none transition-colors ${selected === item.id ? 'bg-primary/25 ring-1 ring-primary' : ''} ${hint.includes(item.id) ? 'lab-show-me' : ''} ${dragging ? 'opacity-80' : ''}`}>
            <Icon className={`size-11 ${item.kind === 'folder' ? 'fill-warm text-warm-foreground' : 'text-primary-foreground'}`} strokeWidth={1.4} />
            <span className="rounded-sm bg-foreground/40 px-1.5 text-xs font-medium text-background">{item.label}{item.id === 'documents' && filed ? ' (1)' : ''}</span>
          </button>
        );
      })}
      {open && (
        <div className="absolute inset-x-[6%] top-[14%] z-20 overflow-hidden rounded-md border border-border bg-card text-card-foreground shadow-lg" onPointerDown={e => e.stopPropagation()}>
          <div className="flex items-center justify-between bg-secondary px-3 py-1.5 text-xs font-semibold"><span className="flex items-center gap-2"><Folder className="size-4 text-primary" />{label(open)}</span><button type="button" aria-label="Close window" onClick={() => setOpen(null)} className="grid size-9 place-items-center rounded hover:bg-destructive hover:text-destructive-foreground"><X className="size-4" /></button></div>
          <div className="grid grid-cols-3 gap-3 p-4 text-center text-xs">
            {(open === 'photos' ? ['Family.jpg', 'Market.jpg', 'Sunset.jpg'] : open === 'documents' ? (filed ? ['Letter'] : []) : open === 'music' ? ['Song.mp3'] : []).map(f => <div key={f} className="flex flex-col items-center gap-1">{open === 'photos' ? <ImageIcon className="size-8 text-primary" /> : open === 'music' ? <Music className="size-8 text-primary" /> : <FileText className="size-8 text-primary" />}{f}</div>)}
            {open === 'documents' && !filed && <p className="col-span-3 text-muted-foreground">This folder is empty.</p>}
            {open === 'bin' && <p className="col-span-3 text-muted-foreground">The Recycle Bin is empty.</p>}
          </div>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 z-20 flex h-10 items-center justify-between bg-foreground/70 px-3 text-xs text-background"><span className="flex items-center gap-2"><LayoutGrid className="size-4" />Start</span><span>Lety Lab PC</span></div>
      <MousePointer2 aria-hidden className="pointer-events-none absolute z-40 size-6 fill-background text-foreground drop-shadow" style={{ left: pointer.x, top: pointer.y }} />
    </div>
  );
}
