"use client";

import { Severity, Toast } from "@/src/core/components/feedback/Toast";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { destroyCookie, parseCookies } from "nookies";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface ToastContextData {
  showToast: (message: string, severity: Severity) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{
    message: string;
    severity: Severity;
  } | null>(null);

  const pathname = usePathname();

  const showToast = useCallback((message: string, severity: Severity) => {
    setToast({ message, severity });
  }, []);

  useEffect(() => {
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      showToast(customEvent.detail.message, customEvent.detail.severity);
    };
    window.addEventListener("app-toast", handleEvent);
    return () => window.removeEventListener("app-toast", handleEvent);
  }, [showToast]);
  useEffect(() => {
    const timer = setTimeout(() => {
      const cookies = parseCookies();
      const flashMessage = cookies["smp.flash"];

      if (flashMessage) {
        try {
          const { message, severity } = JSON.parse(flashMessage);
          showToast(message, severity);
          destroyCookie(null, "smp.flash", { path: "/" });
        } catch (error) {
          console.error("Erro ao ler flash message", error);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-9999 flex flex-col gap-2 pointer-events-none items-center">
        <AnimatePresence mode="wait">
          {toast && (
            <div className="pointer-events-auto">
              <Toast
                key={toast.message}
                message={toast.message}
                severity={toast.severity}
                onClose={() => setToast(null)}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
