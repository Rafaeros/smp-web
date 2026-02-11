import { cn } from "@/src/core/lib/utils";

interface TableWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function TableWrapper({ children, className, ...props }: TableWrapperProps) {
  return (
    <div 
      className={cn("flex-1 min-h-0 relative", className)} 
      {...props}
    >
      {children}
    </div>
  );
}