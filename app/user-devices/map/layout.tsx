"use client";

import { Sidebar } from "@/src/features/navigation/components/Sidebar";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-background text-foreground font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-muted/10 h-full relative">
        <div className="flex-1 w-full h-full flex flex-col overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
