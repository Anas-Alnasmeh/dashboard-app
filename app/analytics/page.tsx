"use client";

import { useMemo, useState } from "react";
import { Activity, BarChart3, CalendarDays, Download } from "lucide-react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  CustomTooltipProps,
  KpiCardProps,
  MetricKey,
  MetricOption,
  RevenueDataPoint,
  RevenueTotals,
  TooltipRowProps,
} from "@/types/revenue-analytics.ts";
import { revenue_analytics_monthly as monthlyData } from "@/data/mock_dashboard_data.json";
import { clsx } from "clsx";

const data: RevenueDataPoint[] = monthlyData.map((item) => ({
  ...item,
  profit: item.revenue - item.expenses,
}));

const rangeOptions = [
  { value: 3, label: "Last 3 months" },
  { value: 6, label: "Last 6 months" },
  { value: 12, label: "Full year" },
] as const;

const metrics: MetricOption[] = [
  { key: "all", label: "Overview" },
  { key: "revenue", label: "Revenue" },
  { key: "expenses", label: "Expenses" },
  { key: "profit", label: "Profit" },
];

const currencyFull = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const compact = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

function ResponsiveCurrency({ value }: { value: number }) {
  return (
    <>
      <span className="inline max-[500px]:inline min-[501px]:hidden">
        {compact(value)}
      </span>
      <span className="hidden min-[501px]:inline">{currencyFull(value)}</span>
    </>
  );
}

const percentChange = (first: number, last: number): number =>
  first === 0
    ? last === 0
      ? 0
      : 100
    : ((last - first) / Math.abs(first)) * 100;

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const rev = Number(payload.find((p) => p.dataKey === "revenue")?.value ?? 0);
  const exp = Number(payload.find((p) => p.dataKey === "expenses")?.value ?? 0);
  const profit = Number(
    payload.find((p) => p.dataKey === "profit")?.value ?? 0,
  );
  const margin = rev ? ((profit / rev) * 100).toFixed(1) : "0.0";

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl shadow-slate-900/10">
      <p className="mb-2 text-xs font-semibold text-slate-800">{label}</p>
      <div className="space-y-1.5">
        <Row
          swatch="bg-emerald-500"
          label="Revenue"
          value={<ResponsiveCurrency value={rev} />}
        />
        <Row
          swatch="bg-amber-500"
          label="Expenses"
          value={<ResponsiveCurrency value={exp} />}
        />
        <Row
          swatch="bg-violet-500"
          label="Profit"
          value={<ResponsiveCurrency value={profit} />}
        />
      </div>
      <p className="mt-2 border-t border-slate-100 pt-2 text-xs text-slate-500">
        Profit margin{" "}
        <span className="font-semibold text-slate-800">{margin}%</span>
      </p>
    </div>
  );
}

function Row({
  swatch,
  label,
  value,
}: Omit<TooltipRowProps, "value"> & { value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 text-xs">
      <span className="flex items-center gap-2 text-slate-500">
        <span
          aria-hidden="true"
          className={clsx("h-2 w-2 rounded-full", swatch)}
        />
        {label}
      </span>
      <span className="font-medium tabular-nums text-slate-900">{value}</span>
    </div>
  );
}

function KpiCard({
  label,
  value,
  delta,
  accent,
}: Omit<KpiCardProps, "accent"> & { accent: string }) {
  const positive = delta >= 0;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <div className="mt-2 flex flex-col justify-between">
        <span className="w-full font-mono text-2xl font-semibold text-slate-900">
          {value}
        </span>
        <div className="mt-3 mb-1 flex items-center gap-2">
          <span
            className={clsx(
              "flex items-center gap-0.5 rounded-md px-1.5 pb-0.5 pt-0.75 font-mono text-[clamp(8px,2vw,11px)] font-medium",
              {
                "bg-emerald-50 text-emerald-600": positive,
                "bg-red-50 text-red-600": !positive,
              },
            )}
          >
            {positive ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
          </span>
          <span className="text-xs text-slate-400">first to last month</span>
        </div>
      </div>
      <div className="mt-3 h-[3px] w-full rounded-full bg-slate-100">
        <div
          className={clsx("h-full rounded-full", accent)}
          style={{ width: `${Math.min(100, Math.max(0, delta))}%` }}
        />
      </div>
    </div>
  );
}

function downloadCsv(rows: RevenueDataPoint[]) {
  const header = [
    "Month",
    "Revenue (USD)",
    "Expenses (USD)",
    "Profit (USD)",
    "Profit margin (%)",
    "New subscriptions",
  ];
  const csvRows = rows.map((row) =>
    [
      row.month,
      row.revenue,
      row.expenses,
      row.profit,
      (isFinite(row.profit / row.revenue)
        ? (row.profit / row.revenue) * 100
        : 0
      ).toFixed(1),
      row.new_subscriptions,
    ].join(","),
  );
  const csv = `\uFEFF${[header.join(","), ...csvRows].join("\r\n")}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `revenue-analytics-${rows[0].month.toLowerCase()}-${rows[rows.length - 1].month.toLowerCase()}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export default function RevenueAnalyticsPage() {
  const [range, setRange] = useState<3 | 6 | 12>(12);
  const [activeMetric, setActiveMetric] = useState<MetricKey>("all");
  const visibleData = useMemo(() => data.slice(-range), [range]);

  const totals = useMemo((): RevenueTotals => {
    const first = visibleData[0];
    const latest = visibleData[visibleData.length - 1];
    const sum = (key: keyof RevenueDataPoint) =>
      visibleData.reduce((total, point) => total + Number(point[key]), 0);
    const margin = (sum("profit") / sum("revenue")) * 100 || 0;
    return {
      revenue: sum("revenue"),
      expenses: sum("expenses"),
      profit: sum("profit"),
      subs: sum("new_subscriptions"),
      margin: isFinite(margin) ? margin : 0,
      revenueDelta: percentChange(first.revenue, latest.revenue),
      profitDelta: percentChange(first.profit, latest.profit),
      subsDelta: percentChange(
        first.new_subscriptions,
        latest.new_subscriptions,
      ),
      marginDelta:
        (isFinite(latest.profit / latest.revenue)
          ? (latest.profit / latest.revenue) * 100
          : 0) -
        (isFinite(first.profit / first.revenue)
          ? (first.profit / first.revenue) * 100
          : 0),
    };
  }, [visibleData]);

  const bestRevenueMonth = visibleData.reduce((best, point) =>
    point.revenue > best.revenue ? point : best,
  );
  const bestMarginMonth = visibleData.reduce((best, point) =>
    point.profit / point.revenue > best.profit / best.revenue ? point : best,
  );
  const averageRevenue = totals.revenue / visibleData.length;
  const expenseRatio = (totals.expenses / totals.revenue) * 100;
  const periodLabel = `${visibleData[0].month} – ${visibleData[visibleData.length - 1].month}`;

  function handleRangeChange(value: string) {
    const nextRange = Number(value);
    if (nextRange === 3 || nextRange === 6 || nextRange === 12) {
      setRange(nextRange);
    }
  }

  return (
    <main
      className="analytics-shell mx-auto my-8 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 p-6"
      dir="ltr"
    >
      <header className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">
            <Activity size={15} aria-hidden="true" />
            Business performance
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Revenue analytics
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Monitor revenue, profitability, and subscription momentum across
            your business.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <label className="relative flex min-h-11 w-full min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 shadow-sm sm:w-auto">
            <CalendarDays
              size={17}
              className="shrink-0 text-slate-400"
              aria-hidden="true"
            />
            <span className="sr-only">Reporting period</span>
            <select
              value={range}
              onChange={(event) => handleRangeChange(event.target.value)}
              className="w-full min-w-0 cursor-pointer bg-transparent pr-5 font-medium text-slate-700 outline-none sm:min-w-36"
            >
              {rangeOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-white text-slate-900"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => downloadCsv(visibleData)}
            className="cursor-pointer inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700 sm:w-auto"
          >
            <Download size={17} aria-hidden="true" />
            Export report
          </button>
        </div>
      </header>

      <section
        className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Key performance indicators"
      >
        <KpiCard
          label="Total revenue"
          value={<ResponsiveCurrency value={totals.revenue} />}
          delta={totals.revenueDelta}
          accent="bg-emerald-500"
        />
        <KpiCard
          label="Net profit"
          value={<ResponsiveCurrency value={totals.profit} />}
          delta={totals.profitDelta}
          accent="bg-violet-500"
        />
        <KpiCard
          label="Profit margin"
          value={`${totals.margin.toFixed(1)}%`}
          delta={totals.marginDelta}
          accent="bg-blue-500"
        />
        <KpiCard
          label="New subscriptions"
          value={compact(totals.subs)}
          delta={totals.subsDelta}
          accent="bg-amber-500"
        />
      </section>

      <section
        className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]"
        aria-label="Revenue trends"
      >
        <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.025] sm:p-6">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3
                  size={18}
                  className="text-violet-600"
                  aria-hidden="true"
                />
                <h2 className="text-base font-semibold text-slate-900">
                  Revenue performance
                </h2>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Monthly financial performance <span aria-hidden="true">·</span>{" "}
                {periodLabel}
              </p>
            </div>
            <div className="grid w-full grid-cols-2 gap-1 rounded-lg border border-slate-200 bg-white p-1 max-[360px]:grid-cols-1 sm:w-fit sm:grid-cols-4">
              {metrics.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setActiveMetric(m.key)}
                  className={clsx(
                    "min-h-10 rounded-md px-2 py-1.5 text-[12px] font-medium transition-colors cursor-pointer sm:px-3",
                    {
                      "bg-slate-900 text-white dark:bg-slate-700 dark:text-slate-100":
                        activeMetric === m.key,
                      "text-slate-500 hover:text-slate-800":
                        activeMetric !== m.key,
                    },
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div
            className="h-[300px] w-full sm:h-[340px]"
            role="img"
            aria-label={`Monthly revenue, expenses, and profit chart for ${periodLabel}`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={visibleData}
                margin={{ top: 12, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="profitFillLight"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E2E8F0" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#94A3B8",
                    fontSize: 12,
                    fontFamily: "monospace",
                  }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#94A3B8",
                    fontSize: 11,
                    fontFamily: "monospace",
                  }}
                  tickFormatter={(value: number) => `$${compact(value)}`}
                  width={44}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#F1F5F9" }}
                />
                {(activeMetric === "all" || activeMetric === "revenue") && (
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                )}
                {(activeMetric === "all" || activeMetric === "expenses") && (
                  <Bar
                    dataKey="expenses"
                    name="Expenses"
                    fill="#F59E0B"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                )}
                {(activeMetric === "all" || activeMetric === "profit") && (
                  <>
                    <Area
                      dataKey="profit"
                      name="Profit"
                      type="monotone"
                      stroke="none"
                      fill="url(#profitFillLight)"
                    />
                    <Line
                      dataKey="profit"
                      name="Profit"
                      type="monotone"
                      stroke="#7C3AED"
                      strokeWidth={2.5}
                      dot={{
                        r: 3,
                        fill: "#7C3AED",
                        strokeWidth: 2,
                        stroke: "#FFFFFF",
                      }}
                      activeDot={{
                        r: 5,
                        fill: "#7C3AED",
                        strokeWidth: 2,
                        stroke: "#FFFFFF",
                      }}
                    />
                  </>
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-5 border-t border-slate-200 pt-4 text-[12px] text-slate-500">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Revenue
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" /> Expenses
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-violet-500" /> Profit
            </span>
          </div>
        </article>

        <aside
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.025] sm:p-6"
          aria-labelledby="insights-heading"
        >
          <div className="flex items-center gap-2">
            <Activity
              size={18}
              className="text-violet-600"
              aria-hidden="true"
            />
            <h2
              id="insights-heading"
              className="text-base font-semibold text-slate-900"
            >
              Period insights
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {periodLabel} at a glance
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Average monthly revenue
              </p>
              <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-slate-900">
                <ResponsiveCurrency value={averageRevenue} />
              </p>
            </div>
            <div className="border-t border-slate-100 pt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Top revenue month
              </p>
              <div className="mt-1 flex items-baseline justify-between gap-3">
                <p className="font-semibold text-slate-800">
                  {bestRevenueMonth.month}
                </p>
                <p className="font-mono text-sm font-semibold tabular-nums text-slate-900">
                  <ResponsiveCurrency value={bestRevenueMonth.revenue} />
                </p>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Best profit margin
              </p>
              <div className="mt-1 flex items-baseline justify-between gap-3">
                <p className="font-semibold text-slate-800">
                  {bestMarginMonth.month}
                </p>
                <p className="font-mono text-sm font-semibold tabular-nums text-slate-900">
                  {isFinite(bestMarginMonth.profit / bestMarginMonth.revenue)
                    ? (
                        (bestMarginMonth.profit / bestMarginMonth.revenue) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-5">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">
                  Expenses as % of revenue
                </span>
                <span className="font-semibold tabular-nums text-slate-800">
                  {expenseRatio.toFixed(1)}%
                </span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-label="Expenses as a share of revenue"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Number(expenseRatio.toFixed(1))}
              >
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{ width: `${Math.min(expenseRatio, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section
        className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.025]"
        aria-labelledby="monthly-breakdown-heading"
      >
        <div className="flex flex-col justify-between gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2
              id="monthly-breakdown-heading"
              className="text-base font-semibold text-slate-900"
            >
              Monthly breakdown
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Detailed revenue, costs, and subscription activity.
            </p>
          </div>
          <span className="text-xs font-medium text-slate-400">
            {visibleData.length} months
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-5 py-3 sm:px-6">
                  Month
                </th>
                <th scope="col" className="px-5 py-3 text-right">
                  Revenue
                </th>
                <th scope="col" className="px-5 py-3 text-right">
                  Expenses
                </th>
                <th scope="col" className="px-5 py-3 text-right">
                  Net profit
                </th>
                <th scope="col" className="px-5 py-3 text-right">
                  Margin
                </th>
                <th scope="col" className="px-5 py-3 text-right sm:px-6">
                  Subscriptions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleData.map((point) => (
                <tr
                  key={point.month}
                  className="transition-colors hover:bg-slate-50/80 hover:dark:bg-slate-800/50"
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-800 sm:px-6"
                  >
                    {point.month}
                  </th>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right font-mono tabular-nums text-slate-700">
                    <ResponsiveCurrency value={point.revenue} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right font-mono tabular-nums text-slate-500">
                    <ResponsiveCurrency value={point.expenses} />
                  </td>
                  <td
                    className={`whitespace-nowrap px-5 py-3.5 text-right font-mono font-medium tabular-nums ${point.profit >= 0 ? "text-emerald-700" : "text-red-700"}`}
                  >
                    <ResponsiveCurrency value={point.profit} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right font-mono tabular-nums text-slate-700">
                    {(isFinite(point.profit / point.revenue)
                      ? (point.profit / point.revenue) * 100
                      : 0
                    ).toFixed(1)}
                    %
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right font-mono tabular-nums text-slate-700 sm:px-6">
                    {point.new_subscriptions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
