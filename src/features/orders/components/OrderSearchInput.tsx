import { CheckCircle2, Loader2, RefreshCw, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { orderService } from "../services/order.service";
import { OrderSummary } from "../types/orders";

interface OrderSearchInputProps {
  onOrderSelect: (order: OrderSummary) => void;
  initialDisplayValue?: string;
}

export function OrderSearchInput({
  onOrderSelect,
  initialDisplayValue,
}: OrderSearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<OrderSummary[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (initialDisplayValue) {
      setSearchTerm(initialDisplayValue);
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
    if (!searchTerm.trim() || searchTerm === initialDisplayValue) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      setIsOpen(true);

      try {
        const data = await orderService.getSummary(searchTerm);
        setResults(data.content);
        setHasSearched(true);
      } catch (error) {
        console.error(error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, initialDisplayValue]);

  const handleSync = async () => {
    if (!searchTerm) return;
    setIsSyncing(true);
    try {
      await orderService.syncFromErp(searchTerm);
      const freshData = await orderService.getSummary(searchTerm);
      if (freshData.content.length > 0) {
        handleSelect(freshData.content[0]);
      } else {
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSelect = (order: OrderSummary) => {
    setSearchTerm(order.code);
    setIsOpen(false);
    onOrderSelect(order);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative group">
        <input
          type="text"
          className="w-full bg-muted border border-transparent focus:bg-background focus:border-blue-500 rounded-lg py-3 pl-10 pr-4 text-sm text-foreground outline-none transition-all font-mono uppercase placeholder:normal-case"
          placeholder="Digite o código da OP..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() =>
            searchTerm && searchTerm !== initialDisplayValue && setIsOpen(true)
          }
        />

        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>
      </div>

      {isOpen && searchTerm && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {results.length > 0 ? (
            <ul className="py-1">
              {results.map((order) => (
                <li
                  key={order.id}
                  onClick={() => handleSelect(order)}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between group transition-colors border-b border-gray-100 last:border-0"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm">
                      {order.code}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      ID: {order.id}
                    </span>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
              ))}
            </ul>
          ) : (
            hasSearched && (
              <div className="p-4 flex flex-col items-center justify-center text-center">
                <p className="text-xs text-gray-500 mb-3">
                  Não encontrada localmente.
                </p>
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold transition-colors disabled:opacity-70"
                >
                  {isSyncing ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3 w-3" />
                  )}
                  BUSCAR NO CG
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
