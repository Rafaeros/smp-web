"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  History,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  PackageSearch,
  UserRoundSearch,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { APP_ROUTES } from "@/src/core/config/routes";
import { authService } from "@/src/features/auth/service/auth-service";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: APP_ROUTES.dashboard },
  { name: "Mapa Produção", icon: Map, href: APP_ROUTES.devices.map },
  {
    name: "Ordem de Produção",
    icon: ClipboardList,
    href: APP_ROUTES.orders.list,
  },
  { name: "Clientes", icon: UserRoundSearch, href: APP_ROUTES.clients.list },
  { name: "Produtos", icon: PackageSearch, href: APP_ROUTES.products.list },
  { name: "Logs", icon: History, href: APP_ROUTES.logs.list },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const SidebarContent = () => (
    <>
      <div
        className={`p-6 flex items-center justify-between shrink-0 ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        {!isCollapsed && (
          <div>
            <h1 className="text-2xl font-extrabold bg-linear-to-r from-[#7609e8] to-[#316ef3] bg-clip-text text-transparent">
              SMP
            </h1>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              IoT Industrial
            </span>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg border border-border bg-muted/50 hover:bg-muted text-muted-foreground transition-colors"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden text-muted-foreground"
        >
          <X size={24} />
        </button>
      </div>
      <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.name : ""}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? "bg-linear-to-r from-[#7609e8] to-[#316ef3] text-white shadow-lg shadow-blue-500/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <item.icon
                size={20}
                className={
                  isActive
                    ? "text-white"
                    : "text-muted-foreground group-hover:text-foreground"
                }
              />
              {!isCollapsed && (
                <span className="font-semibold text-sm truncate">
                  {item.name}
                </span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
      <div
        className={`p-4 border-t border-border mt-auto shrink-0 ${
          isCollapsed ? "items-center" : ""
        }`}
      >
        <div
          className={`flex items-center gap-3 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-9 h-9 min-w-9 rounded-full bg-linear-to-tr from-brand-purple/20 to-brand-blue/20 flex items-center justify-center text-xs font-bold text-brand-purple border border-brand-purple/10">
            RC
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground font-bold truncate">
                Rafael Costa
              </p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                Administrador
              </p>
            </div>
          )}
        </div>

        <button
          onClick={authService.logout}
          className={`mt-4 w-full flex items-center gap-3 p-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors font-bold text-xs ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={18} />
          {!isCollapsed && <span>ENCERRAR SESSÃO</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg text-brand-purple"
        >
          <Menu size={24} />
        </button>
      </div>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-72 bg-card border-r border-border z-50 flex flex-col md:hidden"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      <aside
        className={`hidden md:flex flex-col h-screen sticky top-0 bg-card border-r border-border transition-all duration-300 ease-in-out z-30 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
