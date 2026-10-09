import { formatLastSeen } from "@/components/DateAndTime";
import dashboardData from "@/data/mock_dashboard_data.json";
import { clsx } from "clsx";
import { Download } from "lucide-react";

const customers = dashboardData.customers.data ?? [];

const numberFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const statusClasses: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-800",
  Pending: "bg-amber-100 text-amber-800",
  Cancelled: "bg-rose-100 text-rose-800",
};

const planClasses: Record<string, string> = {
  Enterprise: "bg-violet-100 text-violet-800",
  Pro: "bg-sky-100 text-sky-800",
  Starter: "bg-slate-200 text-gray-800",
};

export default function CustomersPage() {
  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Customer directory</p>
          <h1>Customers</h1>
          <p className="header-description">
            A live view of account health, plan value, and recent engagement.
          </p>
        </div>
        <a
          className="add-button"
          href="/api/customers/export"
          download="customers-report.csv"
        >
          <Download size={15} aria-hidden="true" />
          Export report
        </a>
      </header>

      <section className="panel p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="bg-slate-50 text-[11px] font-medium uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Plan</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">MRR</th>
                <th className="px-5 py-4">Last login</th>
                <th className="px-5 py-4">Country</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-t border-slate-200 bg-white"
                >
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 min-w-10 items-center justify-center rounded-full bg-violet-100 font-mono text-xs font-bold text-violet-700">
                        {customer.company_name
                          .split(" ")
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {customer.company_name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {customer.contact_person}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <span
                      className={clsx(
                        "inline-flex rounded-lg px-3 py-1.5 text-[11px] font-medium",
                        planClasses[customer.plan] ??
                          "bg-slate-100 text-slate-600",
                      )}
                    >
                      {customer.plan}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <span
                      className={clsx(
                        "inline-flex rounded-lg px-3 py-1.5 text-[11px] font-medium",
                        statusClasses[customer.status] ??
                          "bg-slate-100 text-slate-600",
                      )}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-middle font-mono text-sm text-slate-900">
                    {numberFormat.format(customer.mrr)}
                  </td>
                  <td className="px-5 py-4 align-middle text-sm text-slate-500">
                    {formatLastSeen(customer.last_login)}
                  </td>
                  <td className="px-5 py-4 align-middle text-sm text-slate-500">
                    {customer.country}
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
