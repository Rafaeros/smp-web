"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Calendar, Factory, Hash, Save, 
  Box, Users, Info, QrCode
} from "lucide-react";

import { PageHeader } from "@/src/core/components/layouts/PageHeader";
import { useToast } from "@/src/core/contexts/ToastContext";
import { FormContainer } from "@/src/core/components/forms/FormContainer";
import { FormButton } from "@/src/core/components/forms/FormButton";
import { FormInput } from "@/src/core/components/forms/FormInput";

import { orderService } from "@/src/features/orders/services/order.service";

import { ProductSearchInput } from "@/src/features/products/components/ProductSearchInput";
import { ClientSearchInput } from "@/src/features/clients/components/ClientSearchinput";

export default function NewOrderPage() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: "", 
    clientId: null as number | null,
    productId: null as number | null,
    totalQuantity: "",
    deliveryDate: "", 
  });

  const formatDateToBR = (isoDate: string) => {
    if (!isoDate) return "";
    if (isoDate.includes("/")) return isoDate;
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleCodeBlur = () => {
    if (!formData.code) return;
    const rawNumber = formData.code.replace(/\D/g, '');
    
    if (rawNumber) {
      const formattedCode = `OP-${rawNumber.padStart(7, '0')}`;
      setFormData((prev) => ({ ...prev, code: formattedCode }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code) {
        showToast("O código da ordem é obrigatório.", "ERROR");
        return;
    }
    if (!formData.clientId || !formData.productId) {
        showToast("Por favor, selecione um Cliente e um Produto.", "ERROR");
        return;
    }

    setLoading(true);
    
    try {
      const qtdTotal = Number(formData.totalQuantity) || 0;
      const rawNumber = formData.code.replace(/\D/g, '');
      const finalCode = `OP-${rawNumber.padStart(7, '0')}`;
      const payload: any = {
        code: finalCode,
        clientId: formData.clientId, 
        productId: formData.productId,  
        deliveryDate: formatDateToBR(formData.deliveryDate),
        totalQuantity: qtdTotal,
        producedQuantity: 0,
        status: "RELEASED"             
      };

      await orderService.create(payload);
      
      showToast("Ordem de Produção criada com sucesso!", "SUCCESS");
      
      setTimeout(() => {
         router.push("/orders");
      }, 500);

    } catch (error: any) {
      console.error("Erro ao criar ordem:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4 md:p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="flex flex-col gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand-purple transition-colors w-fit group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para lista
        </button>

        <PageHeader
          title="Nova Ordem de Produção"
          subtitle="Crie uma nova OP vinculando cliente e produto"
          icon={Factory}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <FormContainer
            onSubmit={handleSubmit}
            footer={
              <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-border/50 pt-6">
                <FormButton type="button" variant="ghost" onClick={() => router.back()} disabled={loading}>
                  CANCELAR
                </FormButton>
                <FormButton type="submit" isLoading={loading} variant="primary">
                  <Save size={18} /> SALVAR ORDEM
                </FormButton>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FormInput
                  label="Código da Ordem (OP)"
                  name="code"
                  type="text"
                  startIcon={QrCode}
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  onBlur={handleCodeBlur}
                  required
                  placeholder="Ex: 123 (será formatado para OP-0000123)"
                  className="font-mono text-brand-purple font-bold"
                />
              </div>

              <div className="h-px bg-border/50 md:col-span-2 my-1" />
              <div className="md:col-span-2 space-y-2">
                 <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Users size={12} /> Cliente Destino
                 </label>
                 <ClientSearchInput 
                    onClientSelect={(client) => setFormData({...formData, clientId: client.id})} 
                 />
              </div>

              <div className="md:col-span-2 space-y-2">
                 <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Box size={12} /> Produto a ser Fabricado
                 </label>
                 <ProductSearchInput 
                    onProductSelect={(product) => setFormData({...formData, productId: product.id})} 
                 />
              </div>

              <div className="h-px bg-border/50 md:col-span-2 my-2" />
              
              <FormInput
                label="Quantidade Planejada"
                name="totalQuantity"
                type="number"
                startIcon={Hash}
                value={formData.totalQuantity}
                onChange={(e) => setFormData({...formData, totalQuantity: e.target.value})}
                required
                min={1}
                placeholder="Ex: 5000"
              />

              <FormInput
                label="Data de Entrega Limite"
                name="deliveryDate"
                type="date"
                startIcon={Calendar}
                value={formData.deliveryDate}
                onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
                required
              />

            </div>
          </FormContainer>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-brand-purple/5 border border-brand-purple/10 rounded-2xl p-6 shadow-sm sticky top-6">
            <h4 className="text-foreground font-bold text-sm mb-4 flex items-center gap-2">
              <Info size={18} className="text-brand-purple"/> Padrão de Código
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              O código da Ordem de Produção deve seguir o padrão <strong>OP-XXXXXXX</strong> (7 dígitos).
              <br/><br/>
              <strong>Dica:</strong> Você pode digitar apenas os números (ex: <span className="font-mono bg-muted px-1 rounded">123</span>) e o sistema formatará automaticamente para <span className="font-mono bg-muted px-1 rounded">OP-0000123</span> assim que você for para o próximo campo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}