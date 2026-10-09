import { KpiCardProps } from "@/types/dashboard";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { clsx } from "clsx";

export function KpiCard({
  label,
  value,
  growth,
  icon: Icon,
  tone,
}: KpiCardProps) {
  const isPositive = growth > 0;

  return (
    <article className="kpi-card">
      <div className={clsx("kpi-icon", tone)}>
        <Icon size={19} />
      </div>
      <p className="card-label">{label}</p>
      <div className="kpi-value-row">
        <strong>{value}</strong>
        <span
          className={clsx({
            "trend positive": isPositive,
            "trend negative": !isPositive,
          })}
        >
          {isPositive ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}
          {Math.abs(growth)}%
        </span>
      </div>
      <p className="card-helper">vs. previous month</p>
    </article>
  );
}
