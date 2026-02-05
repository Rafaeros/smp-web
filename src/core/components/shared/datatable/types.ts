import { ReactNode } from "react";

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  className?: string;
}

export interface ActionDef {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  requiresSelection?: boolean;
  disabled?: boolean;
  tooltip?: string;
}

export interface FilterField {
  label: string;
  name: string;
  type: "text" | "select" | "date";
  options?: { label: string; value: string }[];
}