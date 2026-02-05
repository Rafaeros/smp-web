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
  ERROR: <AlertCircle className="text-red-500" size={20} />,
  WARNING: <AlertTriangle className="text-amber-500" size={20} />,
  INFO: <Info className="text-blue-500" size={20} />,
  SUCCESS: <CheckCircle className="text-emerald-500" size={20} />,
};

const bgColors = {
  ERROR: "border-red-500/20 bg-red-50 dark:bg-red-950/20",
  WARNING: "border-amber-500/20 bg-amber-50 dark:bg-amber-950/20",
  INFO: "border-blue-500/20 bg-blue-50 dark:bg-blue-950/20",
  SUCCESS: "border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20",
};

export function Toast({ message, severity, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md min-w-[320px] max-w-md ${bgColors[severity]}`}
    >
      {icons[severity]}
      <p className="flex-1 text-sm font-medium text-foreground">{message}</p>
      <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
        <X size={16} />
      </button>
    </motion.div>
  );
}