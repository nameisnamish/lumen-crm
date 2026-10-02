import { Sparkles, TrendingUp, Bot, ShieldCheck } from "lucide-react";

/* Split-screen auth layout: rich blue gradient marketing panel on the left, glassmorphic form card on the right. */
export function AuthShell({ children }) {
  return (
    <div className="flex min-h-screen auth-form-bg">
      {/* Brand / marketing panel with vibrant blue gradient & glow orbs */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden auth-hero-gradient p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-cyan-400/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-[500px] w-[500px] rounded-full bg-sky-500/25 blur-3xl" />

        <div className="relative flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-lg shadow-sky-900/30">
            <Sparkles className="h-5 w-5 text-cyan-200" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white">Lumen CRM</span>
        </div>

        <div className="relative z-10">
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm">
            Close more deals with an AI co-pilot in your pipeline.
          </h2>
          <p className="mt-4 max-w-md text-sky-100/80 text-base leading-relaxed">
            Lumen CRM unifies your leads, contacts and follow-ups — then layers
            Gemini-powered summaries, email drafts and sales insights on top.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: TrendingUp, text: "Visual pipeline with drag-and-drop stages" },
              { icon: Bot, text: "AI lead scoring & instant email drafting" },
              { icon: ShieldCheck, text: "Secure JWT auth, your data stays yours" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
                  <Icon className="h-[18px] w-[18px] text-cyan-200" />
                </div>
                <span className="text-sm font-medium text-sky-50">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-sky-200/60">
          © {new Date().getFullYear()} Lumen. All rights reserved.
        </p>
      </div>

      {/* Form panel with glassmorphism card */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md auth-card-glass p-8 rounded-3xl animate-fade-up">
          {children}
        </div>
      </div>
    </div>
  );
}
