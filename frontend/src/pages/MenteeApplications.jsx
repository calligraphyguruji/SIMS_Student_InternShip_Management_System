import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { Loader, EmptyState, ErrorBanner } from "../components/ui/Feedback.jsx";

const MenteeApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/applications/mentee");
      setApplications(data.applications);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleReview = async (id, approved) => {
    setSubmittingId(id);
    setError("");
    try {
      await api.put(`/applications/${id}/mentor-approval`, {
        approved,
        comment: comments[id] || "",
      });
      fetchApplications();
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit review");
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) return <Loader label="Loading mentee applications" />;

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-primary-600 dark:text-primary-400">Mentorship</p>
        <h1 className="font-display text-2xl font-semibold mt-1">Mentee Applications</h1>
      </div>

      {error && <ErrorBanner message={error} />}

      {applications.length === 0 ? (
        <EmptyState
          title="No mentee applications yet"
          description="Once a coordinator assigns students to you and they apply to internships, they'll show up here."
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="card p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{app.student?.name}</p>
                  <p className="text-sm text-ink-500">
                    {app.internship?.title} · {app.internship?.companyName}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>

              {app.mentorApproval?.approved !== null ? (
                <p className="text-xs text-success-600">
                  You {app.mentorApproval.approved ? "approved" : "flagged"} this on{" "}
                  {new Date(app.mentorApproval.at).toLocaleDateString()}
                  {app.mentorApproval.comment && ` — "${app.mentorApproval.comment}"`}
                </p>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    className="input flex-1 min-w-[200px] !py-1.5 !text-sm"
                    placeholder="Optional comment"
                    value={comments[app._id] || ""}
                    onChange={(e) => setComments({ ...comments, [app._id]: e.target.value })}
                  />
                  <button
                    className="btn-primary !py-1.5 text-xs"
                    disabled={submittingId === app._id}
                    onClick={() => handleReview(app._id, true)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn-outline !py-1.5 text-xs text-red-600"
                    disabled={submittingId === app._id}
                    onClick={() => handleReview(app._id, false)}
                  >
                    Flag
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenteeApplications;
