"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Save, Cpu, MapPin, Maximize2, MousePointer2 } from "lucide-react";
import { UserDeviceMap } from "../types";
import { userDeviceService } from "../service/user-device.service";
import { deviceService } from "@/src/features/devices/service/devices.service";
import { AvailableDevice } from "@/src/features/devices/types";
import { APP_ROUTES } from "@/src/core/config/routes";

export function FloorMap() {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  
  const [devices, setDevices] = useState<UserDeviceMap[]>([]);
  const [availableDevices, setAvailableDevices] = useState<AvailableDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | "">("");
  const [customName, setCustomName] = useState("");

  useEffect(() => {
    loadMapData();
  }, []);

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
    } catch (error: any) {
      console.error("Erro ao vincular dispositivo:", error);
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative w-full rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-center pointer-events-none">
          <div className="flex flex-col gap-1 pointer-events-auto">
            <div className="flex items-center gap-2 bg-background/90 backdrop-blur-md px-3 py-2 rounded-xl border border-border shadow-lg">
              <MapPin size={16} className="text-brand-purple" />
              <h2 className="text-xs md:text-sm font-bold text-foreground uppercase tracking-tight">
                Planta A1 - Unidade Londrina
              </h2>
            </div>
            <div className="flex items-center gap-2 ml-1">
               <div className={`w-2 h-2 rounded-full ${loading ? 'bg-brand-blue animate-pulse' : 'bg-emerald-500'}`} />
               <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                 {loading ? 'Sincronizando...' : 'Sistema Online'}
               </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-background/90 backdrop-blur-md px-3 py-2 rounded-xl border border-border shadow-lg pointer-events-auto">
             <MousePointer2 size={14} className="text-muted-foreground" />
             <span className="text-[10px] font-medium text-muted-foreground">Clique para marcar</span>
          </div>
        </div>
        <div className="overflow-x-auto no-scrollbar touch-pan-x cursor-crosshair bg-muted/20">
          <div
            ref={mapRef}
            onClick={handleMapClick}
            className="relative min-w-200 md:min-w-full aspect-video md:aspect-21/9 lg:aspect-21/7 transition-all duration-500"
            style={{
              backgroundImage: `url('/mapa-producao.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-brand-purple/5 pointer-events-none" />
            {devices.map((device) => (
              <div
                key={device.id}
                className="device-marker absolute group transform -translate-x-1/2 -translate-y-1/2 z-20"
                style={{ left: `${device.x}%`, top: `${device.y}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(APP_ROUTES.devices.view(device.id));
                }}
              >
                <div className="relative flex items-center justify-center">
                  <div className={`absolute inset-0 rounded-full animate-ping opacity-40 scale-[2.5] ${
                      device.status === "ONLINE" ? "bg-emerald-500" : "bg-red-500"
                    }`} 
                  />
                  
                  <div className={`
                    w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 shadow-xl transition-all duration-300
                    group-hover:scale-150 group-hover:ring-4 group-hover:ring-brand-purple/20
                    ${device.status === "ONLINE" ? "bg-emerald-500 shadow-emerald-500/40" : "bg-red-500 shadow-red-500/40"}
                  `} />

                  <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none z-40">
                    <div className="bg-card/95 backdrop-blur-xl border border-border p-3 rounded-xl shadow-2xl min-w-45">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${device.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                          {device.status}
                        </span>
                        <Cpu size={12} className="text-muted-foreground" />
                      </div>
                      <p className="font-bold text-foreground text-sm leading-none">{device.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono mt-1">{device.macAddress}</p>
                      
                      <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-brand-blue font-bold text-[9px] uppercase tracking-tighter">
                        <span>Ver histórico</span>
                        <Maximize2 size={10} />
                      </div>
                    </div>
                    <div className="w-3 h-3 bg-card border-r border-b border-border rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
                  </div>
                </div>
              </div>
            ))}
            {modalOpen && (
              <div
                className="absolute w-8 h-8 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-30"
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
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          
          <div className="relative w-full max-w-lg bg-card border-t md:border border-border rounded-t-4xl md:rounded-2xl shadow-2xl p-6 md:p-8 animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 duration-300">
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6 md:hidden" />
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Cpu className="text-brand-purple" />
                  Configurar Sensor
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Vincular hardware ao ponto <span className="text-brand-purple font-bold">X:{clickPos.x.toFixed(0)} Y:{clickPos.y.toFixed(0)}</span>
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">MAC ADDRESS / IP</label>
                <select
                  className="w-full bg-muted/50 border border-border text-foreground text-sm rounded-xl p-4 focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all appearance-none cursor-pointer"
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value === "" ? "" : Number(e.target.value))}
                  required
                >
                  <option value="">Selecione o dispositivo físico...</option>
                  {availableDevices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.macAddress} - {d.ipAddress}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Nome de Identificação</label>
                <input
                  type="text"
                  placeholder="Ex: Sensor de Vibração Prensa 02"
                  className="w-full bg-muted/50 border border-border text-foreground text-sm rounded-xl p-4 focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={saving || !selectedDeviceId}
                className="w-full bg-linear-to-r from-brand-purple to-brand-blue text-white font-bold rounded-xl py-4 shadow-xl shadow-brand-purple/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? "PROCESSANDO..." : <><Save size={18} /> SALVAR NO MAPA</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}