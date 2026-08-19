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
    <section className="panel-border panel-surface animate-fade-up-soft-delay-2 flex h-full max-h-full flex-col rounded-[28px] border p-5 shadow-panel backdrop-blur xl:overflow-hidden">
      {/* Botón "volver" — solo visible en mobile */}
      {onBack && (
        <button
          className="xl:hidden mb-4 flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-slate-900"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft size={15} />
          Back to notes
        </button>
      )}

      <div className="flex shrink-0 items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-400">Editor</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">
            {selectedNote ? 'Update note' : 'Create note'}
          </h3>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
            onClick={onSave}
            type="button"
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save note'}
          </button>

          <div className="h-5 text-xs text-zinc-500">
            {saveFeedback === 'saved' && !isSaving && (
              <span className="animate-pulse-in-soft inline-flex items-center gap-1.5 text-emerald-600">
                <Check size={14} />
                Changes saved
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-1 min-h-0 flex-col space-y-4 overflow-y-auto pr-1 custom-scrollbar">
        <div className="shrink-0">
          <label className="mb-2 block text-sm font-medium text-zinc-600">Title</label>
          <input
            className="w-full rounded-2xl border border-zinc-300/90 bg-zinc-50 px-4 py-3 text-slate-900 outline-none transition focus:border-accent-600 focus:bg-white"
            onChange={(event) => onChange('title', event.target.value)}
            placeholder="Roadmap ideas"
            value={draft.title}
          />
        </div>

        <div className="flex flex-1 min-h-[160px] flex-col">
          <label className="mb-2 block text-sm font-medium text-zinc-600">Content</label>
          <textarea
            className="min-h-[160px] w-full flex-1 resize-none rounded-3xl border border-zinc-300/90 bg-zinc-50 px-4 py-4 text-slate-900 outline-none transition focus:border-accent-600 focus:bg-white"
            onChange={(event) => onChange('content', event.target.value)}
            placeholder="Capture the note details here..."
            value={draft.content}
          />
        </div>

        <div className="shrink-0 pb-1">
          <label className="mb-2.5 block text-sm font-medium text-zinc-600">Categories</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = draft.categoryIds.includes(category.id);

              return (
                <button
                  key={category.id}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    isActive
                      ? 'border-accent-600 bg-accent-50 text-accent-600'
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
