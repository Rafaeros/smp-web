import { ButtonHTMLAttributes, ReactNode } from "react";

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  fullWidth?: boolean;
}

export function FormButton({
  children,
  isLoading,
  variant = "primary",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: FormButtonProps) {
  
  const baseStyles = "relative font-bold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const sizeStyles = "py-3.5 px-6 text-sm";
  
  const variants = {
    primary: "text-white bg-linear-to-r from-brand-purple to-brand-blue shadow-lg shadow-brand-blue/20 hover:opacity-90 hover:scale-[1.01]",
    secondary: "bg-foreground text-background hover:bg-foreground/90",
    outline: "border border-border bg-transparent text-foreground hover:bg-muted",
    ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20"
  };

  return (
    <button
      disabled={isLoading || disabled}
      className={`
        ${baseStyles} 
        ${sizeStyles} 
        ${variants[variant]} 
        ${fullWidth ? "w-full" : "w-auto"}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>PROCESSANDO...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}