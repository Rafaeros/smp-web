import { cn } from "@/src/core/lib/utils";

interface PageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageContent({ children, className, ...props }: PageContentProps) {
  return (
    <div 
      className={cn(
        "flex-1 flex flex-col min-h-0 bg-card rounded-xl border border-border shadow-sm overflow-hidden", 
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}