import { FloorMap } from "@/src/features/userdevices/components/FloorMap";


export default function MapPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Monitoramento em Tempo Real</h1>
      <FloorMap />
    </div>
  );
}