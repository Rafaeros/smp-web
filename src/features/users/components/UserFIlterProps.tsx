import { Search, X } from "lucide-react";
import { useState } from "react";
import { UserFilters } from "../services/user.service";

interface UserListFiltersProps {
  onFilter: (filters: UserFilters) => void;
  activeFiltersCount: number;
}

export function UserListFilters({
  onFilter,
  activeFiltersCount,
}: UserListFiltersProps) {
  const [username, setUsername] = useState("");

  const handleSearch = () => {
    onFilter({ username });
  };

  const clearFilters = () => {
    setUsername("");
    onFilter({});
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar usuário..."
          className="pl-3 pr-8 py-1.5 text-sm border border-border rounded-lg bg-background focus:ring-1 focus:ring-brand-purple outline-none w-48 transition-all"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        {username && (
          <button
            onClick={() => setUsername("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={12} />
          </button>
        )}
      </div>
      <button
        onClick={handleSearch}
        className="p-1.5 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors"
      >
        <Search size={16} />
      </button>
      
      {activeFiltersCount > 0 && (
         <button
            onClick={clearFilters}
            className="text-[10px] text-red-500 hover:underline font-bold"
         >
            LIMPAR
         </button>
      )}
    </div>
  );
}