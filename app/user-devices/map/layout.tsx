"use client";

import { Sidebar } from "@/src/features/navigation/components/Sidebar";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans transition-colors duration-300 overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-muted/10 transition-all duration-300">
        <div className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto h-screen">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}