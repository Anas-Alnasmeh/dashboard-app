import dashboardData from "@/data/mock_dashboard_data.json";
import Image from "next/image";
import { clsx } from "clsx";

const projects = dashboardData.projects ?? [];

const statuses: Record<string, string> = {
  "In Progress": "bg-violet-100 text-violet-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Planning: "bg-amber-100 text-amber-700",
};

const priorities: Record<string, string> = {
  High: "bg-rose-100 text-rose-700",
  Critical: "bg-red-100 text-red-700",
  Medium: "bg-sky-100 text-sky-700",
};

export default function ProjectsPage() {
  const { users } = dashboardData ?? [];

  function findAllUsers(assignee_ids: string[]) {
    return users.filter((user) => assignee_ids.includes(user.id));
  }

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h1>Projects</h1>
          <p className="header-description">
            Track delivery progress, priorities, and ownership across the team.
          </p>
        </div>
        <button className="add-button" type="button">
          New project
        </button>
      </header>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article key={project.id} className="panel flex flex-col gap-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
                  {project.category}
                </p>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">
                  {project.title}
                </h2>
              </div>
              <span
                className={clsx(
                  "inline-flex rounded-full min-w-20 justify-center px-2.5 py-1 text-[11px] font-medium",
                  statuses[project.status] ?? "bg-slate-100 text-slate-600",
                )}
              >
                {project.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Due {project.due_date}</span>
              <span
                className={clsx(
                  "rounded-full px-2 py-1 font-medium",
                  priorities[project.priority] ?? "bg-slate-100 text-slate-600",
                )}
              >
                {project.priority}
              </span>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                <span>Progress</span>
                <span className="font-medium text-slate-700">
                  {project.progress_percentage}%
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-violet-500"
                  style={{ width: `${project.progress_percentage}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Budget</span>
              <span className="font-mono text-slate-900">
                ${project.budget.toLocaleString()}
              </span>
            </div>

            <div className="flex -space-x-2">
              {findAllUsers(project.assignee_ids).map((person) => (
                <Image
                  className="rounded-full border-2 border-white object-cover w-[38px] h-[38px]"
                  width={38}
                  height={38}
                  key={person.name}
                  src={person.avatar}
                  alt={person.name}
                  loading="eager"
                />
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
