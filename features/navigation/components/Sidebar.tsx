'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { LayoutDashboard, Map, ClipboardList, History } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Mapa Produção', icon: Map, href: '/dashboard/map' },
  { name: 'Ordem de Produção', icon: ClipboardList, href: '/dashboard/orders' },
  { name: 'Logs', icon: History, href: '/dashboard/logs' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0 md:flex transition-colors duration-300">
      
      <div className="p-6">
        <h1 className="text-2xl font-extrabold bg-linear-to-r from-[#7609e8] to-[#316ef3] bg-clip-text text-transparent">
          SMP
        </h1>
        <span className="text-xs text-muted-foreground uppercase tracking-widest">IoT Industrial</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-linear-to-r from-[#7609e8] to-[#316ef3] text-white shadow-lg shadow-blue-500/20' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
            RC
          </div>
          <div>
            <p className="text-sm text-foreground font-medium">Rafael Costa</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}