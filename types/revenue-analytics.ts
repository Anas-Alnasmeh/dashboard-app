export interface RevenueDataPoint {
  month: string;
  revenue: number;
  expenses: number;
  new_subscriptions: number;
  profit: number;
}

export interface RevenueTotals {
  revenue: number;
  expenses: number;
  profit: number;
  subs: number;
  margin: number;
  revenueDelta: number;
  profitDelta: number;
  subsDelta: number;
  marginDelta: number;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    value?: number;
    payload?: RevenueDataPoint;
  }>;
  label?: string;
}

export interface TooltipRowProps {
  label: string;
  value: string;
  swatch: string;
}

export interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  delta: number;
  accent: string;
}

export interface MetricOption {
  key: MetricKey;
  label: string;
}

export type MetricKey = "all" | "revenue" | "expenses" | "profit";
