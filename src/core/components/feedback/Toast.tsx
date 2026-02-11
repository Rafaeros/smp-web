"use client";

import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export type Severity = "ERROR" | "WARNING" | "INFO" | "SUCCESS";

interface ToastProps {
  message: string;
  severity: Severity;
  onClose: () => void;
  duration?: number;
}

const icons = {
  ERROR: <AlertCircle size={20} />,
  WARNING: <AlertTriangle size={20} />,
  INFO: <Info size={20} />,
  SUCCESS: <CheckCircle size={20} />,
};

const variantStyles = {
  SUCCESS: "bg-emerald-100 border-emerald-200 text-emerald-800 dark:bg-emerald-900/90 dark:border-emerald-800 dark:text-white",
  ERROR: "bg-red-100 border-red-200 text-red-800 dark:bg-red-900/90 dark:border-red-800 dark:text-white",
  WARNING: "bg-amber-100 border-amber-200 text-amber-800 dark:bg-amber-900/90 dark:border-amber-800 dark:text-white",
  INFO: "bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-900/90 dark:border-blue-800 dark:text-white",
};

export function Toast({ message, severity, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm 
        min-w-75 max-w-md 
        ${variantStyles[severity]}
      `}
    >
      <div className="shrink-0">
        {icons[severity]}
      </div>
      
      <p className="flex-1 text-sm font-semibold leading-relaxed">
        {message}
      </p>

      <button 
        onClick={onClose} 
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}