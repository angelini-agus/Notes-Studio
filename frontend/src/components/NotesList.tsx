import { Archive, ArrowDownLeft, ArrowUpRight, RotateCcw, Trash2 } from 'lucide-react';
import { Note } from '../types';

interface NotesListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelect: (noteId: string) => void;
  onToggleArchive: () => Promise<boolean | undefined>;
  onRequestDelete: () => void;
}

export function NotesList({
  notes,
  selectedNoteId,
  onSelect,
  onToggleArchive,
  onRequestDelete,
}: NotesListProps) {
  if (!notes.length) {
    return (
      <div className="panel-border animate-fade-up-soft-delay-1 rounded-[28px] border border-dashed bg-white/50 px-6 py-14 text-center text-sm text-zinc-500">
        There are no notes in this view yet.
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-2">
      {notes.map((note) => {
        const isSelected = note.id === selectedNoteId;

        return (
          <article
            key={note.id}
            className={`rounded-[24px] border p-4.5 transition-all duration-300 ease-out ${
              isSelected
                ? 'border-slate-900 bg-slate-900 text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)]'
                : 'panel-border panel-surface text-slate-900 shadow-panel hover:-translate-y-0.5 hover:border-zinc-400'
            }`}
          >
            <button className="w-full text-left" onClick={() => onSelect(note.id)} type="button">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold">{note.title}</h3>
                  <p
                    className={`mt-1.5 line-clamp-2 text-sm ${
                      isSelected ? 'text-slate-200' : 'text-zinc-500'
                    }`}
                  >
                    {note.content}
                  </p>
                </div>
                {isSelected ? (
                  <ArrowDownLeft size={16} className="shrink-0 text-slate-300 transition-transform duration-300" />
                ) : (
                  <ArrowUpRight size={16} className="shrink-0 text-zinc-400 transition-transform duration-300" />
                )}
              </div>
            </button>

            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {note.categories.map((category) => (
                  <span
                    key={category.id}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      isSelected
                        ? 'bg-white/10 text-slate-100'
                        : 'bg-accent-50 text-accent-600'
                    }`}
                  >
                    {category.name}
                  </span>
                ))}
              </div>

              {isSelected && (
                <div className="flex items-center gap-2">
                  <button
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-xs text-white transition hover:border-white/30"
                    onClick={onToggleArchive}
                    type="button"
                  >
                    {note.isArchived ? <RotateCcw size={14} /> : <Archive size={14} />}
                    {note.isArchived ? 'Restore' : 'Archive'}
                  </button>
                  <button
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-xs text-white transition hover:border-red-300 hover:text-red-200"
                    onClick={onRequestDelete}
                    type="button"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
