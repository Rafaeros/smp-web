import { AsyncSearchSelect } from "@/src/core/components/shared/SearchSelect";
import { clientService } from "@/src/features/clients/services/client.service";
import { Client } from "@/src/features/clients/types/client";
import { User } from "lucide-react";

interface ClientSearchInputProps {
  onClientSelect: (client: Client) => void;
  initialDisplayValue?: string;
}

export function ClientSearchInput({
  onClientSelect,
  initialDisplayValue,
}: ClientSearchInputProps) {
  const fetchClients = async (query: string) => {
    const data = await clientService.getAll(0, 20, { name: query });
    return data.content;
  };

  return (
    <AsyncSearchSelect<Client>
      fetcher={fetchClients}
      onSelect={onClientSelect}
      placeholder="BUSCAR CLIENTE..."
      initialDisplayValue={initialDisplayValue}
      getItemLabel={(client) => client.name}
      getItemKey={(client) => client.id}
      renderItem={(client) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground text-sm flex items-center gap-2">
            <User size={12} className="text-muted-foreground" />
            {client.name}
          </span>
          <span className="text-[10px] text-muted-foreground ml-5">
            ID: {client.id}
          </span>
        </div>
      )}
      fallbackMessage="Nenhum cliente encontrado."
    />
  );
}
