import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { Toast } from '../hooks/useNotifications';

interface ToastViewportProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const toneMap = {
  success: {
    icon: CheckCircle2,
    iconClassName: 'bg-emerald-50 text-emerald-600',
  },
  error: {
    icon: AlertCircle,
    iconClassName: 'bg-rose-50 text-rose-600',
  },
  info: {
    icon: Info,
    iconClassName: 'bg-sky-50 text-sky-600',
  },
};

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = toneMap[toast.tone].icon;

        return (
          <div
            key={toast.id}
            className="panel-border panel-surface animate-pulse-in-soft pointer-events-auto rounded-[24px] border p-4 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur"
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${toneMap[toast.tone].iconClassName}`}
              >
                <Icon size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
                <p className="mt-1 text-sm leading-6 text-zinc-600">{toast.message}</p>
              </div>

              <button
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-100 hover:text-slate-900"
                onClick={() => onDismiss(toast.id)}
                type="button"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
