"use client";

import { useEffect, useState } from "react";
import { User, Save, X } from "lucide-react";
import { FormButton } from "@/src/core/components/forms/FormButton";
import { FormContainer } from "@/src/core/components/forms/FormContainer";
import { FormInput } from "@/src/core/components/forms/FormInput";
import { clientService } from "../services/client.service";
import { Client } from "../types/client";

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  client?: Client | null;
}

export function ClientFormModal({ isOpen, onClose, onSuccess, client }: ClientFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    setName(client?.name || "");
  }, [client, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (client) {
        await clientService.update(client.id, { ...client, name }); 
      } else {
        await clientService.create({ name });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <FormContainer
        title={client ? "Editar Cliente" : "Novo Cliente"}
        description="Clientes são vinculados às Ordens de Produção."
        onSubmit={handleSubmit}
        className="max-w-md relative"
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
              <Save size={18} /> SALVAR
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

        <FormInput
          label="Nome do Cliente / Empresa"
          placeholder="Ex: Lanx Cables Ltda"
          startIcon={User}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </FormContainer>
    </div>
  );
}