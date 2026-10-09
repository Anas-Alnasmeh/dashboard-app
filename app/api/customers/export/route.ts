import dashboardData from "@/data/mock_dashboard_data.json";

type CsvValue = string | number;

function escapeCsvValue(value: CsvValue): string {
  const text = String(value);
  const safeText =
    typeof value === "string" && /^[\t\r\n ]*[=+\-@]/.test(text)
      ? `'${text}`
      : text;

  return `"${safeText.replaceAll('"', '""')}"`;
}

export function GET() {
  const headers = [
    "Customer ID",
    "Company",
    "Contact person",
    "Email",
    "Plan",
    "Status",
    "MRR (USD)",
    "Joined date",
    "Last login",
    "Country",
  ];
  const rows = dashboardData.customers.data.map((customer) =>
    [
      customer.id,
      customer.company_name,
      customer.contact_person,
      customer.email,
      customer.plan,
      customer.status,
      customer.mrr,
      customer.joined_date,
      customer.last_login,
      customer.country,
    ]
      .map(escapeCsvValue)
      .join(","),
  );
  const csv = `\uFEFF${[headers.map(escapeCsvValue).join(","), ...rows].join("\r\n")}`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="customers-report.csv"',
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
