import { Category, Note, NotePayload } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
const API_KEY = import.meta.env.VITE_API_KEY ?? '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      // Todas las peticiones incluyen la API key para autenticar con el backend
      'x-api-key': API_KEY,
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

export interface NoteCountsResult {
  counts: Record<string, number>;
  total: number;
}

export const api = {
  getNotes(view: 'active' | 'archived', categoryId?: string) {
    const base = view === 'archived' ? '/notes/archived' : '/notes';
    const params = categoryId ? `?categoryId=${categoryId}` : '';
    return request<Note[]>(`${base}${params}`);
  },

  /**
   * Obtiene cuántas notas activas/archivadas pertenecen a cada categoría,
   * y el total de notas en esa vista. Usa GROUP BY en el servidor.
   */
  getCounts(view: 'active' | 'archived') {
    const archived = view === 'archived' ? 'true' : 'false';
    return request<NoteCountsResult>(`/notes/counts?archived=${archived}`);
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
