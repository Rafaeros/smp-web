"use client";

import { Loader2 } from "lucide-react";
import { useCallback, useRef } from "react";

interface InfiniteScrollProps {
  children: React.ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  emptyMessage?: string;
  className?: string;
}

export function InfiniteScrollContainer({ 
  children, 
  onLoadMore, 
  hasMore, 
  loading,
  emptyMessage = "Nenhum registro encontrado.",
  className = "grid gap-3"
}: InfiniteScrollProps) {
  
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, onLoadMore]);

  const items = Array.isArray(children) ? children : [children];
  const hasItems = items.length > 0 && items[0] !== null && items[0] !== false;

  return (
    <div className={className}>
      {items.map((child, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} ref={isLast ? lastElementRef : null} className="w-full">
            {child}
          </div>
        );
      })}

      {loading && (
        <div className="flex justify-center py-6 col-span-full">
          <Loader2 className="animate-spin text-brand-purple w-8 h-8" />
        </div>
      )}
      
      {!loading && !hasMore && hasItems && (
        <div className="flex items-center justify-center gap-2 py-8 opacity-50">
           <div className="h-px bg-border w-12" />
           <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Fim da lista</p>
           <div className="h-px bg-border w-12" />
        </div>
      )}

      {!loading && !hasItems && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-xl bg-muted/30">
          <p className="text-sm font-medium">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}