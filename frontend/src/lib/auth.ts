// Credenciales del usuario demo leídas desde variables de entorno.
// Nunca hardcodear credenciales directamente en el código fuente.
export const DEMO_USER = {
  email: import.meta.env.VITE_DEMO_EMAIL ?? 'demo@notesstudio.app',
  password: import.meta.env.VITE_DEMO_PASSWORD ?? 'NotesDemo123!',
};

export const AUTH_STORAGE_KEY = 'notes-studio-session';
