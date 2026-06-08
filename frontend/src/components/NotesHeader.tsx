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
    <div className="panel-border panel-surface animate-fade-up-soft flex min-h-[142px] flex-col gap-5 rounded-[28px] border p-5 shadow-panel backdrop-blur md:min-h-[112px] md:flex-row md:items-center md:justify-between">
      <div className="md:min-w-[180px] md:max-w-[200px]">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-400">Overview</p>
        <h2 className="mt-2 min-h-[4rem] text-2xl font-semibold leading-8 text-slate-900">
          {view === 'active' ? 'Active notes' : 'Archived notes'}
        </h2>
        <span className="mt-1 block text-sm text-zinc-500">{totalNotes} items</span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row md:shrink-0 md:items-center">
        <div className="panel-border flex rounded-2xl border bg-zinc-50 p-1">
          {(['active', 'archived'] as const).map((tab) => (
            <button
              key={tab}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                view === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-zinc-500'
              }`}
              onClick={() => onViewChange(tab)}
              type="button"
            >
              {tab === 'active' ? 'Inbox' : 'Archive'}
            </button>
          ))}
        </div>

        <button
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          onClick={onCreate}
          type="button"
        >
          {view === 'active' ? <FilePlus2 size={16} /> : <Archive size={16} />}
          New note
        </button>
      </div>
    </div>
  );
}
