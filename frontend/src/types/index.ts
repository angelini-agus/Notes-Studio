export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  isArchived: boolean;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface NotePayload {
  title: string;
  content: string;
  categoryIds: string[];
}

export type NotesView = 'active' | 'archived';
