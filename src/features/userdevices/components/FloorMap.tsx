"use client";

import { APP_ROUTES } from "@/src/core/config/routes";
import { useToast } from "@/src/core/contexts/ToastContext";
import { deviceService } from "@/src/features/devices/service/devices.service";
import {
  AvailableDevice,
  DeviceStatus,
  ProcessStatus,
  ProcessStatusLabels,
} from "@/src/features/devices/types";
import { userDeviceService } from "@/src/features/userdevices/service/user-device.service";
import { UserDeviceMap } from "@/src/features/userdevices/types";
import {
  AlertCircle,
  Cpu,
  MapPin,
  Maximize2,
  MousePointer2,
  Move,
  RefreshCw,
  Save,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

const getDeviceVisuals = (
  status: DeviceStatus | string,
  process?: ProcessStatus | string,
) => {
  if (status === DeviceStatus.OFFLINE) {
    return {
      bg: "bg-red-500",
      shadow: "shadow-red-500/40",
      ring: "ring-red-500/30",
      text: "text-red-600 dark:text-red-400",
      bgText: "bg-red-500/10",
      ping: "bg-red-500",
    };
  }

  switch (process) {
    case ProcessStatus.RUNNING:
      return {
        bg: "bg-blue-500",
        shadow: "shadow-blue-500/40",
        ring: "ring-blue-500/30",
        text: "text-blue-600 dark:text-blue-400",
        bgText: "bg-blue-500/10",
        ping: "bg-blue-500",
      };
    case ProcessStatus.PAUSED:
      return {
        bg: "bg-amber-500",
        shadow: "shadow-amber-500/40",
        ring: "ring-amber-500/30",
        text: "text-amber-600 dark:text-amber-400",
        bgText: "bg-amber-500/10",
        ping: "bg-amber-500",
      };
    case ProcessStatus.IDLE:
    default:
      return {
        bg: "bg-emerald-500",
        shadow: "shadow-emerald-500/40",
        ring: "ring-emerald-500/30",
        text: "text-emerald-600 dark:text-emerald-400",
        bgText: "bg-emerald-500/10",
        ping: "bg-emerald-500",
      };
  }
};

export function FloorMap() {
  const router = useRouter();
  const { showToast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);

  const [devices, setDevices] = useState<UserDeviceMap[]>([]);
  const [availableDevices, setAvailableDevices] = useState<AvailableDevice[]>(
    [],
  );
  const [initialLoading, setInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | "">("");
  const [customName, setCustomName] = useState("");
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingAvailable, setIsLoadingAvailable] = useState(false);

  const loadMapData = useCallback(
    async (isSilent = false) => {
      if (!isSilent) setInitialLoading(true);
      else setIsRefreshing(true);

      try {
        const data = await userDeviceService.getMyMap();
        setDevices(data);
      } catch (error) {
        console.error("Erro ao carregar mapa:", error);
        if (!isSilent) showToast("Erro ao sincronizar mapa", "ERROR");
      } finally {
        setInitialLoading(false);
        setIsRefreshing(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    loadMapData();
    const intervalId = setInterval(() => {
      loadMapData(true);
    }, 60000);

    return () => clearInterval(intervalId);
  }, [loadMapData]);

  const handlePointerDown = (e: React.PointerEvent, deviceId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingId(deviceId);
    setIsDragging(false);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingId === null || !mapRef.current) return;

    e.preventDefault();
    if (!isDragging) setIsDragging(true);

    const rect = mapRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;
    const x = Math.max(0, Math.min(100, rawX));
    const y = Math.max(0, Math.min(100, rawY));
    setDevices((prev) =>
      prev.map((dev) => (dev.id === draggingId ? { ...dev, x, y } : dev)),
    );
  };

  const handlePointerUp = async (
    e: React.PointerEvent,
    device: UserDeviceMap,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const currentDraggingId = draggingId;
    setDraggingId(null);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    if (currentDraggingId === null) return;

    if (!isDragging) {
      router.push(APP_ROUTES.devices.view(device.id));
    } else {
      try {
        await userDeviceService.updateCoordinates(
          device.id,
          device.x,
          device.y,
        );
        showToast("Nova posição salva!", "SUCCESS");
      } catch (error) {
        console.error("Erro ao salvar posição", error);
        showToast("Falha ao salvar. Revertendo...", "ERROR");
        loadMapData(true);
      }
    }
    setIsDragging(false);
  };

  const handleMapClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingId !== null || isDragging) return;
    if ((e.target as HTMLElement).closest(".device-marker")) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setClickPos({ x, y });
    setCustomName("");
    setSelectedDeviceId("");
    setModalOpen(true);
    setIsLoadingAvailable(true);

    try {
      const available = await deviceService.getAvailableDevices();
      setAvailableDevices(available);
    } catch (error) {
      console.error("Erro ao buscar devices disponíveis", error);
      showToast("Erro ao buscar dispositivos", "ERROR");
    } finally {
      setIsLoadingAvailable(false);
    }
  };

  const handleSaveNewDevice = async (e: React.FormEvent) => {
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
      setModalOpen(false);
      showToast("Dispositivo adicionado ao mapa", "SUCCESS");
      await loadMapData(true);
    } catch (error: any) {
      console.error("Erro ao vincular dispositivo:", error);
      showToast(error.message || "Erro ao adicionar", "ERROR");
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-muted/10">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-8 w-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            Carregando Planta...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden bg-muted/10">
      <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-2 pointer-events-auto">
          <h1 className="text-xl md:text-2xl font-bold text-foreground drop-shadow-md bg-background/50 backdrop-blur-sm p-2 rounded-lg border border-transparent shadow-sm">
            Monitoramento da Planta
          </h1>
          <div className="flex items-center gap-2 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-border shadow-lg w-fit">
            <MapPin size={14} className="text-brand-purple" />
            <span className="text-xs font-bold text-foreground uppercase tracking-tight">
              Unidade Londrina • Setor A1
            </span>
            {isRefreshing && (
              <RefreshCw
                size={12}
                className="ml-2 animate-spin text-muted-foreground"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          <div className="hidden sm:flex items-center gap-2 bg-background/90 backdrop-blur-md px-3 py-2 rounded-xl border border-border shadow-lg">
            <MousePointer2 size={14} className="text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground">
              Clique vazio para adicionar
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-background/90 backdrop-blur-md px-3 py-2 rounded-xl border border-border shadow-lg">
            <Move size={14} className="text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground">
              Arraste para mover
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full h-full overflow-auto custom-scrollbar p-8 pt-24 md:p-12 md:pt-28 lg:p-16 lg:pt-32 pb-32 flex flex-col">
        <div
          ref={mapRef}
          onClick={handleMapClick}
          className="relative min-w-250 max-w-400 w-full mx-auto shadow-2xl bg-white dark:bg-[#1a1a1a] rounded-xl overflow-hidden cursor-crosshair border border-border/50 shrink-0"
        >
          <img
            src="/mapa.svg"
            alt="Planta Baixa"
            className="w-full h-auto block select-none pointer-events-none"
            draggable={false}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[4%_4%] pointer-events-none" />
          <div className="absolute inset-0 w-full h-full">
            {devices.map((device) => {
              const isBeingDragged = draggingId === device.id;
              const visuals = getDeviceVisuals(
                device.status,
                (device as any).process,
              );
              const displayStatus =
                device.status === DeviceStatus.OFFLINE
                  ? "OFFLINE"
                  : ProcessStatusLabels[
                      (device as any).process as ProcessStatus
                    ] || "PARADO";

              return (
                <div
                  key={device.id}
                  className={`device-marker absolute z-20 touch-none ${
                    isBeingDragged ? "cursor-grabbing z-50" : "cursor-grab"
                  }`}
                  style={{
                    left: `${device.x}%`,
                    top: `${device.y}%`,
                    transition: isBeingDragged
                      ? "none"
                      : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onPointerDown={(e) => handlePointerDown(e, device.id)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={(e) => handlePointerUp(e, device)}
                >
                  <div className="transform -translate-x-1/2 -translate-y-1/2 relative group">
                    {!isBeingDragged && (
                      <div
                        className={`absolute inset-0 rounded-full animate-ping opacity-40 scale-[2.0] ${visuals.ping}`}
                      />
                    )}
                    <div
                      className={`
                            w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white dark:border-slate-800 shadow-xl 
                            flex items-center justify-center transition-transform duration-200
                            ${
                              isBeingDragged
                                ? `scale-125 ring-4 ${visuals.ring}`
                                : "group-hover:scale-110"
                            }
                            ${visuals.bg} ${visuals.shadow}
                          `}
                    >
                      {isBeingDragged && (
                        <Move size={10} className="text-white animate-pulse" />
                      )}
                    </div>
                    {!isBeingDragged && (
                      <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 pointer-events-none z-40">
                        <div className="bg-card/95 backdrop-blur-xl border border-border p-3 rounded-xl shadow-2xl min-w-48">
                          <div className="flex justify-between items-start mb-2">
                            <span
                              className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${visuals.bgText} ${visuals.text}`}
                            >
                              {displayStatus}
                            </span>
                            <Cpu size={12} className="text-muted-foreground" />
                          </div>
                          <p className="font-bold text-foreground text-sm leading-tight mb-0.5">
                            {device.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {device.macAddress}
                          </p>

                          <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-brand-blue font-bold text-[9px] uppercase tracking-tighter">
                            <span>Clique para detalhes</span>
                            <Maximize2 size={10} />
                          </div>
                        </div>
                        <div className="w-3 h-3 bg-card border-r border-b border-border rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {modalOpen && (
              <div
                className="absolute w-8 h-8 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                style={{ left: `${clickPos.x}%`, top: `${clickPos.y}%` }}
              >
                <div className="absolute inset-0 bg-brand-purple rounded-full animate-ping opacity-20" />
                <div className="w-3 h-3 bg-brand-purple rounded-full border-2 border-white shadow-lg shadow-brand-purple/40" />
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 mx-auto w-fit flex items-center justify-center bg-background/60 backdrop-blur-md border border-border/50 p-3 md:px-6 rounded-2xl shadow-sm text-muted-foreground">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-3 h-3 md:w-4 md:h-4">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-40 animate-ping"></span>
                <span className="relative inline-flex rounded-full w-2.5 h-2.5 md:w-3 md:h-3 bg-emerald-500 border border-white dark:border-slate-800"></span>
              </div>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">
                Aguardando (ONLINE)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-3 h-3 md:w-4 md:h-4">
                <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-40 animate-ping"></span>
                <span className="relative inline-flex rounded-full w-2.5 h-2.5 md:w-3 md:h-3 bg-blue-500 border border-white dark:border-slate-800"></span>
              </div>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">
                Produzindo
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-3 h-3 md:w-4 md:h-4">
                <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-40 animate-ping"></span>
                <span className="relative inline-flex rounded-full w-2.5 h-2.5 md:w-3 md:h-3 bg-amber-500 border border-white dark:border-slate-800"></span>
              </div>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">
                Pausado
              </span>
            </div>

            <div className="w-px h-6 bg-border/50 mx-1 hidden md:block" />

            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-3 h-3 md:w-4 md:h-4 opacity-70">
                <span className="relative inline-flex rounded-full w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 border border-white dark:border-slate-800"></span>
              </div>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider line-through decoration-red-500/50">
                Offline
              </span>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-card border-t md:border border-border rounded-t-3xl md:rounded-2xl shadow-2xl p-6 md:p-8 animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 duration-300">
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6 md:hidden" />

            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Cpu className="text-brand-purple" />
                  Novo Ponto
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Vincular hardware em{" "}
                  <span className="text-brand-purple font-mono font-bold">
                    X:{clickPos.x.toFixed(0)}% Y:{clickPos.y.toFixed(0)}%
                  </span>
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveNewDevice} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                  Dispositivo Físico
                </label>

                {isLoadingAvailable ? (
                  <div className="w-full bg-muted/50 border border-border text-muted-foreground text-sm rounded-xl p-4 flex items-center justify-center gap-2">
                    <RefreshCw size={16} className="animate-spin" /> Buscando
                    dispositivos...
                  </div>
                ) : availableDevices.length === 0 ? (
                  <div className="w-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl p-4 flex items-center gap-2">
                    <AlertCircle size={18} />
                    Nenhum dispositivo disponível
                  </div>
                ) : (
                  <select
                    className="w-full bg-muted/50 border border-border text-foreground text-sm rounded-xl p-4 focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all appearance-none cursor-pointer"
                    value={selectedDeviceId}
                    onChange={(e) =>
                      setSelectedDeviceId(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    required
                  >
                    <option value="">Selecione...</option>
                    {availableDevices.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.macAddress} - {d.ipAddress}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                  Nome do Ponto
                </label>
                <input
                  type="text"
                  placeholder="Ex: Sensor Entrada A"
                  className="w-full bg-muted/50 border border-border text-foreground text-sm rounded-xl p-4 focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all disabled:opacity-50"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  required
                  disabled={availableDevices.length === 0}
                />
              </div>

              <button
                type="submit"
                disabled={
                  saving || !selectedDeviceId || availableDevices.length === 0
                }
                className="w-full bg-linear-to-r from-brand-purple to-brand-blue text-white font-bold rounded-xl py-4 shadow-xl shadow-brand-purple/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  "SALVANDO..."
                ) : (
                  <>
                    <Save size={18} /> CONFIRMAR POSIÇÃO
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
