interface FormContainerProps {
  title: string;
  onSave: () => void;
  onCancel: () => void;
  loading?: boolean;
  children: React.ReactNode;
}

export function FormContainer({ title, onSave, onCancel, loading, children }: FormContainerProps) {
  return (
    <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="p-6 border-b border-border bg-muted/20">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </div>
      
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children}
        </div>
      </div>

      <div className="p-6 bg-muted/10 border-t border-border flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 text-sm font-bold text-muted-foreground hover:bg-muted rounded-xl transition-colors"
        >
          CANCELAR
        </button>
        <button
          onClick={onSave}
          disabled={loading}
          className="px-8 py-2.5 text-sm font-bold text-white bg-linear-to-r from-brand-purple to-brand-blue rounded-xl shadow-lg shadow-brand-purple/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? "SALVANDO..." : "CONFIRMAR E SALVAR"}
        </button>
      </div>
    </div>
  );
}