import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { DEMO_USER } from '../lib/auth';

interface LoginScreenProps {
  isSubmitting: boolean;
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
}

export function LoginScreen({ isSubmitting, onSubmit }: LoginScreenProps) {
  const [email, setEmail] = useState(DEMO_USER.email);
  const [password, setPassword] = useState(DEMO_USER.password);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({ email, password });
  }

  return (
    <main className="h-dvh overflow-hidden px-4 py-4 text-slate-900 md:px-8 md:py-6">
      <div className="mx-auto grid h-full max-w-6xl gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="panel-border panel-surface animate-fade-up-soft relative overflow-hidden rounded-[34px] border p-8 shadow-panel backdrop-blur md:p-10">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_52%)]" />

          <div className="relative flex h-full flex-col justify-between gap-8 md:gap-10">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-zinc-300/80 bg-white/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Notes Studio Access
              </div>

              <h1 className="mt-8 max-w-lg text-4xl font-semibold tracking-[-0.03em] text-slate-900 md:text-5xl">
                A focused login flow that feels native to the product.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600">
                Sign in with the demo account to access notes, categories, archive flows,
                and the polished workspace UI.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-zinc-300/80 bg-white/80 p-5">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-400">Default Email</p>
                <p className="mt-3 text-sm font-medium text-slate-900">{DEMO_USER.email}</p>
              </div>

              <div className="rounded-[28px] border border-zinc-300/80 bg-white/80 p-5">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-400">Default Password</p>
                <p className="mt-3 text-sm font-medium tracking-[0.2em] text-slate-900">
                  {'•'.repeat(DEMO_USER.password.length)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="panel-border panel-surface animate-fade-up-soft-delay-1 flex items-center rounded-[34px] border p-6 shadow-panel backdrop-blur md:p-8">
          <div className="w-full">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-400">Sign in</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-900">
                Welcome back
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Use the demo credentials below or edit them to test validation messages.
              </p>
            </div>

            <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-600">Email</span>
                <div className="panel-border flex items-center gap-3 rounded-2xl border bg-zinc-50 px-4 py-3">
                  <Mail size={16} className="text-zinc-400" />
                  <input
                    className="w-full bg-transparent text-slate-900 outline-none"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    type="text"
                    value={email}
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-600">Password</span>
                <div className="panel-border flex items-center gap-3 rounded-2xl border bg-zinc-50 px-4 py-3">
                  <LockKeyhole size={16} className="text-zinc-400" />
                  <input
                    className="w-full bg-transparent text-slate-900 outline-none"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                  />
                </div>
              </label>

              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
              >
                <span>{isSubmitting ? 'Signing in...' : 'Continue to workspace'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
