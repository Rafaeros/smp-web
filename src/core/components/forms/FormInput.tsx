import { Eye, EyeOff, LucideIcon } from "lucide-react";
import { InputHTMLAttributes, useState } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  startIcon?: LucideIcon;
}

export function FormInput({ 
  label, 
  error, 
  startIcon: Icon, 
  type = "text",
  className = "",
  ...props 
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
          {label}
        </label>
      )}
      
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-purple transition-colors">
            <Icon size={18} />
          </div>
        )}

        <input
          {...props}
          type={inputType}
          className={`
            w-full py-3 bg-muted/50 border rounded-xl text-sm text-foreground transition-all outline-none placeholder-muted-foreground
            ${Icon ? "pl-10" : "pl-4"} 
            ${isPassword ? "pr-10" : "pr-4"}
            ${error 
              ? "border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-500/5" 
              : "border-transparent focus:bg-background focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 hover:bg-muted"
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <span className="text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
  );
}