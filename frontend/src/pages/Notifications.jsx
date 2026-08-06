import React from "react";
import { Link } from "../router.jsx";

const NOTIFICATIONS = [
  {
    id: 1,
    type: "internship",
    icon: "💼",
    title: "2 new internships posted",
    desc: "Frontend & Data roles match your skills profile.",
    time: "Just now",
    to: "/internships",
    unread: true,
  },
  {
    id: 2,
    type: "interview",
    icon: "📅",
    title: "Interview scheduled",
    desc: "TechCorp Solutions · Frontend Developer Intern — Tomorrow, 10:00 AM",
    time: "2 hours ago",
    to: "/my-applications",
    unread: true,
  },
  {
    id: 3,
    type: "resume",
    icon: "📄",
    title: "Resume viewed",
    desc: "Your resume was viewed by TechCorp HR.",
    time: "Yesterday",
    to: "/profile",
    unread: false,
  },
  {
    id: 4,
    type: "status",
    icon: "✅",
    title: "Application accepted",
    desc: "Frontend Developer Intern · TechCorp Solutions",
    time: "2 days ago",
    to: "/my-applications",
    unread: false,
  },
];

const Notifications = () => {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-primary-600 dark:text-primary-400">Activity</p>
          <h1 className="font-display text-2xl font-semibold mt-1">Notifications</h1>
        </div>
        <button className="btn-outline !py-1.5 text-xs">Mark all read</button>
      </div>

      <div className="card divide-y divide-ink-100 dark:divide-ink-800">
        {NOTIFICATIONS.map((n) => (
          <Link
            key={n.id}
            to={n.to}
            className={`block p-5 hover:bg-ink-50 dark:hover:bg-ink-800/60 transition-colors ${n.unread ? "bg-primary-50/50 dark:bg-primary-900/10" : ""}`}
          >
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-lg shrink-0">
                {n.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    {n.title}
                    {n.unread && <span className="h-2 w-2 rounded-full bg-primary-500" />}
                  </p>
                  <span className="text-xs text-ink-400 shrink-0">{n.time}</span>
                </div>
                <p className="text-sm text-ink-500 mt-0.5">{n.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Notifications;

