import React, { useEffect, useState } from "react";
import { Link } from "../router.jsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { Loader, EmptyState } from "../components/ui/Feedback.jsx";
import CompanyLogo from "../utils/companyLogos.jsx";

const STATUS_LABELS = {
  pending: "Pending",
  shortlisted: "Shortlisted",
  interview_scheduled: "Interview",
  approved: "Approved",
  rejected: "Rejected",
  offer_received: "Offer",
  completed: "Completed",
};

const PIE_COLORS = {
  pending: "#F59E0B",
  shortlisted: "#8B5CF6",
  interview_scheduled: "#3B82F6",
  approved: "#10B981",
  rejected: "#EF4444",
  offer_received: "#14B8A6",
  completed: "#6366F1",
};

const toChartData = (byStatus = {}) =>
  Object.entries(byStatus)
    .map(([status, count]) => ({ status: STATUS_LABELS[status] || status, count }))
    .filter((d) => d.count > 0);

const gradientId = "dashBar";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/stats/dashboard");
        setStats(data.stats);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader label="Loading dashboard" />;

  const firstName = user?.name?.split(" ")[0] || "there";
  const chartData = toChartData(stats.byStatus);
  const totalApps = stats.totalApplications || 0;
  const accepted = stats.byStatus?.approved || 0;
  const acceptanceRate = totalApps > 0 ? Math.round((accepted / totalApps) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-600 to-primary-400 text-white p-6 md:p-8">
        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -right-4 h-56 w-56 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-primary-100 font-mono text-xs uppercase tracking-widest">Dashboard</p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold mt-1">Welcome back, {firstName} 👋</h1>
          <p className="text-primary-100 text-sm mt-2 max-w-lg">
            {user.role === "student" && "Here's what's happening with your internship applications."}
            {user.role === "company" && "Here's how your internship postings are performing."}
            {user.role === "faculty" && "Here's an overview of your mentees and their applications."}
            {(user.role === "coordinator" || user.role === "admin") && "Here's the registry-wide overview."}
          </p>
          {user.role === "student" && (
            <Link to="/internships" className="inline-flex items-center gap-2 mt-4 rounded-lg bg-white text-primary-700 px-4 py-2 text-sm font-semibold hover:bg-primary-50 transition-colors">
              Browse internships
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
          )}
        </div>
      </div>

      {/* Student stats */}
      {user.role === "student" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-5 card-hover">
              <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">Total Applied</p>
              <p className="font-mono text-3xl font-semibold mt-2 text-ink-800 dark:text-ink-100">{stats.totalApplications || 0}</p>
            </div>
            <div className="card p-5 card-hover border-success-200 dark:border-success-800">
              <p className="text-xs font-medium text-success-600 uppercase tracking-wide">Accepted</p>
              <p className="font-mono text-3xl font-semibold mt-2 text-success-600">{stats.byStatus?.approved || 0}</p>
            </div>
            <div className="card p-5 card-hover border-warning-200 dark:border-warning-800">
              <p className="text-xs font-medium text-warning-600 uppercase tracking-wide">Pending</p>
              <p className="font-mono text-3xl font-semibold mt-2 text-warning-600">{stats.byStatus?.pending || 0}</p>
            </div>
            <div className="card p-5 card-hover border-danger-200 dark:border-danger-800">
              <p className="text-xs font-medium text-danger-600 uppercase tracking-wide">Rejected</p>
              <p className="font-mono text-3xl font-semibold mt-2 text-danger-600">{stats.byStatus?.rejected || 0}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Charts card */}
            {chartData.length > 0 && (
              <div className="card p-5">
                <p className="font-semibold">Application status</p>
                <p className="text-xs text-ink-400 mb-4">Your application funnel at a glance</p>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={chartData} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                      {chartData.map((d) => (
                        <Cell key={d.status} fill={PIE_COLORS[d.status] || "#94a3b8"} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recent applications */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold">Recent applications</p>
                <Link to="/my-applications" className="text-xs text-primary-600 hover:underline">View all</Link>
              </div>
              {stats.recentApplications?.length ? (
                <div className="divide-y divide-ink-100 dark:divide-ink-800">
                  {stats.recentApplications.map((app) => (
                    <div key={app._id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <CompanyLogo name={app.internship?.companyName} size={36} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{app.internship?.title}</p>
                          <p className="text-xs text-ink-400">{app.internship?.companyName}</p>
                        </div>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No applications yet" description="Browse open internships to get started." />
              )}
            </div>
          </div>
        </>
      )}

      {/* Faculty stats */}
      {user.role === "faculty" && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card p-5 card-hover">
            <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">Total Mentees</p>
            <p className="font-mono text-3xl font-semibold mt-2 text-ink-800 dark:text-ink-100">{stats.totalMentees || 0}</p>
          </div>
          <div className="card p-5 card-hover">
            <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">Mentee Applications</p>
            <p className="font-mono text-3xl font-semibold mt-2 text-primary-600">{stats.totalApplications || 0}</p>
          </div>
          <div className="card p-5 card-hover border-warning-200 dark:border-warning-800">
            <p className="text-xs font-medium text-warning-600 uppercase tracking-wide">Awaiting Your Review</p>
            <p className="font-mono text-3xl font-semibold mt-2 text-warning-600">{stats.pendingReview || 0}</p>
          </div>
        </div>
      )}

      {/* Company stats */}
      {user.role === "company" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-5 card-hover">
              <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">Internships Posted</p>
              <p className="font-mono text-3xl font-semibold mt-2 text-ink-800 dark:text-ink-100">{stats.totalInternshipsPosted || 0}</p>
            </div>
            <div className="card p-5 card-hover">
              <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">Currently Open</p>
              <p className="font-mono text-3xl font-semibold mt-2 text-success-600">{stats.openInternships || 0}</p>
            </div>
            <div className="card p-5 card-hover">
              <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">Total Applicants</p>
              <p className="font-mono text-3xl font-semibold mt-2 text-primary-600">{stats.totalApplications || 0}</p>
            </div>
            <div className="card p-5 card-hover">
              <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">Acceptance Rate</p>
              <p className="font-mono text-3xl font-semibold mt-2 text-success-600">{acceptanceRate}%</p>
            </div>
          </div>

          {chartData.length > 0 && (
            <div className="card p-5">
              <p className="font-semibold">Applicants by stage</p>
              <p className="text-xs text-ink-400 mb-4">Volume of applications across the workflow</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData}>
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill={`url(#${gradientId})`} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      {/* Coordinator/Admin stats */}
      {(user.role === "coordinator" || user.role === "admin") && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="card p-5 card-hover"><p className="text-xs font-medium text-ink-400 uppercase tracking-wide">Students</p><p className="font-mono text-3xl font-semibold mt-2">{stats.totalStudents || 0}</p></div>
            <div className="card p-5 card-hover"><p className="text-xs font-medium text-ink-400 uppercase tracking-wide">Faculty</p><p className="font-mono text-3xl font-semibold mt-2">{stats.totalFaculty || 0}</p></div>
            <div className="card p-5 card-hover"><p className="text-xs font-medium text-ink-400 uppercase tracking-wide">Companies</p><p className="font-mono text-3xl font-semibold mt-2">{stats.totalCompanies || 0}</p></div>
            <div className="card p-5 card-hover"><p className="text-xs font-medium text-ink-400 uppercase tracking-wide">Internships</p><p className="font-mono text-3xl font-semibold mt-2">{stats.totalInternships || 0}</p></div>
            <div className="card p-5 card-hover"><p className="text-xs font-medium text-ink-400 uppercase tracking-wide">Applications</p><p className="font-mono text-3xl font-semibold mt-2">{stats.totalApplications || 0}</p></div>
          </div>

          {chartData.length > 0 && (
            <div className="card p-5">
              <p className="font-semibold">Applications by stage — all cohorts</p>
              <p className="text-xs text-ink-400 mb-4">Registry-wide application distribution</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData}>
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill={`url(#${gradientId})`} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;

