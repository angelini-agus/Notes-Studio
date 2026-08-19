import { FolderKanban, LayoutList, PenLine } from 'lucide-react';
import { useState } from 'react';
import { CategorySidebar } from './components/CategorySidebar';
import { ConfirmDialog } from './components/ConfirmDialog';
import { LoginScreen } from './components/LoginScreen';
import { NoteEditor } from './components/NoteEditor';
import { NotesHeader } from './components/NotesHeader';
import { NotesList } from './components/NotesList';
import { ToastViewport } from './components/ToastViewport';
import { useAuth } from './hooks/useAuth';
import { useNotifications } from './hooks/useNotifications';
import { useNotesApp } from './hooks/useNotesApp';
import { Category } from './types';

type DialogState =
  | { type: 'note' }
  | { type: 'category'; category: Category }
  | null;

type MobilePanel = 'sidebar' | 'list' | 'editor';

function App() {
  const { dismissToast, notify, toasts } = useNotifications();
  const { isAuthenticated, login, logout, sessionEmail } = useAuth();
  const {
    categories,
    categoryCounts,
    activeCategoryId,
    changeCategoryFilter,
    changeView,
    createCategory,
    deleteCategory,
    deleteSelected,
    draft,
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
  } = useNotesApp(notify, isAuthenticated);

  const [dialogState, setDialogState] = useState<DialogState>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  // Panel activo en mobile. En desktop siempre se muestran los 3 simultáneamente.
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('list');

  // --- Handlers con navegación mobile integrada ---

  function handleSelectNote(noteId: string) {
    selectNote(noteId);
    setMobilePanel('editor');
  }

  function handleStartCreate() {
    startCreate();
    setMobilePanel('editor');
  }

  function handleCategoryChange(categoryId?: string) {
    changeCategoryFilter(categoryId);
    setMobilePanel('list');
  }

  async function handleConfirmDialog() {
    if (!dialogState) {
      return;
    }

    if (dialogState.type === 'note') {
      const didDelete = await deleteSelected();
      if (didDelete) {
        setDialogState(null);
        setMobilePanel('list');
      }
      return;
    }

    const didDelete = await deleteCategory(dialogState.category.id);
    if (didDelete) {
      setDialogState(null);
    }
  }

  async function handleLogin(credentials: { email: string; password: string }) {
    setIsAuthenticating(true);
    const result = await login(credentials.email, credentials.password);

    if (!result.ok) {
      notify({
        title: 'Sign in failed',
        message: result.message,
        tone: 'error',
      });
      setIsAuthenticating(false);
      return;
    }

    notify({
      title: 'Signed in',
      message: 'You now have access to the notes workspace.',
      tone: 'success',
    });
    setIsAuthenticating(false);
  }

  function handleLogout() {
    setDialogState(null);
    setMobilePanel('list');
    logout();
    notify({
      title: 'Signed out',
      message: 'You have been returned to the login screen.',
      tone: 'info',
    });
  }

  // Clases de visibilidad por panel en mobile
  const panelClass = (panel: MobilePanel) =>
    mobilePanel === panel ? 'block' : 'hidden xl:block';

  return (
    <>
      {isAuthenticated ? (
        // pb-20 en mobile para que la barra inferior no tape el contenido
        <main className="min-h-screen px-4 py-5 pb-20 text-slate-900 md:px-8 md:py-8 xl:h-dvh xl:overflow-hidden xl:pb-8">
          <div className="mx-auto max-w-7xl xl:grid xl:h-full xl:gap-5 xl:grid-cols-3">

            {/* Panel 1: Sidebar de categorías */}
            <div className={panelClass('sidebar')}>
              <CategorySidebar
                activeCategoryId={activeCategoryId}
                categories={categories}
                categoryCounts={categoryCounts}
                onCategoryChange={handleCategoryChange}
                onCreateCategory={createCategory}
                onLogout={handleLogout}
                onRequestDeleteCategory={(category) =>
                  setDialogState({ type: 'category', category })
                }
                sessionEmail={sessionEmail}
                totalNotes={viewNoteCount}
              />
            </div>

            {/* Panel 2: Lista de notas */}
            <section className={`animate-fade-up-soft-delay-1 space-y-5 ${panelClass('list')} xl:flex xl:flex-col xl:overflow-hidden`}>
              <NotesHeader
                onCreate={handleStartCreate}
                onViewChange={changeView}
                totalNotes={notes.length}
                view={view}
              />

              {/* Scroll interno: el header queda fijo arriba, la lista scrollea sola */}
              <div className="xl:flex-1 xl:min-h-0 xl:overflow-y-auto">
                {isLoading ? (
                  <div className="panel-border animate-fade-up-soft-delay-2 rounded-[28px] border bg-white/70 px-6 py-16 text-center text-sm text-zinc-500 shadow-panel">
                    Loading notes...
                  </div>
                ) : (
                  <NotesList
                    notes={notes}
                    onRequestDelete={() => setDialogState({ type: 'note' })}
                    onSelect={handleSelectNote}
                    onToggleArchive={archiveSelected}
                    selectedNoteId={selectedNote?.id ?? null}
                  />
                )}
              </div>
            </section>

            {/* Panel 3: Editor */}
            <div className={panelClass('editor')}>
              <NoteEditor
                categories={categories}
                draft={draft}
                isSaving={isSaving}
                saveFeedback={saveFeedback}
                onChange={updateDraft}
                onBack={() => setMobilePanel('list')}
                onSave={saveNote}
                onToggleCategory={toggleDraftCategory}
                selectedNote={selectedNote}
              />
            </div>
          </div>

          <ConfirmDialog
            confirmLabel={dialogState?.type === 'note' ? 'Delete note' : 'Delete category'}
            description={
              dialogState?.type === 'note'
                ? `This will permanently delete "${selectedNote?.title ?? 'this note'}".`
                : dialogState?.type === 'category'
                  ? `This will remove "${dialogState.category.name}" from the workspace and detach it from any linked notes.`
                  : ''
            }
            isLoading={isSaving}
            onCancel={() => setDialogState(null)}
            onConfirm={handleConfirmDialog}
            open={dialogState !== null}
            title={
              dialogState?.type === 'note'
                ? 'Delete note?'
                : dialogState?.type === 'category'
                  ? 'Delete category?'
                  : ''
            }
          />

          {/* Barra de navegación inferior — solo visible en mobile (oculta en xl) */}
          <nav className="xl:hidden fixed bottom-0 inset-x-0 z-40 border-t border-zinc-200/80 bg-white/90 backdrop-blur">
            <div className="flex">
              <button
                className={`flex flex-1 flex-col items-center gap-1 px-3 py-3 text-xs font-medium transition-colors ${
                  mobilePanel === 'sidebar' ? 'text-slate-900' : 'text-zinc-400 active:text-slate-900'
                }`}
                onClick={() => setMobilePanel('sidebar')}
                type="button"
              >
                <FolderKanban size={20} />
                <span>Categories</span>
              </button>

              <button
                className={`flex flex-1 flex-col items-center gap-1 px-3 py-3 text-xs font-medium transition-colors ${
                  mobilePanel === 'list' ? 'text-slate-900' : 'text-zinc-400 active:text-slate-900'
                }`}
                onClick={() => setMobilePanel('list')}
                type="button"
              >
                <LayoutList size={20} />
                <span>Notes</span>
                {notes.length > 0 && (
                  <span className={`-mt-0.5 text-[10px] font-semibold ${mobilePanel === 'list' ? 'text-slate-900' : 'text-zinc-400'}`}>
                    {notes.length}
                  </span>
                )}
              </button>

              <button
                className={`flex flex-1 flex-col items-center gap-1 px-3 py-3 text-xs font-medium transition-colors ${
                  mobilePanel === 'editor' ? 'text-slate-900' : 'text-zinc-400 active:text-slate-900'
                }`}
                onClick={() => setMobilePanel('editor')}
                type="button"
              >
                <PenLine size={20} />
                <span>Editor</span>
              </button>
            </div>
          </nav>
        </main>
      ) : (
        <LoginScreen isSubmitting={isAuthenticating} onSubmit={handleLogin} />
      )}

      <ToastViewport onDismiss={dismissToast} toasts={toasts} />
    </>
  );
}

export default App;
