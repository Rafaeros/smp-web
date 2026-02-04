"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Save, Cpu, MapPin } from "lucide-react";
import { UserDeviceMap } from "../types";
import { userDeviceService } from "../service/user-device.service";
import { deviceService } from "@/features/devices/service/devices.service";
import { AvailableDevice } from "@/features/devices/types";

export function FloorMap() {
  const router = useRouter();
  const [devices, setDevices] = useState<UserDeviceMap[]>([]);
  const [availableDevices, setAvailableDevices] = useState<AvailableDevice[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | "">("");
  const [customName, setCustomName] = useState("");

  useEffect(() => {
    loadMapData();
  }, []);

  async function loadMapData() {
    try {
      const data = await userDeviceService.getMyMap();

      setDevices(data);
    } catch (error) {
      console.error("Erro ao carregar mapa", error);
    } finally {
      setLoading(false);
    }
  }

  const handleMapClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest(".device-marker")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setClickPos({ x, y });
    setCustomName("");
    setSelectedDeviceId("");
    setModalOpen(true);

    try {
      const available = await deviceService.getAvailableDevices();
      setAvailableDevices(available);
    } catch (error) {
      console.error("Erro ao buscar devices disponíveis", error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeviceId || !customName) return;
    setSaving(true);
    try {
      const newDevice = await userDeviceService.bindDevice({
        id: Number(selectedDeviceId),
        name: customName,
        coordinateX: clickPos.x,
        coordinateY: clickPos.y,
      });
      setDevices((prev) => [...prev, newDevice]);
      await loadMapData();
      setModalOpen(false);
    } catch (error) {
      alert("Erro ao vincular dispositivo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full overflow-x-auto rounded-xl border border-border bg-muted/30 shadow-inner no-scrollbar">
        <div
          onClick={handleMapClick}
          className="relative min-w-300 w-full aspect-21/7 bg-card bg-grid cursor-crosshair overflow-hidden group/map"
          style={{
            backgroundImage: `url('/mapa-producao.png')`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Overlay de Brilho da Marca */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,var(--brand-purple)_0%,transparent_70%)] pointer-events-none" />

          {/* Cabeçalho Flutuante */}
          <div className="absolute top-6 left-6 z-10 flex flex-col gap-1">
            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border shadow-sm">
              <MapPin size={16} className="text-brand-purple" />
              <h2 className="text-sm font-bold text-foreground tracking-tight">
                PLANTA INDUSTRIAL A1
              </h2>
            </div>
            {loading && (
              <span className="text-[10px] text-brand-blue animate-pulse ml-1 font-mono">
                SYNCING NODES...
              </span>
            )}
          </div>

          {/* Renderização dos Sensores */}
          {devices.map((device) => (
            <div
              key={device.id}
              className="device-marker absolute cursor-pointer group transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ left: `${device.x}%`, top: `${device.y}%` }}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dashboard/user-devices/${device.id}`);
              }}
            >
              <div className="relative">
                <div
                  className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                    device.status === "ONLINE" ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 shadow-lg transition-all group-hover:scale-150 ${
                    device.status === "ONLINE"
                      ? "bg-green-500 shadow-green-500/50"
                      : "bg-red-500 shadow-red-500/50"
                  }`}
                />
              </div>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card/95 backdrop-blur-md border border-border p-3 rounded-lg text-xs whitespace-nowrap z-30 shadow-2xl pointer-events-none">
                <p className="font-bold text-foreground mb-1 flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      device.status === "ONLINE" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {device.name}
                </p>
                <p className="text-muted-foreground font-mono text-[10px]">
                  {device.macAddress}
                </p>
                <div className="mt-2 pt-2 border-t border-border flex justify-between gap-4">
                  <span className="text-[10px] text-brand-blue uppercase font-bold tracking-tighter">
                    Clique para ver logs
                  </span>
                </div>
              </div>
            </div>
          ))}
          {modalOpen && (
            <div
              className="absolute w-6 h-6 border-2 border-brand-purple rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse pointer-events-none"
              style={{ left: `${clickPos.x}%`, top: `${clickPos.y}%` }}
            />
          )}
        </div>
      </div>
      {modalOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setModalOpen(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-95 bg-card border border-border rounded-2xl shadow-2xl z-50 p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-foreground font-bold flex items-center gap-2 text-lg">
                  <Cpu size={20} className="text-brand-purple" />
                  Vincular Hardware
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Configure o sensor no ponto selecionado
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] text-muted-foreground uppercase font-black tracking-widest block">
                  Dispositivo Disponível
                </label>
                <select
                  className="w-full bg-muted border border-border text-foreground text-sm rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none transition-all appearance-none cursor-pointer"
                  value={selectedDeviceId}
                  onChange={(e) =>
                    setSelectedDeviceId(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  required
                >
                  <option value="">Selecione pelo MAC ADDRESS...</option>
                  {availableDevices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.macAddress} ({d.ipAddress})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-muted-foreground uppercase font-black tracking-widest block">
                  Identificação na Planta
                </label>
                <input
                  type="text"
                  placeholder="Ex: Bancada Solda 04"
                  className="w-full bg-muted border border-border text-foreground text-sm rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none transition-all"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-brand-blue/5 rounded-lg border border-brand-blue/10">
                <MapPin size={14} className="text-brand-blue" />
                <span className="text-[11px] text-brand-blue font-mono font-bold">
                  COORDENADAS: {clickPos.x.toFixed(1)}% X{" "}
                  {clickPos.y.toFixed(1)}%
                </span>
              </div>

              <button
                type="submit"
                disabled={saving || !selectedDeviceId}
                className="w-full bg-linear-to-r from-brand-purple to-brand-blue hover:scale-[1.02] active:scale-[0.98] text-white font-bold rounded-xl text-sm px-5 py-3.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale shadow-lg shadow-brand-purple/20"
              >
                {saving ? (
                  "PROCESSANDO..."
                ) : (
                  <>
                    <Save size={18} /> CONFIRMAR VÍNCULO
                  </>
                )}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
