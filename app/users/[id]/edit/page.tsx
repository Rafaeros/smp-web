"use client";

import {
  ArrowLeft,
  ChevronDown,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  Type,
  UserCog,
  User as UserIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PageHeader } from "@/src/core/components/layouts/PageHeader";
import { useToast } from "@/src/core/contexts/ToastContext";
import { authService } from "@/src/features/auth/service/auth-service";
import { userService } from "@/src/features/users/services/user.service";
import { UpdateUser } from "@/src/features/users/types/user";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const userId = Number(params.id);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggedUserRole, setLoggedUserRole] = useState<string>("");

  const [formData, setFormData] = useState<UpdateUser>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    role: "",
  });

  useEffect(() => {
    const user = authService.getUser();
    if (user) setLoggedUserRole(user.role);
    if (userId) fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const data = await userService.getById(userId);
      setFormData({
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        email: data.email ?? "",
        username: data.username,
        role: data.role,
      });
    } catch (error) {
      console.error(error);
      router.push("/users");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userService.update(userId, formData);
      showToast("Dados atualizados com sucesso!", "SUCCESS");
      router.push(`/users/${userId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const formattedValue =
      name === "username" ? value.toLowerCase().replace(/\s/g, "") : value;

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  // Trava de segurança no Front: apenas ADMIN e MANAGER alteram cargos
  const canChangeRole =
    loggedUserRole === "ADMIN" || loggedUserRole === "MANAGER";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-brand-purple" size={32} />
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
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Voltar
        </button>

        <PageHeader
          title={`Editar: ${formData.username}`}
          subtitle="Atualize as informações cadastrais e permissões"
          icon={UserCog}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-muted/30 border-b border-border">
            <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider font-mono">
              Dados do Usuário #{userId}
            </h3>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <Type size={14} /> Nome
              </label>
              <input
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <Type size={14} /> Sobrenome
              </label>
              <input
                required
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all text-sm"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <Mail size={14} /> E-mail Institucional
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all text-sm"
              />
            </div>

            <div className="md:col-span-2 h-px bg-border/50 my-2" />

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <UserIcon size={14} /> Username (Login)
              </label>
              <input
                required
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-border bg-muted/50 font-mono text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <ShieldCheck size={14} /> Nível de Acesso
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={!canChangeRole} // <--- BLOQUEIO VISUAL
                  className={`w-full p-2.5 rounded-lg border border-border bg-background outline-none transition-all appearance-none cursor-pointer text-sm pr-10 ${
                    !canChangeRole
                      ? "bg-muted cursor-not-allowed opacity-70"
                      : "focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
                  }`}
                >
                  <option value="ADMIN">ADMINISTRADOR</option>
                  <option value="MANAGER">GERENTE</option>
                  <option value="SUPERVISOR">SUPERVISOR</option>
                  <option value="OPERATOR">OPERADOR</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <ChevronDown size={16} />
                </div>
              </div>
              {!canChangeRole && (
                <span className="text-[10px] text-amber-600 font-medium">
                  Somente gestores podem alterar cargos.
                </span>
              )}
            </div>
          </div>

          <div className="p-4 bg-muted/30 border-t border-border flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 rounded-xl border border-border font-bold text-xs text-muted-foreground hover:bg-muted transition-all"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2 rounded-xl bg-brand-purple text-white font-bold text-xs flex items-center gap-2 hover:bg-brand-purple/90 transition-all shadow-lg shadow-brand-purple/20 disabled:opacity-50"
            >
              {saving ? (
                "SALVANDO..."
              ) : (
                <>
                  <Save size={16} />
                  ATUALIZAR DADOS
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* CARD INFO */}
          <div className="bg-brand-purple/5 border border-brand-purple/20 rounded-xl p-6 h-fit">
            <h4 className="text-brand-purple font-bold text-sm mb-2 flex items-center gap-2">
              <UserCog size={18} /> Histórico
            </h4>
            <p className="text-[11px] text-brand-purple/80 leading-relaxed">
              As alterações realizadas serão registradas nos logs de auditoria
              do sistema. Certifique-se de validar o e-mail institucional antes
              de salvar.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
