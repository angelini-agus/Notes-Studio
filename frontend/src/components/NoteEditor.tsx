import { ArrowLeft, Check, Save } from 'lucide-react';
import { Category, Note } from '../types';

interface NoteEditorProps {
  categories: Category[];
  draft: {
    title: string;
    content: string;
    categoryIds: string[];
  };
  selectedNote: Note | null;
  isSaving: boolean;
  saveFeedback: 'idle' | 'saved';
  onChange: (field: 'title' | 'content' | 'categoryIds', value: string | string[]) => void;
  onToggleCategory: (categoryId: string) => void;
  onSave: () => Promise<boolean>;
  /** Solo en mobile: vuelve al panel de lista de notas */
  onBack?: () => void;
}

export function NoteEditor({
  categories,
  draft,
  selectedNote,
  isSaving,
  saveFeedback,
  onChange,
  onToggleCategory,
  onSave,
  onBack,
}: NoteEditorProps) {
  return (
    <section className="panel-border panel-surface animate-fade-up-soft-delay-2 flex h-full max-h-full flex-col rounded-[24px] border p-4 shadow-panel backdrop-blur xl:overflow-hidden">
      {/* Botón "volver" — solo visible en mobile */}
      {onBack && (
        <button
          className="xl:hidden mb-3 flex items-center gap-1.5 text-xs text-zinc-500 transition hover:text-slate-900"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft size={14} />
          Back to notes
        </button>
      )}

      <div className="flex shrink-0 items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400">Editor</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            {selectedNote ? 'Update note' : 'Create note'}
          </h3>
        </div>

        <div className="flex flex-col items-end gap-1">
          <button
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
            onClick={onSave}
            type="button"
          >
            <Save size={14} />
            {isSaving ? 'Saving...' : 'Save note'}
          </button>

          <div className="h-4 text-[11px] text-zinc-500">
            {saveFeedback === 'saved' && !isSaving && (
              <span className="animate-pulse-in-soft inline-flex items-center gap-1 text-emerald-600">
                <Check size={12} />
                Saved
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3.5 flex flex-1 min-h-0 flex-col space-y-3.5 overflow-y-auto pr-1 custom-scrollbar">
        <div className="shrink-0">
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Title</label>
          <input
            className="w-full rounded-xl border border-zinc-300/90 bg-zinc-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-accent-600 focus:bg-white"
            onChange={(event) => onChange('title', event.target.value)}
            placeholder="Roadmap ideas"
            value={draft.title}
          />
        </div>

        <div className="flex flex-1 min-h-[140px] flex-col">
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Content</label>
          <textarea
            className="min-h-[140px] w-full flex-1 resize-none rounded-2xl border border-zinc-300/90 bg-zinc-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-accent-600 focus:bg-white"
            onChange={(event) => onChange('content', event.target.value)}
            placeholder="Capture the note details here..."
            value={draft.content}
          />
        </div>

        <div className="shrink-0 pb-1">
          <label className="mb-2 block text-xs font-medium text-zinc-600">Categories</label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((category) => {
              const isActive = draft.categoryIds.includes(category.id);

              return (
                <button
                  key={category.id}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    isActive
                      ? 'border-accent-600 bg-accent-50 text-accent-600 font-medium'
                      : 'border-zinc-300/90 bg-white text-zinc-600 hover:border-zinc-400'
                  }`}
                  onClick={() => onToggleCategory(category.id)}
                  type="button"
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
