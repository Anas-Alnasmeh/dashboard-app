import data from "@/data/mock_dashboard_data.json";
import type { Metadata } from "next";

import {
  ArrowUpRight,
  CheckCircle2,
  FolderKanban,
  MoreHorizontal,
  Plus,
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { KPI_CONFIG } from "@/components/kpiConfig";
import { KpiCard } from "@/components/KpiCard";
import {
  currentDate,
  getGreeting,
  formatLastSeen,
} from "@/components/DateAndTime";
import { clsx } from "clsx";
import { NotificationsMenu } from "@/components/NotificationsMenu";
import ChartDashboard from "@/components/ChartDashboard";

export const metadata: Metadata = {
  title: { absolute: "Dashboard | KIN" },
  description:
    "Get a focused overview of your team's projects, tasks, and workspace performance.",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

export default function Home() {
  const { kpi_metrics: metrics } = data;
  const { current_user: user } = data;
  const { users } = data;

  function findUser(user_id: string) {
    return users.filter((user) => user.id === user_id)[0].name;
  }

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">{currentDate}</p>
          <h1>
            {getGreeting()}, {user.name.split(" ")[0]}{" "}
            <span aria-hidden="true">👋</span>
          </h1>
          <p className="header-description">
            Here&apos;s what&apos;s happening across your workspace today.
          </p>
        </div>
        <div className="header-actions">
          <NotificationsMenu notifications={data.notifications ?? []} />
          <Link href="/profile" aria-label="Open profile page">
            <Image
              src={user.avatar}
              alt={`${user.name} avatar`}
              width={42}
              height={42}
              loading="eager"
              className="rounded-full object-cover ring-2 ring-violet-500/30"
            />
          </Link>
        </div>
      </header>

      <section className="kpi-grid" aria-label="Key performance indicators">
        {Object.entries(metrics).map(([key, item]) => {
          const config = KPI_CONFIG[key];
          if (!config) return null;

          return (
            <KpiCard
              key={key}
              label={key.replace(/_/g, " ")}
              value={config.formatValue(item.value)}
              growth={item.growth_percentage}
              icon={config.icon}
              tone={config.tone}
            />
          );
        })}
      </section>

      <section className="content-grid">
        <ChartDashboard />
        <article className="panel projects-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Delivery</p>
              <h2>Active projects</h2>
            </div>
            <button className="more-button" aria-label="More project options">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="project-list">
            {data.projects.slice(0, 4).map((project) => (
              <div className="project-item" key={project.id}>
                <div className="project-heading">
                  <span className="project-mark">
                    <FolderKanban size={16} />
                  </span>
                  <div>
                    <strong>{project.title}</strong>
                    <span>{project.category}</span>
                  </div>
                  <span
                    className={clsx(
                      "status-pill",
                      project.status.toLowerCase().replace(" ", "-"),
                    )}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="progress-row">
                  <div className="progress-track">
                    <span
                      style={{ width: `${project.progress_percentage}%` }}
                    />
                  </div>
                  <span>{project.progress_percentage}%</span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/projects" className="text-button w-fit">
            View all projects <ArrowUpRight size={15} />
          </Link>
        </article>
      </section>

      <section className="content-grid lower-grid">
        <article className="panel tasks-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Your workspace</p>
              <h2>Tasks at a glance</h2>
            </div>
            <button className="add-button">
              <Plus size={16} /> Add task
            </button>
          </div>
          <div className="task-list">
            {data.kanban_tasks.slice(0, 4).map((task) => (
              <div className="task-item" key={task.id}>
                <span
                  className={clsx("task-check", {
                    complete: task.status === "done",
                  })}
                >
                  <CheckCircle2 size={18} />
                </span>
                <div className="task-copy">
                  <strong>{task.title}</strong>
                  <span>
                    {task.tag} · {task.priority} priority
                  </span>
                </div>
                <span className={clsx("task-status", task.status)}>
                  {task.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
          <Link href="/tasks" className="text-button w-fit">
            View all Tasks <ArrowUpRight size={15} />
          </Link>
        </article>

        <article className="panel activity-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Live updates</p>
              <h2>Recent activity</h2>
            </div>
            <button className="more-button" aria-label="More activity options">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="activity-list">
            {[...data.recent_activities]
              .sort(
                (a, b) =>
                  new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime(),
              )
              .slice(0, 4)
              .map((activity) => (
                <div className="activity-item" key={activity.id}>
                  <span className="avatar">
                    {initials(
                      `${!activity.user_id ? activity.actor_name : findUser(activity.user_id)}`,
                    )}
                  </span>
                  <p>
                    <strong>{`${!activity.user_id ? activity.actor_name : findUser(activity.user_id)}`}</strong>{" "}
                    {activity.action} <b>{activity.target}</b>
                    <span>{formatLastSeen(activity.timestamp)}</span>
                  </p>
                </div>
              ))}
          </div>
        </article>
      </section>
    </main>
  );
}
