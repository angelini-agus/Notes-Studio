import { FolderKanban, LogOut, Plus, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Category } from '../types';

interface CategorySidebarProps {
  sessionEmail: string | null;
  categories: Category[];
  categoryCounts: Record<string, number>;
  totalNotes: number;
  activeCategoryId?: string;
  onCategoryChange: (categoryId?: string) => void;
  onCreateCategory: (name: string) => Promise<boolean>;
  onRequestDeleteCategory: (category: Category) => void;
  onLogout: () => void;
}

export function CategorySidebar({
  sessionEmail,
  categories,
  categoryCounts,
  totalNotes,
  activeCategoryId,
  onCategoryChange,
  onCreateCategory,
  onRequestDeleteCategory,
  onLogout,
}: CategorySidebarProps) {
  const [nextCategory, setNextCategory] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onCreateCategory(nextCategory);
    setNextCategory('');
  }

  return (
    <aside className="panel-border panel-surface animate-fade-up-soft flex h-full flex-col rounded-[28px] border p-5 shadow-panel backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <FolderKanban size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-400">Workspace</p>
          <h1 className="text-lg font-semibold text-slate-900">Notes Studio</h1>
          {sessionEmail && <p className="truncate text-sm text-zinc-500">{sessionEmail}</p>}
        </div>

        <button
          className="panel-border flex h-10 w-10 items-center justify-center rounded-2xl border bg-white text-zinc-500 transition hover:border-zinc-400 hover:text-slate-900"
          onClick={onLogout}
          type="button"
        >
          <LogOut size={16} />
        </button>
      </div>

      <div className="mt-8">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-400">Categories</p>
        <div className="mt-3 space-y-2">
          <button
            className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
              !activeCategoryId
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'panel-border bg-zinc-50 text-zinc-700 hover:border-zinc-400'
            }`}
            onClick={() => onCategoryChange(undefined)}
            type="button"
          >
            <span>All notes</span>
            <span className="text-xs opacity-75">{totalNotes}</span>
          </button>

          {categories.map((category) => (
            <div
              key={category.id}
              className={`flex items-center gap-2 rounded-2xl border px-3 py-2 transition ${
                activeCategoryId === category.id
                  ? 'border-accent-600 bg-accent-50'
                  : 'panel-border bg-white hover:border-zinc-400'
              }`}
            >
              <button
                className={`flex min-w-0 flex-1 items-center justify-between rounded-xl px-1 py-1 text-sm ${
                  activeCategoryId === category.id ? 'text-accent-600' : 'text-zinc-700'
                }`}
                onClick={() => onCategoryChange(category.id)}
                type="button"
              >
                <span className="truncate">{category.name}</span>
                <span className="ml-3 shrink-0 text-xs font-medium opacity-70">
                  {categoryCounts[category.id] ?? 0}
                </span>
              </button>

              <button
                className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-100 hover:text-rose-500"
                onClick={() => onRequestDeleteCategory(category)}
                type="button"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <form className="mt-auto space-y-3 pt-8" onSubmit={handleSubmit}>
        <label className="block text-xs font-medium uppercase tracking-[0.24em] text-zinc-400">
          New Category
        </label>
        <div className="flex gap-2">
          <input
            className="panel-border w-full rounded-2xl border bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-accent-600 focus:bg-white"
            onChange={(event) => setNextCategory(event.target.value)}
            placeholder="Design"
            value={nextCategory}
          />
          <button
            className="panel-border flex h-12 w-12 items-center justify-center rounded-2xl border bg-white text-zinc-600 transition hover:border-zinc-400 hover:text-slate-900"
            type="submit"
          >
            <Plus size={16} />
          </button>
        </div>
      </form>
    </aside>
  );
}
