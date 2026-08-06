import React, { useEffect, useState } from "react";
import { Link } from "../router.jsx";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import CompanyLogo from "../utils/companyLogos.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { Loader, EmptyState } from "../components/ui/Feedback.jsx";

const getSaved = () => {
  try {
    return JSON.parse(localStorage.getItem("sims_saved") || "[]");
  } catch {
    return [];
  }
};

const SavedInternships = () => {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState(getSaved());
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      if (savedIds.length === 0) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/internships", { params: { limit: 100 } });
        const all = data.internships || [];
        setInternships(all.filter((i) => savedIds.includes(i._id)));
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUnsave = (id) => {
    const next = savedIds.filter((x) => x !== id);
    localStorage.setItem("sims_saved", JSON.stringify(next));
    setSavedIds(next);
    setInternships((cur) => cur.filter((i) => i._id !== id));
    setMessage("Removed from saved");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleApply = async (id) => {
    setApplyingId(id);
    setMessage("");
    try {
      await api.post("/applications", { internshipId: id });
      setMessage("Application submitted successfully 🎉");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not submit application");
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) return <Loader label="Loading saved internships" />;

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-primary-600 dark:text-primary-400">Saved</p>
        <h1 className="font-display text-2xl font-semibold mt-1">Saved Internships</h1>
        <p className="text-sm text-ink-400 mt-1">{internships.length} saved internship{internships.length === 1 ? "" : "s"}</p>
      </div>

      {message && (
        <div className="rounded-lg border border-success-200 bg-success-50 dark:bg-success-900/20 dark:border-success-800 text-success-700 dark:text-success-200 text-sm px-4 py-3">
          {message}
        </div>
      )}

      {internships.length === 0 ? (
        <EmptyState
          title="No saved internships yet"
          description="Browse internships and tap the ♡ icon to save roles you're interested in."
          action={
            <Link to="/internships" className="btn-primary">
              Browse internships
            </Link>
          }
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {internships.map((i) => (
            <div key={i._id} className="card p-5 card-hover flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <CompanyLogo name={i.companyName} size={40} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-ink-400 uppercase">{i.companyName}</p>
                    <h3 className="font-display font-semibold truncate">{i.title}</h3>
                  </div>
                </div>
                <StatusBadge status={i.status} />
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-500">
                <span>📍 {i.location || "Remote"}</span>
                <span className="capitalize">💼 {i.mode}</span>
                <span>💰 ₹{i.stipend.toLocaleString("en-IN")}/mo</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {i.skillsRequired?.slice(0, 4).map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between pt-1">
                <span className="text-xs text-ink-400">
                  Deadline {new Date(i.deadline).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <Link to={`/internships/${i._id}`} className="btn-outline !px-3 !py-1.5 text-xs">View</Link>
                  {user.role === "student" && (
                    <button className="btn-primary !px-3 !py-1.5 text-xs" disabled={applyingId === i._id} onClick={() => handleApply(i._id)}>
                      {applyingId === i._id ? "Applying..." : "Apply"}
                    </button>
                  )}
                  <button onClick={() => handleUnsave(i._id)} className="btn-icon !p-2 text-danger-500" aria-label="Unsave">
                    <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedInternships;

