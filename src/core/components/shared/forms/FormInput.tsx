import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormInput({ label, error, ...props }: FormInputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      <input
        {...props}
        className={`
          w-full px-4 py-2.5 rounded-xl border bg-card text-sm transition-all outline-none
          ${error 
            ? "border-red-500 focus:ring-2 focus:ring-red-500/20" 
            : "border-border focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
          }
          disabled:opacity-50 disabled:bg-muted/50
        `}
      />
      {error && <span className="text-[10px] text-red-500 font-bold ml-1">{error}</span>}
    </div>
  );
}