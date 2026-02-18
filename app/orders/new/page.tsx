"use client";

import React, { useEffect, useState, use } from "react"; // Adicionado 'use'
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Calendar, Factory, Hash, Save, 
  Box, Users, Info, AlertTriangle, Activity 
} from "lucide-react";

import { PageHeader } from "@/src/core/components/layouts/PageHeader";
import { useToast } from "@/src/core/contexts/ToastContext";
import { FormContainer } from "@/src/core/components/forms/FormContainer";
import { FormButton } from "@/src/core/components/forms/FormButton";
import { FormInput } from "@/src/core/components/forms/FormInput";

import { orderService } from "@/src/features/orders/services/order.service";

interface EditOrderPageProps {
  params: Promise<{ id: string }>;
}

export default function EditOrderPage({ params }: EditOrderPageProps) {
  // 1. Desembrulha os params corretamente para Next.js 15
  const { id } = use(params); 

  const router = useRouter();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const [formData, setFormData] = useState({
    code: "", 
    clientName: "",
    productDescription: "",
    totalQuantity: "",
    producedQuantity: "",
    deliveryDate: "", 
  });

  // Carrega os dados
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Usa a variável 'id' desembrulhada, não params.id
        const orderData = await orderService.getById(Number(id));
        
        setFormData({
          code: orderData.code,
          clientName: orderData.clientName || "N/A",
          productDescription: `${orderData.productCode} - ${orderData.productDescription}`,
          totalQuantity: String(orderData.totalQuantity),
          producedQuantity: String(orderData.producedQuantity),
          deliveryDate: orderData.deliveryDate || "", 
        });

      } catch (error) {
        console.error("Erro ao carregar:", error);
        showToast("Erro ao buscar dados da ordem", "ERROR");
        router.push("/orders");
      } finally {
        setDataLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id, router, showToast]);

  const formatDateToBR = (isoDate: string) => {
    if (!isoDate) return "";
    if (isoDate.includes("/")) return isoDate;
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("1. Iniciando Submit...");
    setLoading(true);
    
    try {
      // Proteção contra NaN (caso o usuário limpe o campo)
      const qtdTotal = Number(formData.totalQuantity) || 0;
      const qtdProd = Number(formData.producedQuantity) || 0;

      const payload = {
        deliveryDate: formatDateToBR(formData.deliveryDate),
        totalQuantity: qtdTotal,
        producedQuantity: qtdProd
      };

      console.log("2. Payload enviado:", payload);

      // Aguarda o update
      await orderService.update(Number(id), payload);
      
      console.log("3. Sucesso! Redirecionando...");
      showToast(`Ordem ${formData.code} atualizada!`, "SUCCESS");
      
      // Pequeno delay para garantir que o Toast apareça antes de sair (opcional)
      setTimeout(() => {
         router.push("/orders");
      }, 500);

    } catch (error: any) {
      console.error("4. ERRO CAPTURADO:", error);
      
      const msg = error.response?.data?.message || "Erro ao atualizar ordem.";
      showToast(msg, "ERROR");
      
    } finally {
      console.log("5. Finalizando loading");
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center font-medium text-muted-foreground">
        Carregando dados da ordem...
      </div>
    );
  }

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
          title={`Editar Ordem: ${formData.code}`}
          subtitle="Ajuste de metas e prazos"
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
                  <Save size={18} /> SALVAR ALTERAÇÕES
                </FormButton>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* DADOS FIXOS */}
              <div className="md:col-span-2 bg-muted/30 p-4 rounded-xl border border-border/50 grid gap-4">
                 <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">
                    <AlertTriangle size={12} /> Dados Fixos
                 </div>
                 
                 <FormInput
                    label="Cliente"
                    name="clientName"
                    startIcon={Users}
                    value={formData.clientName}
                    disabled
                    className="bg-transparent border-transparent px-0 font-bold text-foreground shadow-none"
                 />
                 
                 <FormInput
                    label="Produto"
                    name="productDescription"
                    startIcon={Box}
                    value={formData.productDescription}
                    disabled
                    className="bg-transparent border-transparent px-0 font-bold text-foreground shadow-none"
                 />
              </div>

              <div className="h-px bg-border/50 md:col-span-2 my-2" />
              
              {/* EDITÁVEIS */}
              <FormInput
                label="Quantidade Planejada"
                name="totalQuantity"
                type="number"
                startIcon={Hash}
                value={formData.totalQuantity}
                onChange={(e) => setFormData({...formData, totalQuantity: e.target.value})}
                required
                min={1}
              />

              <FormInput
                label="Quantidade Produzida"
                name="producedQuantity"
                type="number"
                startIcon={Activity}
                value={formData.producedQuantity}
                onChange={(e) => setFormData({...formData, producedQuantity: e.target.value})}
                required
                min={0}
              />

              <FormInput
                label="Data de Entrega"
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

        {/* PROGRESSO */}
        <div className="flex flex-col gap-6">
          <div className="bg-linear-to-br from-brand-blue/5 to-brand-purple/5 border border-brand-blue/10 rounded-2xl p-6 shadow-sm sticky top-6">
            <h4 className="text-foreground font-bold text-sm mb-4 flex items-center gap-2">
              <Info size={18} className="text-brand-purple"/> Progresso
            </h4>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-1 pb-3 border-b border-border/50">
                <div className="flex items-end justify-between">
                    <span className="text-xl font-mono font-bold text-brand-purple">
                    {Number(formData.producedQuantity)} / {formData.totalQuantity}
                    </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div 
                        className="h-full bg-brand-purple transition-all duration-500"
                        style={{ width: `${Math.min((Number(formData.producedQuantity) / (Number(formData.totalQuantity) || 1)) * 100, 100)}%` }}
                    />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}