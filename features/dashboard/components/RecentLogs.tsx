import { DashboardLog } from "../types";

const typeColors = {
  info: 'bg-blue-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500'
};

export function RecentLogs({ logs }: { logs: DashboardLog[] }) {
  return (
    // MUDANÇA: Cores atualizadas para bg-card e text-foreground
    <div className="bg-card border border-border rounded-2xl p-6 h-full shadow-sm">
      <h3 className="font-bold text-foreground mb-6 flex items-center gap-2">
        <span className="w-1 h-4 bg-brand-purple rounded-full"/>
        Últimos Logs
      </h3>
      
      <div className="space-y-4">
        {logs.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center">Nenhum log registrado.</p>
        ) : (
          logs.map((log) => (
            // Hover sutil: hover:bg-muted
            <div key={log.id} className="flex items-start gap-3 text-sm border-b border-border pb-3 last:border-0 hover:bg-muted/50 p-2 rounded transition-colors">
              <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${typeColors[log.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium truncate">{log.device}</p>
                <p className="text-muted-foreground text-xs truncate">{log.action}</p>
              </div>
              <span className="text-muted-foreground text-xs whitespace-nowrap">{log.timestamp}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}