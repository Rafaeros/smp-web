"use client";

import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  Cpu,
  Eye,
  FileText,
  Home,
  Lock,
  Mail,
  Package,
  PauseCircle,
  PlayCircle,
  Shield,
  StopCircle,
  Trash2,
  Unplug,
  UserCog,
  User as UserIcon,
  WifiOff,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { DataTable } from "@/src/core/components/data-display/datatable/DataTable";
import { ColumnDef } from "@/src/core/components/data-display/datatable/types";
import { Pagination } from "@/src/core/components/data-display/Pagination";
import { PageHeader } from "@/src/core/components/layouts/PageHeader";
import { useToast } from "@/src/core/contexts/ToastContext";
import { authService } from "@/src/features/auth/service/auth-service";
import {
  DeviceStatus,
  ProcessStageLabels,
  ProcessStatus,
} from "@/src/features/devices/types";
import { userDeviceService } from "@/src/features/userdevices/service/user-device.service";
import { UserDeviceDetails } from "@/src/features/userdevices/types";
import { ChangePasswordModal } from "@/src/features/users/components/ChangePasswordModal";
import { userService } from "@/src/features/users/services/user.service";
import { roleDisplayMap, User } from "@/src/features/users/types/user";

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const userId = Number(params.id);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [allDevices, setAllDevices] = useState<UserDeviceDetails[]>([]);
  const [visibleDevices, setVisibleDevices] = useState<UserDeviceDetails[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 5;
  useEffect(() => {
    const logged = authService.getUser();

    if (!logged) {
      router.push("/login");
      return;
    }

    setCurrentUser(logged);
    const isAdmin = logged.role === "ADMIN" || logged.role === "MANAGER";
    const isOwnProfile = logged.id === userId;

    if (!isAdmin && !isOwnProfile) {
      showToast("Você não tem permissão para visualizar este perfil.", "ERROR");
      router.push("/dashboard");
      return;
    }
    if (userId) {
      fetchData();
    }
  }, [userId]);
  useEffect(() => {
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    setVisibleDevices(allDevices.slice(startIndex, endIndex));
  }, [page, allDevices]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userData, devicesData] = await Promise.all([
        userService.getById(userId),
        userDeviceService.getAllUserDevicesById(userId),
      ]);

      setProfileUser(userData);
      let list: UserDeviceDetails[] = [];
      if (
        devicesData &&
        (devicesData as any).content &&
        Array.isArray((devicesData as any).content)
      ) {
        list = (devicesData as any).content;
      } else if (Array.isArray(devicesData)) {
        list = devicesData;
      }
      setAllDevices(list);
    } catch (error) {
      console.error(error);
      showToast("Erro ao carregar dados.", "ERROR");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteUser = async () => {
    if (
      confirm(
        `ATENÇÃO: Isso excluirá o usuário "${profileUser?.username}" permanentemente. Continuar?`,
      )
    ) {
      try {
        await userService.delete(userId);
        showToast("Usuário excluído com sucesso", "SUCCESS");
        router.push("/users");
      } catch (error) {
        showToast("Erro ao excluir usuário", "ERROR");
      }
    }
  };

  const handleUnbindDevice = async (userDeviceId: number) => {
    if (confirm("Deseja desvincular este dispositivo?")) {
      try {
        await userDeviceService.unbind(userDeviceId);
        showToast("Dispositivo desvinculado!", "SUCCESS");

        const newList = allDevices.filter((d) => d.id !== userDeviceId);
        setAllDevices(newList);

        const totalPages = Math.ceil(newList.length / pageSize);
        if (page >= totalPages && page > 0) setPage(page - 1);
      } catch (error) {
        showToast("Erro ao desvincular dispositivo", "ERROR");
      }
    }
  };
  const isOwner = currentUser?.id === userId;
  const isAdmin =
    currentUser?.role === "ADMIN" || currentUser?.role === "MANAGER";
  const handleBack = () => {
    if (isAdmin) {
      router.push("/users");
    } else {
      router.push("/dashboard");
    }
  };

  const deviceColumns: ColumnDef<UserDeviceDetails>[] = [
    {
      header: "Status / Processo",
      accessorKey: "status",
      cell: (item) => {
        let colorClass = "";
        let icon = null;
        let label = "";

        if (item.status === DeviceStatus.OFFLINE) {
          colorClass =
            "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:border-red-800";
          icon = <WifiOff size={14} />;
          label = "OFFLINE";
        } else {
          switch (item.process as string) {
            case "RUNNING":
              colorClass =
                "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800";
              icon = <PlayCircle size={14} />;
              label = ProcessStatus.RUNNING;
              break;

            case "PAUSED":
              colorClass =
                "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800";
              icon = <PauseCircle size={14} />;
              label = ProcessStatus.PAUSED;
              break;

            case "IDLE":
            default:
              colorClass =
                "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800";
              icon = <StopCircle size={14} />;
              label = ProcessStatus.IDLE;
              break;
          }
        }

        return (
          <div
            className={`flex items-center gap-2 text-[10px] font-bold px-2.5 py-1 rounded-full w-fit border shadow-sm ${colorClass}`}
          >
            {icon}
            <span className="uppercase tracking-wide">{label}</span>
          </div>
        );
      },
    },
    {
      header: "Dispositivo",
      accessorKey: "name",
      className: "min-w-[140px]",
      cell: (item) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm text-foreground">{item.name}</span>
          <span className="text-[10px] text-muted-foreground font-mono">
            {item.macAddress}
          </span>
        </div>
      ),
    },
    {
      header: "Ordem Atual",
      accessorKey: "code",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-md ${
              item.code
                ? "bg-brand-purple/10 text-brand-purple"
                : "bg-muted text-muted-foreground/50"
            }`}
          >
            <FileText size={14} />
          </div>
          <span
            className={`text-xs font-medium ${
              item.code ? "text-foreground" : "text-muted-foreground italic"
            }`}
          >
            {item.code || "Sem ordem"}
          </span>
        </div>
      ),
    },
    {
      header: "Etapa",
      accessorKey: "stage",
      cell: (item) => (
        <div className="flex items-center gap-2" title={item.stage}>
          <Package size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">
            {item.stage ? ProcessStageLabels[item.stage] : "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Visto por último",
      accessorKey: "lastSeen",
      cell: (item) => (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock size={13} className="text-muted-foreground/70" />
          <span className="font-mono">
            {item.lastSeen
              ? new Date(item.lastSeen).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-"}
          </span>
        </div>
      ),
    },
    {
      header: "Ações",
      className: "text-right",
      cell: (item) => (
        <div className="flex justify-end items-center gap-1">
          <button
            onClick={() => router.push(`/user-devices/${item.id}`)}
            className="p-2 text-muted-foreground hover:text-brand-purple hover:bg-purple-50 rounded-lg transition-all"
            title="Ver Painel do Dispositivo"
          >
            <Eye size={18} />
          </button>

          {(isAdmin || isOwner) && (
            <button
              onClick={() => handleUnbindDevice(item.id)}
              className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Desvincular Dispositivo"
            >
              <Unplug size={18} />
            </button>
          )}
        </div>
      ),
    },
  ];

  if ((loading && !profileUser) || !currentUser) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-8 w-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!profileUser) return null;

  return (
    <div className="w-full p-4 md:p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="flex flex-col gap-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand-purple transition-colors w-fit group"
        >
          {isAdmin ? (
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
          ) : (
            <Home size={16} />
          )}
          {isAdmin ? "Voltar para lista" : "Voltar para Dashboard"}
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <PageHeader
            title={isOwner ? "Meu Perfil" : profileUser.username}
            subtitle={
              isOwner
                ? "Gerencie seus dados e dispositivos"
                : `Detalhes do usuário #${profileUser.id}`
            }
            icon={UserIcon}
          />

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => router.push(`/users/${profileUser.id}/edit`)}
                className="bg-white dark:bg-slate-800 text-foreground border border-border hover:bg-muted px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                <UserCog size={16} />
                EDITAR USUÁRIO
              </button>
            )}
            {isOwner && (
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/20 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                <Lock size={16} />
                ALTERAR SENHA
              </button>
            )}
            {isAdmin && !isOwner && (
              <button
                onClick={handleDeleteUser}
                className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/20 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                <Trash2 size={16} />
                EXCLUIR USUÁRIO
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl shadow-black/5 flex flex-col gap-6 h-fit">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider font-mono">
              Dados Cadastrais
            </h3>
            {isOwner && (
              <span className="text-[10px] bg-linear-to-r from-brand-purple to-brand-blue text-white px-3 py-0.5 rounded-full font-bold uppercase shadow-md shadow-brand-purple/20">
                Você
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple border border-brand-purple/20 shadow-inner">
              <UserIcon size={28} />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-foreground truncate leading-tight">
                {profileUser.firstName} {profileUser.lastName}
              </p>
              <p className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded-md w-fit mt-1 border border-border/50">
                @{profileUser.username}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-brand-blue border border-blue-500/20 transition-colors group-hover:bg-blue-500/20">
                <Mail size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                  E-mail Corporativo
                </p>
                <p
                  className="text-sm font-medium text-foreground truncate"
                  title={profileUser.email || ""}
                >
                  {profileUser.email || "Não informado"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 border border-amber-500/20 transition-colors group-hover:bg-amber-500/20">
                <Shield size={18} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                  Nível de Acesso
                </p>
                <div className="mt-0.5">
                  <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-black uppercase bg-muted border border-border text-foreground inline-block shadow-xs">
                    {roleDisplayMap[profileUser.role] || profileUser.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl shadow-xl shadow-black/5 overflow-hidden flex flex-col min-h-125">
          <div className="p-5 bg-muted/30 flex justify-between items-center border-b border-border">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-brand-purple/10 rounded-lg">
                <Cpu size={18} className="text-brand-purple" />
              </div>
              <span className="text-xs font-bold uppercase text-foreground tracking-widest">
                {isOwner ? "Seus Dispositivos" : "Dispositivos Vinculados"}
              </span>
            </div>
            <span className="text-[10px] font-bold bg-background border border-border px-3 py-1 rounded-full text-muted-foreground shadow-sm">
              {allDevices.length} Conectados
            </span>
          </div>

          <div className="flex-1 overflow-x-auto">
            <DataTable
              data={visibleDevices}
              columns={deviceColumns}
              getRowId={(d) => d.id}
              loading={loading}
            />

            {!loading && allDevices.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-4 opacity-40">
                <AlertTriangle size={48} strokeWidth={1.5} />
                <p className="text-sm font-semibold tracking-wide">
                  Nenhum dispositivo vinculado a esta conta.
                </p>
              </div>
            )}
          </div>

          {allDevices.length > 0 && (
            <div className="border-t border-border p-3 bg-muted/30">
              <Pagination
                currentPage={page}
                totalItems={allDevices.length}
                pageSize={pageSize}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>
      {isOwner && profileUser && (
        <ChangePasswordModal
          userId={profileUser.id}
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      )}
    </div>
  );
}
