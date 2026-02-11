import { cn } from "@/src/core/lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageContainer({ children, className, ...props }: PageContainerProps) {
  return (
    <div 
      className={cn("flex flex-col h-full w-full p-4 md:p-6 gap-4", className)} 
      {...props}
    >
      {children}
    </div>
  );
}