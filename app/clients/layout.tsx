import { Sidebar } from "@/src/features/navigation/components/Sidebar";

export default function ClientsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto h-screen bg-muted/20">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}