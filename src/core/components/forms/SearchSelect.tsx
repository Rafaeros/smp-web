import {
  AlertCircle,
  Check,
  ChevronDown,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useToast } from "@/src/core/contexts/ToastContext";

interface AsyncSearchSelectProps<T> {
  fetcher: (query: string) => Promise<T[]>;
  onSelect: (item: T) => void;
  placeholder?: string;
  initialDisplayValue?: string;
  renderItem: (item: T) => ReactNode;
  getItemKey: (item: T) => string | number;
  getItemLabel: (item: T) => string;
  onFallback?: (query: string) => Promise<void>;
  fallbackLabel?: string;
  fallbackMessage?: string;
}

export function AsyncSearchSelect<T>({
  fetcher,
  onSelect,
  placeholder = "Pesquisar...",
  initialDisplayValue = "",
  renderItem,
  getItemKey,
  getItemLabel,
  onFallback,
  fallbackLabel = "Criar Novo",
  fallbackMessage = "Nenhum resultado encontrado.",
}: AsyncSearchSelectProps<T>) {
  const { showToast } = useToast();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFallbackLoading, setIsFallbackLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialDisplayValue) {
      setQuery(initialDisplayValue);
    }
  }, [initialDisplayValue]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim() || query === initialDisplayValue) {
      setResults([]);
      if (!query.trim()) setIsOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      setIsOpen(true);
      setHasSearched(false);

      try {
        const data = await fetcher(query);
        setResults(data);
        setHasSearched(true);
      } catch (error) {
        console.error("Erro na busca:", error);
        setResults([]);
        setHasSearched(true);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, fetcher, initialDisplayValue]);

  const handleSelectItem = (item: T) => {
    setQuery(getItemLabel(item));
    setIsOpen(false);
    onSelect(item);
  };

  const handleFallbackAction = async () => {
    if (!onFallback || !query) return;

    setIsFallbackLoading(true);
    try {
      await onFallback(query);
      const newData = await fetcher(query);

      if (newData.length > 0) {
        handleSelectItem(newData[0]);
        showToast("Sincronizado com sucesso!", "SUCCESS");
      } else {
        setIsOpen(false);
      }
    } catch (error: any) {
      console.error(error);
      const backendMessage = error.response?.data?.message;
      const fallbackMsg = "Erro ao sincronizar. Verifique se a OP existe.";
      showToast(backendMessage || fallbackMsg, "ERROR");
    } finally {
      setIsFallbackLoading(false);
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative group">
        <input
          type="text"
          className="w-full bg-muted border border-transparent focus:bg-background focus:border-brand-blue rounded-lg py-3 pl-10 pr-10 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen && e.target.value) setIsOpen(true);
          }}
          onFocus={() => {
            if (query && query !== initialDisplayValue) setIsOpen(true);
          }}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>
        {query && !isLoading && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && query && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          {results.length > 0 ? (
            <ul className="py-1">
              {results.map((item) => (
                <li
                  key={getItemKey(item)}
                  onClick={() => handleSelectItem(item)}
                  className="px-4 py-3 hover:bg-muted cursor-pointer flex items-center justify-between group transition-colors border-b border-border/50 last:border-0"
                >
                  {renderItem(item)}
                  <Check className="h-4 w-4 text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
              ))}
            </ul>
          ) : (
            hasSearched && (
              <div className="p-4 flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-2 text-amber-600 mb-3">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs font-medium">{fallbackMessage}</span>
                </div>

                {onFallback && (
                  <button
                    onClick={handleFallbackAction}
                    disabled={isFallbackLoading}
                    className="
                      relative w-full font-bold rounded-xl transition-all duration-200 
                      active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed 
                      flex items-center justify-center gap-2
                      py-2.5 px-4 text-xs
                      text-white bg-linear-to-r from-brand-purple to-brand-blue 
                      shadow-lg shadow-brand-blue/20 hover:opacity-90 hover:scale-[1.01]
                    "
                  >
                    {isFallbackLoading ? (
                      <>
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>PROCESSANDO...</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3" />
                        {fallbackLabel}
                      </>
                    )}
                  </button>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
