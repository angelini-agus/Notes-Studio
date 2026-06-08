import { useCallback, useMemo, useState } from 'react';

export interface Toast {
  id: string;
  title: string;
  message: string;
  tone: 'success' | 'error' | 'info';
}

export function useNotifications() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { ...toast, id }]);

      window.setTimeout(() => {
        dismissToast(id);
      }, 3600);
    },
    [dismissToast],
  );

  return useMemo(
    () => ({
      dismissToast,
      notify,
      toasts,
    }),
    [dismissToast, notify, toasts],
  );
}
