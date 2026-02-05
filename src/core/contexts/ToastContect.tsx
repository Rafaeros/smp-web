"use client";

import { AnimatePresence } from "framer-motion";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Severity, Toast } from "../components/shared/Toast";

interface ToastContextData {
  showToast: (message: string, severity: Severity) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{
    message: string;
    severity: Severity;
  } | null>(null);

  const showToast = useCallback((message: string, severity: Severity) => {
    setToast({ message, severity });
  }, []);

  useEffect(() => {
    const handleEvent = (e: any) => {
      showToast(e.detail.message, e.detail.severity);
    };
    window.addEventListener("app-toast", handleEvent);
    return () => window.removeEventListener("app-toast", handleEvent);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-2">
        <AnimatePresence>
          {toast && (
            <Toast
              message={toast.message}
              severity={toast.severity}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
