import { LucideIcon } from "lucide-react";

export type DashboardData = typeof import("@/data/mock_dashboard_data.json");

export interface KpiConfig {
  icon: LucideIcon;
  tone: string;
  formatValue: (value: number, unit?: string) => string;
}

export interface KpiCardProps {
  label: string;
  value: string;
  growth: number;
  icon: React.ElementType;
  tone: string;
}
