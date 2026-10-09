import { clsx } from "clsx";

export const inputClasses = (isDark: boolean) =>
  clsx(
    "w-full rounded-xl border px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20",
    {
      "border-slate-700 bg-slate-950 text-slate-100": isDark,
      "border-slate-200 bg-white text-slate-900": !isDark,
    },
  );
