"use client";

import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  Cpu,
  FileText,
  Layers,
  Save,
  Settings,
  Wifi,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  DeviceStatus,
  ProcessStage,
  ProcessStageLabels,
  ProcessStatus,
} from "@/src/features/devices/types";

import { userDeviceService } from "@/src/features/userdevices/service/user-device.service";
import {
  UpdateUserDeviceDTO,
  UserDeviceDetails,
} from "@/src/features/userdevices/types";

import { OrderSearchInput } from "@/src/features/orders/components/OrderSearchInput";
import { OrderSummary } from "@/src/features/orders/types/orders";

const statusConfig = {
  RUNNING: {
    color: "bg-green-500",
    text: "text-green-600",
    bg: "bg-green-500/10",
  },
  IDLE: { color: "bg-red-500", text: "text-red-600", bg: "bg-red-500/10" },
  PAUSED: {
    color: "bg-yellow-500",
    text: "text-yellow-600",
    bg: "bg-yellow-500/10",
  },
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
  }, [id]);

  async function loadData() {
    try {
      const data = await userDeviceService.getDetails(id);
      setDevice(data);

      setFormData({
        name: data.name,
        stage: data.stage,
        orderId: null,
      });
      const backendCode = (data as any).code || data.currentOrder;

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
      router.push("/dashboard/map");
    } catch (error) {
      toast.error("Erro ao desvincular.");
    }
  };

  if (loading) {
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

  const backendKey = device.process as unknown as keyof typeof ProcessStatus;
  const style = statusConfig[backendKey] || statusConfig.IDLE;
  const translatedText = ProcessStatus[backendKey] || device.process;

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
                className={`text-xs px-2.5 py-0.5 rounded-full border font-bold tracking-wide flex items-center gap-1.5 ${
                  device.status === DeviceStatus.ONLINE
                    ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                    : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    device.status === DeviceStatus.ONLINE
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />
                {device.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">
                VÍNCULO: #{device.id}
              </span>
              <span>•</span>
              <span className="font-mono text-xs">
                MAC: {device.macAddress}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border px-4 py-2 rounded-lg shadow-sm">
          <Activity
            size={16}
            className={
              backendKey === "RUNNING"
                ? "text-green-500 animate-pulse"
                : "text-gray-400"
            }
          />
          Status Atual:{" "}
          <span className={`font-bold ${style.text}`}>{translatedText}</span>
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
                  Controle de Processo
                </h2>
                <p className="text-xs text-muted-foreground">
                  Atualize a Ordem de Produção e o estado da máquina.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Nome do Dispositivo
                </label>
                <input
                  type="text"
                  className="w-full bg-muted border border-transparent focus:bg-background focus:border-brand-blue rounded-lg p-3 text-sm text-foreground outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <FileText size={12} /> Ordem de Produção (OP)
                </label>
                <OrderSearchInput
                  onOrderSelect={handleOrderSelect}
                  initialDisplayValue={initialOrderCode}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Layers size={12} /> Etapa Atual
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-muted border border-transparent focus:bg-background focus:border-brand-blue rounded-lg p-3 text-sm text-foreground outline-none transition-all appearance-none cursor-pointer"
                    value={formData.stage || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleChange(
                        "stage",
                        val === "" ? undefined : (val as ProcessStage),
                      );
                    }}
                  >
                    <option value="">Selecione uma etapa...</option>

                    {Object.values(ProcessStage).map((stageVal) => (
                      <option key={stageVal} value={stageVal}>
                        {ProcessStageLabels[stageVal]}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Activity size={12} /> Status (Sensor)
                </label>
                <div className="w-full bg-muted/50 border border-border rounded-lg p-3 text-sm text-muted-foreground flex items-center gap-2 cursor-not-allowed opacity-80">
                  <div
                    className={`w-2 h-2 rounded-full ${style.color} ${
                      backendKey === "RUNNING" ? "animate-pulse" : ""
                    }`}
                  />
                  <span className="font-mono font-bold">
                    {translatedText || "AGUARDANDO DADOS..."}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Este status é controlado automaticamente pelo hardware.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
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
              Telemetria de Rede
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center justify-between group">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Wifi size={16} /> Endereço IP
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
                  {new Date(device.lastSeen).toLocaleDateString()} |{" "}
                  {new Date(device.lastSeen).toLocaleTimeString()}
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
              className="w-full py-2.5 text-xs font-bold text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/10 hover:border-red-500/50 transition-all"
              onClick={handleUnbind}
            >
              Desvincular Dispositivo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
