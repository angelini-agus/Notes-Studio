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
      <div className="panel-border animate-fade-up-soft-delay-1 rounded-[22px] border border-dashed bg-white/50 px-6 py-10 text-center text-sm text-zinc-500">
        There are no notes in this view yet.
      </div>
    );
  }

  return (
    <div className="space-y-2.5 pb-2">
      {notes.map((note) => {
        const isSelected = note.id === selectedNoteId;

        return (
          <article
            key={note.id}
            className={`rounded-[20px] border p-3.5 transition-all duration-200 ease-out ${
              isSelected
                ? 'border-slate-900 bg-slate-900 text-white shadow-[0_10px_25px_rgba(15,23,42,0.16)]'
                : 'panel-border panel-surface text-slate-900 shadow-panel hover:-translate-y-0.5 hover:border-zinc-400'
            }`}
          >
            <button className="w-full text-left" onClick={() => onSelect(note.id)} type="button">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold leading-snug">{note.title}</h3>
                  <p
                    className={`mt-1 text-xs leading-relaxed ${
                      isSelected ? 'text-slate-200 line-clamp-3' : 'text-zinc-500 line-clamp-2'
                    }`}
                  >
                    {note.content}
                  </p>
                </div>
                {isSelected ? (
                  <ArrowDownLeft size={15} className="mt-0.5 shrink-0 text-slate-300 transition-transform duration-200" />
                ) : (
                  <ArrowUpRight size={15} className="mt-0.5 shrink-0 text-zinc-400 transition-transform duration-200" />
                )}
              </div>
            </button>

            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {note.categories.map((category) => (
                  <span
                    key={category.id}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      isSelected
                        ? 'bg-white/15 text-slate-100'
                        : 'bg-accent-50 text-accent-600'
                    }`}
                  >
                    {category.name}
                  </span>
                ))}
              </div>

              {isSelected && (
                <div className="flex items-center gap-1.5">
                  <button
                    className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-2.5 py-1 text-[11px] text-white transition hover:border-white/40"
                    onClick={onToggleArchive}
                    type="button"
                  >
                    {note.isArchived ? <RotateCcw size={12} /> : <Archive size={12} />}
                    {note.isArchived ? 'Restore' : 'Archive'}
                  </button>
                  <button
                    className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-2.5 py-1 text-[11px] text-white transition hover:border-red-300 hover:text-red-200"
                    onClick={onRequestDelete}
                    type="button"
                  >
                    <Trash2 size={12} />
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
