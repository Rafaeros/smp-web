"use client";

import {
  ArrowLeft,
  Mail,
  Save,
  ShieldCheck,
  Type,
  User as UserIcon,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { FormButton } from "@/src/core/components/forms/FormButton";
import { FormContainer } from "@/src/core/components/forms/FormContainer";
import { FormInput } from "@/src/core/components/forms/FormInput";
import { PageHeader } from "@/src/core/components/layouts/PageHeader";
import { useToast } from "@/src/core/contexts/ToastContext";
import { userService } from "@/src/features/users/services/user.service";
import { CreateUser } from "@/src/features/users/types/user";

export default function NewUserPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<CreateUser>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    role: "OPERATOR",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await userService.create(formData);
      showToast("Usuário cadastrado com sucesso!", "SUCCESS");
      router.push("/users");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const finalValue = name === "username" ? value.toLowerCase().trim() : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  return (
    <div className="w-full p-4 md:p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="flex flex-col gap-4">
        <button
          onClick={() => router.push("/users")}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand-purple transition-colors w-fit group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Voltar para lista
        </button>

        <PageHeader
          title="Novo Usuário"
          subtitle="Cadastre um novo membro para a equipe de IoT"
          icon={UserPlus}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <FormContainer
            onSubmit={handleSubmit}
            footer={
              <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-border/50 pt-6">
                <FormButton
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  CANCELAR
                </FormButton>
                <FormButton type="submit" isLoading={loading} variant="primary">
                  <Save size={18} />
                  SALVAR USUÁRIO
                </FormButton>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Nome"
                name="firstName"
                placeholder="Ex: Solange"
                startIcon={Type}
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Sobrenome"
                name="lastName"
                placeholder="Ex: Barbosa"
                startIcon={Type}
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <FormInput
                label="E-mail Institucional"
                name="email"
                type="email"
                placeholder="solange.barbosa@lanxcables.com.br"
                startIcon={Mail}
                value={formData.email}
                onChange={handleChange}
                className="md:col-span-2"
                required
              />

              <FormInput
                label="Nome de Usuário (Login)"
                name="username"
                placeholder="solange.barbosa"
                startIcon={UserIcon}
                value={formData.username}
                onChange={handleChange}
                required
              />
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                  Nível de Acesso
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-purple transition-colors">
                    <ShieldCheck size={18} />
                  </div>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full py-3 pl-10 pr-10 bg-muted/50 border border-transparent rounded-xl text-sm text-foreground transition-all outline-none appearance-none focus:bg-background focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 hover:bg-muted cursor-pointer"
                  >
                    <option value="ADMIN">ADMINISTRADOR</option>
                    <option value="MANAGER">GERENTE</option>
                    <option value="SUPERVISOR">SUPERVISOR</option>
                    <option value="OPERATOR">OPERADOR</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                    <ShieldCheck size={16} />
                  </div>
                </div>
              </div>
            </div>
          </FormContainer>
        </div>
        <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-700">
          <div className="bg-linear-to-br from-brand-blue/10 to-brand-purple/5 border border-brand-blue/20 rounded-2xl p-8 shadow-sm">
            <h4 className="text-brand-blue font-bold text-sm mb-4 flex items-center gap-2">
              <ShieldCheck size={20} /> Hierarquia de Acesso
            </h4>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-foreground">
                  ADMINISTRADOR
                </span>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Gestão completa de usuários, permissões e configurações
                  globais.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-foreground">
                  GERENTE / SUPERVISOR
                </span>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Controle de produção, ordens de serviço e monitoramento de
                  equipe.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-foreground">
                  OPERADOR
                </span>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Utilização de dispositivos IoT e apontamentos de produção.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
