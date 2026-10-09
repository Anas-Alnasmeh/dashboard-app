"use client";

import data from "@/data/mock_dashboard_data.json";

import { useState } from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "./kpiConfig";

export default function ChartDashboard() {
  const [analyticsMonthlyCount, setAnalyticsMonthlyCount] = useState(-6);

  return (
    <article className="panel revenue-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Performance overview</p>
          <h2>Revenue analytics</h2>
        </div>
        <select
          value={analyticsMonthlyCount}
          className="flex items-center gap-1.5 border border-[#e9e8ef] rounded-lg bg-white px-2.5 py-2 text-[.72rem] text-[#666478] cursor-pointer outline-none"
          onChange={(ev) => {
            setAnalyticsMonthlyCount(+ev.target.value);
          }}
        >
          {Array.from({ length: 10 }, (_, i) => {
            const months = 12 - i;
            return (
              <option key={-months} value={-months}>
                Last {months} months
              </option>
            );
          })}
        </select>
      </div>
      <div className="chart-legend">
        <span>
          <i className="legend-dot revenue" />
          Revenue
        </span>
        <span>
          <i className="legend-dot expenses" />
          Expenses
        </span>
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data.revenue_analytics_monthly.slice(analyticsMonthlyCount)}
            margin={{ top: 12, right: 4, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7357f6" stopOpacity={0.24} />
                <stop offset="100%" stopColor="#7357f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="#ececf2"
              className="dark:stroke-[#333]"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9696a8", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9696a8", fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                backgroundColor: "var(--chart-tooltip-background)",
                color: "var(--foreground)",
                border: "1px solid var(--chart-tooltip-border)",
                borderRadius: 12,
                boxShadow: "0 8px 24px rgba(40, 35, 70, .1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#7357f6"
              strokeWidth={3}
              fill="url(#revenueFill)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#ce9fff"
              strokeWidth={2}
              fill="none"
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
