import dashboardData from "@/data/mock_dashboard_data.json";
import Image from "next/image";
import { clsx } from "clsx";

const tasks = dashboardData.kanban_tasks ?? [];
const { users } = dashboardData ?? [];

const userMap = new Map(users.map((user) => [user.id, user]));

const columns = [
  { key: "todo", title: "To do", accent: "bg-slate-100 text-slate-700" },
  {
    key: "in_progress",
    title: "In progress",
    accent: "bg-violet-100 text-violet-700",
  },
  { key: "review", title: "Review", accent: "bg-amber-100 text-amber-700" },
  { key: "done", title: "Done", accent: "bg-emerald-100 text-emerald-700" },
] as const;

const priorityClasses: Record<string, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-rose-100 text-rose-700",
};

export default function TasksPage() {
  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Team workflow</p>
          <h1>Tasks</h1>
          <p className="header-description">
            A clear view of every task moving through delivery and review.
          </p>
        </div>
        <button className="add-button" type="button">
          Add task
        </button>
      </header>

      <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
        {columns.map((column) => {
          const columnTasks = tasks.filter(
            (task) => task.status === column.key,
          );

          return (
            <div key={column.key} className="panel p-4 flex flex-col h-full">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">
                  {column.title}
                </h2>
                <span
                  className={clsx(
                    "rounded-full px-2 py-1 text-[11px] font-medium",
                    column.accent,
                  )}
                >
                  {columnTasks.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 flex flex-col">
                {columnTasks.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-400 h-full flex items-center justify-center">
                    No tasks in this state.
                  </div>
                ) : (
                  columnTasks.map((task) => {
                    const assignee = userMap.get(task.assignee_id) ?? {
                      name: "Unassigned",
                      avatar:
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4EqrNcj9a_lNfv2gnqBCgXpM8sKQ5sHWJO0fTYCffMA&s=10",
                    };

                    return (
                      <article
                        key={task.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 flex flex-col h-full justify-between"
                      >
                        <div>
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <span
                              className={clsx(
                                "rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-wide",
                                priorityClasses[task.priority] ??
                                  "bg-slate-100 text-slate-600",
                              )}
                            >
                              {task.priority}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {task.tag}
                            </span>
                          </div>

                          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">
                            {task.title}
                          </h3>
                          <p
                            className="mt-2 text-xs leading-5 text-slate-500 line-clamp-3"
                            title={task.description}
                          >
                            {task.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-2 border-t border-slate-200/60">
                          <div className="mb-3 flex items-center justify-between text-[11px] text-slate-500">
                            <span>{task.comments_count} comments</span>
                            <span>{task.attachments_count} files</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <Image
                                width={28}
                                height={28}
                                src={assignee.avatar}
                                alt={assignee.name}
                                className="h-7 w-7 rounded-full object-cover shrink-0"
                              />
                              <span className="text-xs text-slate-600 truncate">
                                {assignee.name}
                              </span>
                            </div>
                            <span className="font-mono text-[11px] text-slate-400 ml-2">
                              {task.id}
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
