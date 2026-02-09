import { ReactNode } from "react";

interface FormContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  footer?: ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

export function FormContainer({ 
  children, 
  title, 
  description, 
  footer,
  className = "",
  onSubmit 
}: FormContainerProps) {
  return (
    <div className={`w-full bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-300 ${className}`}>
      {(title || description) && (
        <div className="p-8 pb-0 text-center">
          {title && <h2 className="text-2xl font-bold text-foreground tracking-tight">{title}</h2>}
          {description && <p className="text-muted-foreground mt-2 text-sm">{description}</p>}
        </div>
      )}
      <form onSubmit={onSubmit} className="p-8 space-y-6">
        {children}
        {footer && (
          <div className="pt-2 mt-4">
            {footer}
          </div>
        )}
      </form>
    </div>
  );
}