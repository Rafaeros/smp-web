"use client";

import { Sidebar } from "@/src/features/navigation/components/Sidebar";

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen min-h-125 w-full bg-background text-foreground font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-muted/10 h-full relative">
        <div className="flex-1 w-full h-full flex flex-col md:overflow-hidden overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}