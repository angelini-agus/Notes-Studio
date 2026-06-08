import { Category, Note, NotePayload } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const responseText = await response.text();

  if (!responseText) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}

export const api = {
  getNotes(view: 'active' | 'archived', categoryId?: string) {
    const url =
      view === 'archived'
        ? `/notes/archived${categoryId ? `?categoryId=${categoryId}` : ''}`
        : `/notes${categoryId ? `?categoryId=${categoryId}` : ''}`;

    return request<Note[]>(url);
  },
  createNote(payload: NotePayload) {
    return request<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  updateNote(noteId: string, payload: NotePayload) {
    return request<Note>(`/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  deleteNote(noteId: string) {
    return request<void>(`/notes/${noteId}`, {
      method: 'DELETE',
    });
  },
  archiveNote(noteId: string) {
    return request<Note>(`/notes/${noteId}/archive`, {
      method: 'PATCH',
    });
  },
  unarchiveNote(noteId: string) {
    return request<Note>(`/notes/${noteId}/unarchive`, {
      method: 'PATCH',
    });
  },
  getCategories() {
    return request<Category[]>('/categories');
  },
  createCategory(name: string) {
    return request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },
  deleteCategory(categoryId: string) {
    return request<void>(`/categories/${categoryId}`, {
      method: 'DELETE',
    });
  },
};
