import { Archive, FilePlus2 } from 'lucide-react';
import { NotesView } from '../types';

interface NotesHeaderProps {
  totalNotes: number;
  view: NotesView;
  onViewChange: (view: NotesView) => void;
  onCreate: () => void;
}

export function NotesHeader({
  totalNotes,
  view,
  onViewChange,
  onCreate,
}: NotesHeaderProps) {
  return (
    <div className="panel-border panel-surface animate-fade-up-soft flex flex-col gap-3.5 rounded-[24px] border p-4 shadow-panel backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400">Overview</p>
        <div className="mt-1 flex items-baseline gap-2">
          <h2 className="text-xl font-semibold text-slate-900">
            {view === 'active' ? 'Active notes' : 'Archived notes'}
          </h2>
          <span className="text-xs font-medium text-zinc-500">({totalNotes})</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="panel-border flex rounded-xl border bg-zinc-50 p-1">
          {(['active', 'archived'] as const).map((tab) => (
            <button
              key={tab}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                view === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-zinc-500 hover:text-slate-900'
              }`}
              onClick={() => onViewChange(tab)}
              type="button"
            >
              {tab === 'active' ? 'Inbox' : 'Archive'}
            </button>
          ))}
        </div>

        <button
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-slate-800"
          onClick={onCreate}
          type="button"
        >
          {view === 'active' ? <FilePlus2 size={14} /> : <Archive size={14} />}
          New note
        </button>
      </div>
    </div>
  );
}
