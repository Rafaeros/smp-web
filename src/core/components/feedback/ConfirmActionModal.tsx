"use client";

import { AlertTriangle, X, LucideIcon } from "lucide-react";
import { FormButton } from "@/src/core/components/forms/FormButton";

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
  icon?: LucideIcon;
  isLoading?: boolean;
}

export function ConfirmActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  icon: Icon = AlertTriangle,
  isLoading = false,
}: ConfirmActionModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: "text-red-600 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800",
    warning: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800",
    primary: "text-brand-purple bg-brand-purple/10 border-brand-purple/20",
  };

  const buttonVariants = {
    danger: "danger" as const,
    warning: "primary" as const,
    primary: "primary" as const,
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="p-6 flex flex-col items-center text-center gap-4">
          <div className={`p-3 rounded-full border ${variantStyles[variant]}`}>
            <Icon size={28} />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground leading-tight">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="p-4 bg-muted/30 border-t border-border flex gap-3">
          <FormButton
            variant="ghost"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </FormButton>
          <FormButton
            variant={buttonVariants[variant]}
            fullWidth
            isLoading={isLoading}
            onClick={async () => {
              await onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </FormButton>
        </div>
      </div>
    </div>
  );
}