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

  async function handleConfirmDialog() {
    if (!dialogState) {
      return;
    }

    if (dialogState.type === 'note') {
      const didDelete = await deleteSelected();
      if (didDelete) {
        setDialogState(null);
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
    logout();
    notify({
      title: 'Signed out',
      message: 'You have been returned to the login screen.',
      tone: 'info',
    });
  }

  return (
    <>
      {isAuthenticated ? (
        <main className="min-h-screen px-4 py-5 text-slate-900 md:px-8 md:py-8">
          <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[280px_minmax(320px,1fr)_420px]">
            <CategorySidebar
              activeCategoryId={activeCategoryId}
              categories={categories}
              categoryCounts={categoryCounts}
              onCategoryChange={changeCategoryFilter}
              onCreateCategory={createCategory}
              onLogout={handleLogout}
              onRequestDeleteCategory={(category) => setDialogState({ type: 'category', category })}
              sessionEmail={sessionEmail}
              totalNotes={viewNoteCount}
            />

            <section className="animate-fade-up-soft-delay-1 space-y-5">
              <NotesHeader
                onCreate={startCreate}
                onViewChange={changeView}
                totalNotes={notes.length}
                view={view}
              />

              {isLoading ? (
                <div className="panel-border animate-fade-up-soft-delay-2 rounded-[28px] border bg-white/70 px-6 py-16 text-center text-sm text-zinc-500 shadow-panel">
                  Loading notes...
                </div>
              ) : (
                <NotesList
                  notes={notes}
                  onRequestDelete={() => setDialogState({ type: 'note' })}
                  onSelect={selectNote}
                  onToggleArchive={archiveSelected}
                  selectedNoteId={selectedNote?.id ?? null}
                />
              )}
            </section>

            <NoteEditor
              categories={categories}
              draft={draft}
              isSaving={isSaving}
              saveFeedback={saveFeedback}
              onChange={updateDraft}
              onSave={saveNote}
              onToggleCategory={toggleDraftCategory}
              selectedNote={selectedNote}
            />
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
        </main>
      ) : (
        <LoginScreen isSubmitting={isAuthenticating} onSubmit={handleLogin} />
      )}

      <ToastViewport onDismiss={dismissToast} toasts={toasts} />
    </>
  );
}

export default App;
