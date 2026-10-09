import { KpiConfig } from "@/types/dashboard";
import { CircleDollarSign, Users, ArrowDownRight, Clock3 } from "lucide-react";

export const KPI_CONFIG: Record<string, KpiConfig> = {
  monthly_recurring_revenue: {
    icon: CircleDollarSign,
    tone: "violet",
    formatValue: (val) => formatCurrency(val),
  },
  active_customers: {
    icon: Users,
    tone: "blue",
    formatValue: (val) => val.toLocaleString(),
  },
  churn_rate: {
    icon: ArrowDownRight,
    tone: "amber",
    formatValue: (val, unit = "%") => `${val}${unit}`,
  },
  avg_response_time: {
    icon: Clock3,
    tone: "green",
    formatValue: (val, unit = "ms") => `${val}${unit}`,
  },
};

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
