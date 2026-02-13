"use client";

import { FormButton } from "@/src/core/components/forms/FormButton";
import { FormContainer } from "@/src/core/components/forms/FormContainer";
import { FormInput } from "@/src/core/components/forms/FormInput";
import { Barcode, FileText, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { productService } from "../services/product.service";
import { Product } from "../types/product";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
}

export function ProductFormModal({
  isOpen,
  onClose,
  onSuccess,
  product,
}: ProductFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ code: "", description: "" });

  useEffect(() => {
    if (product) {
      setFormData({ code: product.code, description: product.description });
    } else {
      setFormData({ code: "", description: "" });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (product) {
        await productService.update(product.id, formData);
      } else {
        await productService.create(formData);
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
        title={product ? "Editar Produto" : "Novo Produto"}
        description={
          product
            ? "Atualize as informações do SKU"
            : "Cadastre um novo item no catálogo"
        }
        onSubmit={handleSubmit}
        className="max-w-md relative"
        footer={
          <div className="flex gap-3">
            <FormButton
              type="button"
              variant="outline"
              fullWidth
              onClick={onClose}
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
              {product ? "SALVAR ALTERAÇÕES" : "CADASTRAR PRODUTO"}
            </FormButton>
          </div>
        }
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-muted-foreground hover:text-foreground"
        >
          <X size={20} />
        </button>

        <div className="space-y-4">
          <FormInput
            label="Código do Produto (SKU)"
            placeholder="Ex: CAB-LAN-001"
            startIcon={Barcode}
            value={formData.code}
            onChange={(e) =>
              setFormData({ ...formData, code: e.target.value.toUpperCase() })
            }
            required
          />
          <FormInput
            label="Descrição"
            placeholder="Ex: Cabo de Rede Cat6 305m"
            startIcon={FileText}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
        </div>
      </FormContainer>
    </div>
  );
}
