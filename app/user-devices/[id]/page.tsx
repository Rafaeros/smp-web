"use client";

import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  Cpu,
  FileText,
  Layers,
  Lock,
  Save,
  Settings,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  DeviceStatus,
  ProcessStage,
  ProcessStageLabels,
  ProcessStatus,
  ProcessStatusLabels,
} from "@/src/features/devices/types";

import { userDeviceService } from "@/src/features/userdevices/service/user-device.service";
import {
  UpdateUserDeviceDTO,
  UserDeviceDetails,
} from "@/src/features/userdevices/types";

import { OrderSearchInput } from "@/src/features/orders/components/OrderSearchInput";
import { OrderSummary } from "@/src/features/orders/types/orders";

const getConnectionVisuals = (status: DeviceStatus | string) => {
  if (status === DeviceStatus.OFFLINE) {
    return {
      bg: "bg-red-500",
      text: "text-red-600 dark:text-red-400",
      bgText: "bg-red-500/10",
      border: "border-red-500/20",
      icon: <WifiOff size={12} className="text-red-600 dark:text-red-400" />,
    };
  }
  return {
    bg: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    bgText: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: <Wifi size={12} className="text-emerald-600 dark:text-emerald-400" />,
  };
};

const getProcessVisuals = (
  status: DeviceStatus | string,
  process?: ProcessStatus | string,
) => {
  if (status === DeviceStatus.OFFLINE) {
    return {
      bg: "bg-red-500",
      text: "text-red-600 dark:text-red-400",
      bgText: "bg-red-500/10",
      border: "border-red-500/20",
      pulse: "",
    };
  }

  switch (process) {
    case ProcessStatus.RUNNING:
      return {
        bg: "bg-blue-500",
        text: "text-blue-600 dark:text-blue-400",
        bgText: "bg-blue-500/10",
        border: "border-blue-500/20",
        pulse: "animate-pulse",
      };
    case ProcessStatus.PAUSED:
      return {
        bg: "bg-amber-500",
        text: "text-amber-600 dark:text-amber-400",
        bgText: "bg-amber-500/10",
        border: "border-amber-500/20",
        pulse: "",
      };
    case ProcessStatus.IDLE:
    default:
      return {
        bg: "bg-emerald-500",
        text: "text-emerald-600 dark:text-emerald-400",
        bgText: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        pulse: "",
      };
  }
};

interface DeviceFormData {
  name: string;
  stage: ProcessStage | undefined;
  orderId: number | null;
}

export default function DeviceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [device, setDevice] = useState<UserDeviceDetails | null>(null);
  const [initialOrderCode, setInitialOrderCode] = useState("");

  const [formData, setFormData] = useState<DeviceFormData>({
    name: "",
    stage: undefined,
    orderId: null,
  });

  useEffect(() => {
    if (!id) return;
    loadData();

    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, [id]);

  async function loadData() {
    try {
      const data = await userDeviceService.getDetails(id);
      setDevice(data);

      setFormData((prev) => ({
        ...prev,
        name: data.name,
        stage: data.stage,
        orderId: prev.orderId || null,
      }));

      const backendCode = (data as any).code || data.code;
      if (backendCode) {
        setInitialOrderCode(backendCode);
      }
    } catch (error) {
      console.error("Erro ao carregar", error);
      toast.error("Erro ao carregar detalhes do dispositivo");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (field: keyof DeviceFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOrderSelect = (order: OrderSummary) => {
    setFormData((prev) => ({ ...prev, orderId: order.id }));
    toast.info(`Ordem ${order.code} selecionada.`);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: UpdateUserDeviceDTO = {
        name: formData.name,
        processStage: formData.stage,
        orderId: formData.orderId || undefined,
      };

      await userDeviceService.update(id, payload);
      await loadData();
      toast.success("Configurações atualizadas com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Falha ao atualizar dispositivo.");
    } finally {
      setSaving(false);
    }
  };

  const handleUnbind = async () => {
    if (!confirm("Tem certeza? O dispositivo sumirá do seu mapa.")) return;
    try {
      await userDeviceService.unbind(id);
      toast.success("Dispositivo removido do mapa.");
      router.push("/user-devices/map");
    } catch (error) {
      toast.error("Erro ao desvincular.");
    }
  };

  if (loading && !device) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-purple" />
        Carregando telemetria...
      </div>
    );
  }

  if (!device)
    return (
      <div className="p-8 text-foreground">Dispositivo não encontrado.</div>
    );

  const isProcessActive =
    device.status === DeviceStatus.ONLINE &&
    (device.process === ProcessStatus.RUNNING ||
      device.process === ProcessStatus.PAUSED);

  const connVisuals = getConnectionVisuals(device.status);
  const procVisuals = getProcessVisuals(device.status, device.process);

  const displayProcessStatus =
    device.status === DeviceStatus.OFFLINE
      ? "OFFLINE"
      : ProcessStatusLabels[device.process as ProcessStatus] || "PARADO";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto py-10 px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={24} />
          </button>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                {device.name}
              </h1>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-md border font-black tracking-widest flex items-center gap-1.5 uppercase ${connVisuals.bgText} ${connVisuals.border} ${connVisuals.text}`}
              >
                {connVisuals.icon}
                {device.status === DeviceStatus.ONLINE ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">
                ID: #{device.id}
              </span>
              <span>•</span>
              <span className="font-mono text-xs">
                MAC: {device.macAddress}
              </span>
            </p>
          </div>
        </div>
        <div
          className={`flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl shadow-sm border ${procVisuals.bgText} ${procVisuals.border} ${procVisuals.text}`}
        >
          <Activity size={18} className={procVisuals.pulse} />
          <span className="font-medium opacity-80">Processo:</span>
          <span className="font-black uppercase tracking-wide">
            {displayProcessStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSave}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden group"
          >
            <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
              <div className="p-2 bg-brand-purple/10 rounded-lg text-brand-purple">
                <Settings size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Configuração de Processo
                </h2>
                <p className="text-xs text-muted-foreground">
                  Vincular Ordem de Produção e Etapa.
                </p>
              </div>
            </div>
            {isProcessActive && (
              <div className="mb-6 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                <Lock className="shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="text-sm font-bold">Edição Bloqueada</h4>
                  <p className="text-xs opacity-90 leading-relaxed mt-1">
                    O dispositivo está <strong>{displayProcessStatus}</strong>.
                    Para alterar a Ordem de Produção, finalize ou pause o
                    processo no equipamento físico primeiro.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Nome do Dispositivo
                </label>
                <input
                  type="text"
                  className="w-full bg-muted border border-transparent focus:bg-background focus:border-brand-blue rounded-lg p-3 text-sm text-foreground outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={isProcessActive}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <FileText size={12} /> Ordem de Produção (OP)
                </label>
                <div
                  className={
                    isProcessActive
                      ? "pointer-events-none opacity-50 grayscale"
                      : ""
                  }
                >
                  <OrderSearchInput
                    onOrderSelect={handleOrderSelect}
                    initialDisplayValue={initialOrderCode}
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Layers size={12} /> Etapa de Produção
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-muted border border-transparent focus:bg-background focus:border-brand-blue rounded-lg p-3 text-sm text-foreground outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted/80"
                    value={formData.stage || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleChange(
                        "stage",
                        val === "" ? undefined : (val as ProcessStage),
                      );
                    }}
                    disabled={isProcessActive}
                  >
                    <option value="">Selecione uma etapa...</option>
                    {Object.values(ProcessStage).map((stageVal) => (
                      <option key={stageVal} value={stageVal}>
                        {ProcessStageLabels[stageVal]}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    {!isProcessActive ? (
                      <ChevronDown size={16} />
                    ) : (
                      <Lock size={14} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex justify-end">
              <button
                type="submit"
                disabled={saving || isProcessActive}
                className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                {saving ? (
                  "Salvando..."
                ) : (
                  <>
                    <Save size={18} /> Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 border-b border-border pb-2">
              Telemetria
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center justify-between group">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  {connVisuals.icon} IP Local
                </span>
                <span className="text-xs font-mono text-foreground bg-muted px-2 py-1 rounded border border-border">
                  {device.ipAddress}
                </span>
              </li>
              <li className="flex items-center justify-between group">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Cpu size={16} /> MAC Address
                </span>
                <span className="text-xs font-mono text-foreground bg-muted px-2 py-1 rounded border border-border">
                  {device.macAddress}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Último Sinal
                </span>
                <span className="text-xs text-foreground font-medium bg-green-500/10 dark:text-green-400 px-2 py-1 rounded">
                  {device.lastSeen
                    ? `${new Date(
                        device.lastSeen,
                      ).toLocaleDateString()} ${new Date(
                        device.lastSeen,
                      ).toLocaleTimeString()}`
                    : "-"}
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400">
              <AlertTriangle size={18} />
              <h4 className="font-bold text-sm">Zona de Perigo</h4>
            </div>
            <button
              type="button"
              className="w-full py-2.5 text-xs font-bold text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/10 hover:border-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleUnbind}
              disabled={isProcessActive}
              title={
                isProcessActive ? "Pare o processo antes de desvincular" : ""
              }
            >
              Desvincular Dispositivo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
