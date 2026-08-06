import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { Loader, EmptyState, ErrorBanner } from "../components/ui/Feedback.jsx";

const NEXT_STATUSES = [
  "pending",
  "shortlisted",
  "interview_scheduled",
  "approved",
  "rejected",
  "offer_received",
  "completed",
];

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/applications", {
        params: { status: statusFilter || undefined },
      });
      setApplications(data.applications);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    setError("");
    try {
      await api.put(`/applications/${id}/status`, { status });
      fetchApplications();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-primary-600 dark:text-primary-400">Review</p>
          <h1 className="font-display text-2xl font-semibold mt-1">Applications</h1>
        </div>
        <select className="input max-w-[200px]" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {NEXT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <Loader label="Loading applications" />
      ) : applications.length === 0 ? (
        <EmptyState title="No applications here yet" />
      ) : (
        <div className="card divide-y divide-ink-100 dark:divide-ink-800">
          {applications.map((app) => (
            <div key={app._id} className="p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium flex items-center gap-2">
                  {app.student?.name}
                  {app.mentorApproval?.approved !== null && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${app.mentorApproval.approved ? "bg-success-50 text-success-600 dark:bg-success-900/20" : "bg-danger-50 text-danger-600 dark:bg-danger-900/20"}`}>
                      Mentor {app.mentorApproval.approved ? "approved" : "flagged"}
                    </span>
                  )}
                </p>
                <p className="text-xs text-ink-400">{app.student?.email}</p>
                <p className="text-sm text-ink-500 mt-1">
                  {app.internship?.title} · {app.internship?.companyName}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={app.status} />
                <select
                  className="input !py-1.5 !text-xs max-w-[170px]"
                  value={app.status}
                  disabled={updatingId === app._id}
                  onChange={(e) => handleStatusChange(app._id, e.target.value)}
                >
                  {NEXT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageApplications;

