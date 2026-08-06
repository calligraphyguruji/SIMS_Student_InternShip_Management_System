import React, { useEffect, useState } from "react";
import { Link } from "../router.jsx";
import api from "../services/api.js";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { Loader, EmptyState } from "../components/ui/Feedback.jsx";
import CompanyLogo from "../utils/companyLogos.jsx";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/applications/my");
      setApplications(data.applications);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <Loader label="Loading applications" />;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-primary-600 dark:text-primary-400">Tracking</p>
        <h1 className="font-display text-2xl font-semibold mt-1">My Applications</h1>
        <p className="text-sm text-ink-400 mt-1">{applications.length} total application{applications.length === 1 ? "" : "s"}</p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="You haven't applied to anything yet"
          description="Browse open internships and apply to get started."
          action={
            <Link to="/internships" className="btn-primary">
              Browse internships
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="card p-5 card-hover">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <CompanyLogo name={app.internship?.companyName} size={44} />
                  <div className="min-w-0">
                    <p className="font-display font-semibold truncate">{app.internship?.title}</p>
                    <p className="text-sm text-ink-500">{app.internship?.companyName}</p>
                    <p className="text-xs text-ink-400 mt-0.5">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <StatusBadge status={app.status} />
              </div>

              {app.mentorApproval?.approved !== null && (
                <p className="text-xs mt-3 text-ink-400">
                  Mentor {app.mentorApproval.approved ? "approved" : "flagged"} this application
                  {app.mentorApproval.comment ? `: "${app.mentorApproval.comment}"` : ""}
                </p>
              )}

              <details className="mt-3">
                <summary className="text-xs text-primary-600 cursor-pointer hover:underline">View timeline</summary>
                <ul className="mt-2 space-y-1.5 border-l border-ink-100 dark:border-ink-800 pl-4">
                  {app.history?.map((h, idx) => (
                    <li key={idx} className="text-xs text-ink-400 flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-400 shrink-0" />
                      <span>
                        <span className="font-medium text-ink-600 dark:text-ink-300 capitalize">
                          {h.status.replace("_", " ")}
                        </span>{" "}
                        — {new Date(h.at).toLocaleString()} {h.note && `— ${h.note}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;

