import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Category, Note, NotePayload, NotesView } from '../types';

type NotifyFn = (notification: {
  title: string;
  message: string;
  tone: 'success' | 'error' | 'info';
}) => void;

const emptyDraft: NotePayload = {
  title: '',
  content: '',
  categoryIds: [],
};

export function useNotesApp(notify?: NotifyFn, enabled = true) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [viewNoteCount, setViewNoteCount] = useState(0);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>();
  const [view, setView] = useState<NotesView>('active');
  const [draft, setDraft] = useState<NotePayload>(emptyDraft);
  const [isCreating, setIsCreating] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<'idle' | 'saved'>('idle');
  const [error, setError] = useState<string | null>(null);

  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? null;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    void loadCategories();
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    void loadNotes(view, activeCategoryId);
  }, [enabled, view, activeCategoryId]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    void loadCategoryCounts(view);
  }, [enabled, view]);

  useEffect(() => {
    if (!selectedNote) {
      if (!selectedNoteId) {
        setDraft(emptyDraft);
      }
      return;
    }

    setDraft({
      title: selectedNote.title,
      content: selectedNote.content,
      categoryIds: selectedNote.categories.map((category) => category.id),
    });
  }, [selectedNote]);

  useEffect(() => {
    if (saveFeedback !== 'saved') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSaveFeedback('idle');
    }, 1400);

    return () => window.clearTimeout(timeoutId);
  }, [saveFeedback]);

  async function loadNotes(nextView: NotesView, categoryId?: string) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.getNotes(nextView, categoryId);
      setNotes(response);

      setSelectedNoteId((currentId) => {
        if (isCreating) {
          return currentId;
        }

        if (!currentId) {
          return response[0]?.id ?? null;
        }

        return response.some((note) => note.id === currentId)
          ? currentId
          : response[0]?.id ?? null;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not load notes.';
      setError(message);
      notify?.({
        title: 'Could not load notes',
        message,
        tone: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function loadCategoryCounts(nextView: NotesView) {
    try {
      const response = await api.getNotes(nextView);
      const nextCounts = response.reduce<Record<string, number>>((counts, note) => {
        for (const category of note.categories) {
          counts[category.id] = (counts[category.id] ?? 0) + 1;
        }

        return counts;
      }, {});

      setCategoryCounts(nextCounts);
      setViewNoteCount(response.length);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not load category counts.';
      setError(message);
    }
  }

  async function loadCategories() {
    try {
      const response = await api.getCategories();
      setCategories(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not load categories.';
      setError(message);
      notify?.({
        title: 'Could not load categories',
        message,
        tone: 'error',
      });
    }
  }

  function startCreate() {
    setIsCreating(true);
    setSelectedNoteId(null);
    setDraft(emptyDraft);
  }

  function selectNote(noteId: string) {
    if (selectedNoteId === noteId) {
      startCreate();
      return;
    }

    setIsCreating(false);
    setSelectedNoteId(noteId);
  }

  function updateDraft(field: keyof NotePayload, value: string | string[]) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleDraftCategory(categoryId: string) {
    setDraft((current) => ({
      ...current,
      categoryIds: current.categoryIds.includes(categoryId)
        ? current.categoryIds.filter((id) => id !== categoryId)
        : [...current.categoryIds, categoryId],
    }));
  }

  async function saveNote() {
    if (!draft.title.trim() || !draft.content.trim()) {
      const message = 'Title and content are required.';
      setError(message);
      notify?.({
        title: 'Note not saved',
        message,
        tone: 'error',
      });
      return false;
    }

    setIsSaving(true);
    setError(null);
    setSaveFeedback('idle');

    try {
      if (selectedNote) {
        await api.updateNote(selectedNote.id, {
          title: draft.title.trim(),
          content: draft.content.trim(),
          categoryIds: draft.categoryIds,
        });
        await loadNotes(view, activeCategoryId);
        await loadCategoryCounts(view);
        notify?.({
          title: 'Note updated',
          message: 'Your changes were saved successfully.',
          tone: 'success',
        });
      } else {
        await api.createNote({
          title: draft.title.trim(),
          content: draft.content.trim(),
          categoryIds: draft.categoryIds,
        });
        setSelectedNoteId(null);
        setDraft(emptyDraft);
        setIsCreating(true);

        const nextView: NotesView = 'active';
        const nextCategoryId =
          activeCategoryId && draft.categoryIds.includes(activeCategoryId)
            ? activeCategoryId
            : undefined;

        if (view !== nextView) {
          setView(nextView);
        }
        if (activeCategoryId !== nextCategoryId) {
          setActiveCategoryId(nextCategoryId);
        }

        await loadNotes(nextView, nextCategoryId);
        await loadCategoryCounts(nextView);
        notify?.({
          title: 'Note created',
          message: 'A new note was added to your inbox.',
          tone: 'success',
        });
      }

      setSaveFeedback('saved');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not save note.';
      setError(message);
      notify?.({
        title: 'Could not save note',
        message,
        tone: 'error',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function archiveSelected() {
    if (!selectedNote) {
      return;
    }

    setIsSaving(true);

    try {
      if (selectedNote.isArchived) {
        await api.unarchiveNote(selectedNote.id);
      } else {
        await api.archiveNote(selectedNote.id);
      }

      setIsCreating(false);
      await loadNotes(view, activeCategoryId);
      await loadCategoryCounts(view);
      notify?.({
        title: selectedNote.isArchived ? 'Note restored' : 'Note archived',
        message: selectedNote.isArchived
          ? 'The note is back in your inbox.'
          : 'The note was moved to the archive.',
        tone: 'success',
      });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not update archive state.';
      setError(message);
      notify?.({
        title: 'Archive action failed',
        message,
        tone: 'error',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteSelected() {
    if (!selectedNote) {
      return false;
    }

    setIsSaving(true);

    try {
      const noteTitle = selectedNote.title;
      await api.deleteNote(selectedNote.id);
      setIsCreating(false);
      setSelectedNoteId(null);
      await loadNotes(view, activeCategoryId);
      await loadCategoryCounts(view);
      notify?.({
        title: 'Note deleted',
        message: `"${noteTitle}" was removed.`,
        tone: 'success',
      });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not delete note.';
      setError(message);
      notify?.({
        title: 'Could not delete note',
        message,
        tone: 'error',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function createCategory(name: string) {
    const nextName = name.trim();

    if (!nextName) {
      notify?.({
        title: 'Category not created',
        message: 'Enter a category name before saving.',
        tone: 'error',
      });
      return false;
    }

    setError(null);

    try {
      const category = await api.createCategory(nextName);
      setCategories((current) => [...current, category].sort((a, b) => a.name.localeCompare(b.name)));
      setCategoryCounts((current) => ({
        ...current,
        [category.id]: 0,
      }));
      setDraft((current) => ({
        ...current,
        categoryIds: [...current.categoryIds, category.id],
      }));
      notify?.({
        title: 'Category created',
        message: `"${category.name}" is now available for filtering.`,
        tone: 'success',
      });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not create category.';
      setError(message);
      notify?.({
        title: 'Could not create category',
        message,
        tone: 'error',
      });
      return false;
    }
  }

  async function deleteCategory(categoryId: string) {
    setError(null);

    try {
      const categoryToDelete = categories.find((category) => category.id === categoryId);
      await api.deleteCategory(categoryId);

      setCategories((current) => current.filter((category) => category.id !== categoryId));
      setCategoryCounts((current) => {
        const nextCounts = { ...current };
        delete nextCounts[categoryId];
        return nextCounts;
      });
      setDraft((current) => ({
        ...current,
        categoryIds: current.categoryIds.filter((id) => id !== categoryId),
      }));

      if (activeCategoryId === categoryId) {
        setActiveCategoryId(undefined);
        await loadNotes(view, undefined);
        await loadCategoryCounts(view);
        notify?.({
          title: 'Category deleted',
          message: `"${categoryToDelete?.name ?? 'Category'}" was removed.`,
          tone: 'success',
        });
        return true;
      }

      await loadNotes(view, activeCategoryId);
      await loadCategoryCounts(view);
      notify?.({
        title: 'Category deleted',
        message: `"${categoryToDelete?.name ?? 'Category'}" was removed.`,
        tone: 'success',
      });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not delete category.';
      setError(message);
      notify?.({
        title: 'Could not delete category',
        message,
        tone: 'error',
      });
      return false;
    }
  }

  function clearError() {
    setError(null);
  }

  function changeView(nextView: NotesView) {
    setView(nextView);
  }

  function changeCategoryFilter(categoryId?: string) {
    setActiveCategoryId(categoryId);
  }

  return {
    categories,
    categoryCounts,
    activeCategoryId,
    changeCategoryFilter,
    changeView,
    clearError,
    createCategory,
    deleteCategory,
    deleteSelected,
    draft,
    error,
    isLoading,
    isSaving,
    notes,
    saveNote,
    saveFeedback,
    selectNote,
    selectedNote,
    startCreate,
    toggleDraftCategory,
    updateDraft,
    view,
    viewNoteCount,
    archiveSelected,
  };
}
