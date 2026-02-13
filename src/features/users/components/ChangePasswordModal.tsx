"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Save, X } from "lucide-react";
import { useToast } from "@/src/core/contexts/ToastContext";
import { userService } from "../services/user.service";
import { FormContainer } from "@/src/core/components/forms/FormContainer";
import { FormButton } from "@/src/core/components/forms/FormButton";
import { FormInput } from "@/src/core/components/forms/FormInput";

interface ChangePasswordModalProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({
  userId,
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      showToast("A nova senha deve ter pelo menos 6 caracteres.", "WARNING");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showToast("A confirmação da senha não confere.", "WARNING");
      return;
    }

    setLoading(true);
    try {
      await userService.updatePassword(userId, {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      onClose();
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <FormContainer
        className="max-w-md border-none shadow-2xl"
        onSubmit={handleSubmit}
        title="Alterar Senha"
        description="Para sua segurança, não compartilhe sua senha com terceiros."
        footer={
          <div className="flex gap-3">
            <FormButton
              type="button"
              variant="outline"
              fullWidth
              onClick={onClose}
              disabled={loading}
            >
              CANCELAR
            </FormButton>
            <FormButton
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loading}
            >
              <Save size={18} />
              SALVAR SENHA
            </FormButton>
          </div>
        }
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col gap-5">
          <FormInput
            label="Senha Atual"
            type="password"
            startIcon={Lock}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="••••••••"
          />

          <div className="h-px bg-border/50" />

          <FormInput
            label="Nova Senha"
            type="password"
            startIcon={Lock}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Mínimo 6 caracteres"
          />

          <FormInput
            label="Confirmar Nova Senha"
            type="password"
            startIcon={Lock}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            placeholder="Repita a nova senha"
            error={
              confirmNewPassword && newPassword !== confirmNewPassword
                ? "As senhas não conferem"
                : undefined
            }
          />
        </div>
      </FormContainer>
    </div>
  );
}