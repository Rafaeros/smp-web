"use client";

import { APP_ROUTES } from "@/src/core/config/routes";
import { useToast } from "@/src/core/contexts/ToastContext";
import { deviceService } from "@/src/features/devices/service/devices.service";
import { AvailableDevice } from "@/src/features/devices/types";
import { userDeviceService } from "@/src/features/userdevices/service/user-device.service";
import { UserDeviceMap } from "@/src/features/userdevices/types";
import {
  Cpu,
  MapPin,
  MousePointer2,
  Move,
  Save,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export function FloorMap() {
  const router = useRouter();
  const { showToast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);
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
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    loadMapData();
  }, []);

  async function loadMapData() {
    setLoading(true);
    try {
      const data = await userDeviceService.getMyMap();
      setDevices(data);
    } catch (error) {
      console.error("Erro ao carregar mapa:", error);
    } finally {
      setLoading(false);
    }
  }

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
        showToast("Erro ao salvar posição. Recarregando...", "ERROR");
        loadMapData();
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

    try {
      const available = await deviceService.getAvailableDevices();
      setAvailableDevices(available);
    } catch (error) {
      console.error("Erro ao buscar devices disponíveis", error);
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
    } catch (error: any) {
      console.error("Erro ao vincular dispositivo:", error);
      showToast(error.message || "Erro ao adicionar", "ERROR");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden">
      {/* HEADER FLUTUANTE (Fica fixo sobre o scroll) */}
      <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-2 pointer-events-auto">
          <h1 className="text-2xl font-bold text-foreground drop-shadow-md bg-background/50 backdrop-blur-sm p-1 rounded-lg">
            Monitoramento da Planta
          </h1>
          <div className="flex items-center gap-2 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-border shadow-lg w-fit">
            <MapPin size={14} className="text-brand-purple" />
            <span className="text-xs font-bold text-foreground uppercase tracking-tight">
              Unidade Londrina • Setor A1
            </span>
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
      <div className="flex-1 w-full h-full overflow-auto bg-muted/20 custom-scrollbar">
        <div className="relative min-w-250 lg:w-full aspect-video mx-auto shadow-2xl origin-top-left">
          <div
            ref={mapRef}
            onClick={handleMapClick}
            className="w-full h-full relative cursor-crosshair"
            style={{
              backgroundImage: `url('/mapa-producao.png')`,
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[5%_5%] pointer-events-none" />

            {devices.map((device) => {
              const isBeingDragged = draggingId === device.id;
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
                        className={`absolute inset-0 rounded-full animate-ping opacity-40 scale-[2.0] ${
                          device.status === "ONLINE"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      />
                    )}
                    <div
                      className={`
                        w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 shadow-xl 
                        flex items-center justify-center transition-transform
                        ${
                          isBeingDragged
                            ? "scale-125 ring-4 ring-brand-purple/30"
                            : "group-hover:scale-110"
                        }
                        ${
                          device.status === "ONLINE"
                            ? "bg-emerald-500 shadow-emerald-500/40"
                            : "bg-red-500 shadow-red-500/40"
                        }
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
                              className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                                device.status === "ONLINE"
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : "bg-red-500/10 text-red-600"
                              }`}
                            >
                              {device.status}
                            </span>
                            <Cpu size={12} className="text-muted-foreground" />
                          </div>
                          <p className="font-bold text-foreground text-sm leading-tight mb-0.5">
                            {device.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {device.macAddress}
                          </p>
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
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-card border-t md:border border-border rounded-t-3xl md:rounded-2xl shadow-2xl p-6 md:p-8 animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 duration-300">
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
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                  Nome do Ponto
                </label>
                <input
                  type="text"
                  placeholder="Ex: Sensor Entrada A"
                  className="w-full bg-muted/50 border border-border text-foreground text-sm rounded-xl p-4 focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={saving || !selectedDeviceId}
                className="w-full bg-linear-to-r from-brand-purple to-brand-blue text-white font-bold rounded-xl py-4 shadow-xl shadow-brand-purple/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
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
