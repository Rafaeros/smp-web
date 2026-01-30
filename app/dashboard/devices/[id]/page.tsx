'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Activity, Layers, FileText, Wifi, Cpu, Settings, AlertTriangle } from 'lucide-react';
import { DeviceDetails, UpdateDeviceDTO, ProcessStage, ProcessStatus, DeviceStatus } from '@/features/devices/types';
import { deviceService } from '@/features/devices/service/devices.service';
import { toast } from 'react-toastify';

export default function DeviceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [device, setDevice] = useState<DeviceDetails | null>(null);

  const [formData, setFormData] = useState<UpdateDeviceDTO>({
    name: '',
    order: '',
    processStage: undefined,
    processStatus: undefined
  });

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);

  async function loadData() {
    try {
      const data = await deviceService.getById(id);
      setDevice(data);
      setFormData({
        name: data.name,
        order: data.order || '',
        processStage: data.processStage,
        processStatus: data.processStatus
      });
    } catch (error) {
      console.error("Erro ao carregar", error);
      toast.error("Erro ao carregar dispositivo");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (field: keyof UpdateDeviceDTO, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedDevice = await deviceService.update(id, formData);
      setDevice(updatedDevice);
      toast.success("Configurações atualizadas com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Falha ao atualizar dispositivo.");
    } finally {
      setSaving(false);
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

  if (!device) return <div className="p-8 text-foreground">Dispositivo não encontrado.</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
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
              <h1 className="text-2xl font-bold text-foreground">{device.name}</h1>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold tracking-wide flex items-center gap-1.5 ${
                device.status === DeviceStatus.ONLINE 
                  ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${device.status === DeviceStatus.ONLINE ? 'bg-green-500' : 'bg-red-500'}`} />
                {device.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">ID: #{device.id}</span>
              <span>•</span>
              <span className="font-mono text-xs">{device.macAddress}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border px-4 py-2 rounded-lg shadow-sm">
           <Activity size={16} className={device.processStatus === ProcessStatus.RUNNING ? 'text-green-500 animate-pulse' : 'text-gray-400'} />
           Status Atual: <span className="font-bold text-foreground">{device.processStatus}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            
            <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                <div className="p-2 bg-brand-purple/10 rounded-lg text-brand-purple">
                  <Settings size={20}/>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Controle de Processo</h2>
                  <p className="text-xs text-muted-foreground">Atualize a Ordem de Produção e o estado da máquina.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Nome do Dispositivo</label>
                    <input 
                        type="text" 
                        className="w-full bg-muted border border-transparent focus:bg-background focus:border-brand-blue rounded-lg p-3 text-sm text-foreground outline-none transition-all"
                        value={formData.name}
                        onChange={e => handleChange('name', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <FileText size={12}/> Ordem de Produção (OP)
                    </label>
                    <input 
                        type="text" 
                        placeholder="Ex: OP-2026-X99"
                        className="w-full bg-muted border border-transparent focus:bg-background focus:border-brand-blue rounded-lg p-3 text-sm text-foreground outline-none transition-all font-mono uppercase"
                        value={formData.order}
                        onChange={e => handleChange('order', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Layers size={12}/> Etapa Atual
                    </label>
                    <div className="relative">
                      <select 
                          className="w-full bg-muted border border-transparent focus:bg-background focus:border-brand-blue rounded-lg p-3 text-sm text-foreground outline-none transition-all appearance-none cursor-pointer"
                          value={formData.processStage}
                          onChange={e => handleChange('processStage', e.target.value)}
                      >
                          {Object.values(ProcessStage).map((stage) => (
                              <option key={stage} value={stage}>{stage}</option>
                          ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Activity size={12}/> Status de Produção
                    </label>
                    <div className="relative">
                      <select 
                          className="w-full bg-muted border border-transparent focus:bg-background focus:border-brand-blue rounded-lg p-3 text-sm text-foreground outline-none transition-all appearance-none cursor-pointer"
                          value={formData.processStatus}
                          onChange={e => handleChange('processStatus', e.target.value)}
                      >
                          {Object.values(ProcessStatus).map((status) => (
                              <option key={status} value={status}>{status}</option>
                          ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                </div>

            </div>

            <div className="mt-8 pt-6 border-t border-border flex justify-end">
                <button 
                    type="submit" 
                    disabled={saving}
                    className="flex items-center gap-2 bg-linear-to-r from-brand-purple to-brand-blue hover:opacity-90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-brand-blue/20 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                >
                    {saving ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}
                </button>
            </div>
          </form>
        </div>

        {/* --- COLUNA DIREITA: DADOS TÉCNICOS --- */}
        <div className="space-y-6">
            
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 border-b border-border pb-2">
                    Telemetria de Rede
                </h3>
                <ul className="space-y-4">
                    <li className="flex items-center justify-between group">
                        <span className="text-sm text-muted-foreground flex items-center gap-2 group-hover:text-brand-blue transition-colors"><Wifi size={16}/> Endereço IP</span>
                        <span className="text-xs font-mono text-foreground bg-muted px-2 py-1 rounded border border-border">{device.ipAddress}</span>
                    </li>
                    <li className="flex items-center justify-between group">
                        <span className="text-sm text-muted-foreground flex items-center gap-2 group-hover:text-brand-purple transition-colors"><Cpu size={16}/> MAC Address</span>
                        <span className="text-xs font-mono text-foreground bg-muted px-2 py-1 rounded border border-border">{device.macAddress}</span>
                    </li>
                    <li className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Último Sinal</span>
                        <span className="text-xs text-foreground font-medium bg-green-500/10 dark:text-green-400 px-2 py-1 rounded">
                          {new Date(device.lastSeen).toLocaleTimeString()}
                        </span>
                    </li>
                </ul>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400">
                  <AlertTriangle size={18} />
                  <h4 className="font-bold text-sm">Zona de Perigo</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    Desvincular remove o dispositivo do mapa, mas mantém o histórico de logs no banco de dados.
                </p>
                <button 
                    type="button"
                    className="w-full py-2.5 text-xs font-bold text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/10 hover:border-red-500/50 transition-all"
                    onClick={() => {
                        if(confirm('Tem certeza que deseja desvincular este dispositivo?')) {
                            alert("Funcionalidade de Unbind a ser implementada!");
                        }
                    }}
                >
                    Desvincular Dispositivo
                </button>
            </div>

        </div>
      </div>
    </div>
  );
}