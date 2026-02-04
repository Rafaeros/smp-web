"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface SearchInputProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

export function SearchInput({ onSearch, placeholder = "Buscar..." }: SearchInputProps) {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className="relative flex-1 group">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-brand-purple transition-colors" />
      <input 
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple outline-none transition-all shadow-sm"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <button 
          onClick={() => setValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-red-500 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}