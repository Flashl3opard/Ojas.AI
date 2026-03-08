import { TextareaHTMLAttributes } from "react";

export function Textarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-500/40 transition placeholder:text-slate-400 focus:ring-4 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 ${className}`}
      {...props}
    />
  );
}
