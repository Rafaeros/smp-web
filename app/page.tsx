import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Activity, ShieldCheck, Cpu } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Image 
              src="/icon.png"
              alt="SMP Logo" 
              width={32}         
              height={32}         
              className="rounded"  
              priority
            />
            <span className="font-bold text-xl tracking-tight">SMP</span>
        </div>
        
        <Link 
            href="/login" 
            className="text-sm font-semibold text-slate-600 hover:text-[#7609e8] transition-colors"
        >
            Área do Cliente
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center max-w-4xl mx-auto space-y-8 py-12">
        

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
          Orquestração Inteligente para <br/>
          <span className="bg-clip-text text-transparent bg-linear-to-r from-[#7609e8] to-[#316ef3]">
            Indústria 4.0
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl">
          O SMP System é uma plataforma projetada para conectar, monitorar e gerenciar dispositivos IoT em tempo real. 
          Resolva o desafio de integrar hardware embarcado com a gestão estratégica, 
          oferecendo dashboards de eficiência (OEE) e controle total.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link 
            href="/login" 
            className="group flex items-center justify-center gap-2 bg-linear-to-r from-[#7609e8] to-[#316ef3] text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
          >
            Acessar Plataforma
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-12 border-t border-slate-200 w-full">
            <Feature icon={Cpu} title="Hardware Integrado" desc="Conexão nativa com ESP32 e Arduino." />
            <Feature icon={Activity} title="Tempo Real" desc="Monitoramento via HTTP." />
            <Feature icon={ShieldCheck} title="Segurança RBAC" desc="Controle granular de acesso." />
        </div>

      </main>

      <footer className="py-8 text-center text-slate-600 text-sm">
        <p>© 2026 Rafaeros. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: any) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-slate-100 rounded-full text-[#7609e8]">
                <Icon size={24} />
            </div>
            <h3 className="font-bold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500">{desc}</p>
        </div>
    );
}