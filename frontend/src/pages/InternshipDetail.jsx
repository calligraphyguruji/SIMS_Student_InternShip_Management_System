import React, { useEffect, useState } from "react";
import { useParams, Link } from "../router.jsx";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { Loader, ErrorBanner } from "../components/ui/Feedback.jsx";
import CompanyLogo from "../utils/companyLogos.jsx";

const getSaved = () => {
  try {
    return JSON.parse(localStorage.getItem("sims_saved") || "[]");
  } catch {
    return [];
  }
};

const InternshipDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [applying, setApplying] = useState(false);
  const [saved, setSaved] = useState(getSaved().includes(id));

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get(`/internships/${id}`);
      setInternship(data.internship);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    setMessage("");
    try {
      await api.post("/applications", { internshipId: id });
      setMessage("Application submitted successfully 🎉");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not submit application");
    } finally {
      setApplying(false);
    }
  };

  const handleToggleSaved = () => {
    const cur = getSaved();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    localStorage.setItem("sims_saved", JSON.stringify(next));
    setSaved(next.includes(id));
    setMessage(next.includes(id) ? "Saved to your list ❤️" : "Removed from saved");
    setTimeout(() => setMessage(""), 2500);
  };

  if (loading) return <Loader label="Loading internship" />;
  if (!internship) return <ErrorBanner message="Internship not found" />;

  const rating = (() => {
    const h = internship._id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return (4 + (h % 10) / 10).toFixed(1);
  })();

  const deadlineDays = Math.ceil((new Date(internship.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  const details = [
    { label: "Location", value: internship.location || "Remote", icon: "📍" },
    { label: "Mode", value: internship.mode, icon: "💼" },
    { label: "Stipend", value: `₹${internship.stipend.toLocaleString("en-IN")}/month`, icon: "💰" },
    { label: "Duration", value: internship.duration || "Flexible", icon: "⏳" },
    { label: "Openings", value: internship.openings, icon: "👥" },
    { label: "Deadline", value: `${new Date(internship.deadline).toLocaleDateString()} (${deadlineDays}d left)`, icon: "📅" },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <Link to="/internships" className="text-xs text-primary-600 hover:underline inline-flex items-center gap-1">
        ← Back to internships
      </Link>

      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <CompanyLogo name={internship.companyName} size={56} />
            <div>
              <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">{internship.companyName}</p>
              <h1 className="font-display text-2xl font-semibold mt-0.5">{internship.title}</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-warning-500">★★★★★</span>
                <span className="text-sm font-medium text-ink-600">{rating}</span>
                <span className="text-xs text-ink-300">·</span>
                <span className="text-xs capitalize text-ink-400">{internship.mode}</span>
              </div>
            </div>
          </div>
          <StatusBadge status={internship.status} />
        </div>

        {/* Quick details */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mt-6">
          {details.map((d) => (
            <div key={d.label} className="rounded-lg bg-ink-50 dark:bg-ink-800/60 p-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">{d.label}</p>
              <p className="text-sm font-medium mt-0.5 text-ink-800 dark:text-ink-100">{d.icon} {d.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="card p-6 space-y-4">
        <div>
          <p className="label">About the role</p>
          <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed">{internship.description}</p>
        </div>

        {internship.skillsRequired?.length > 0 && (
          <div>
            <p className="label mb-2">Skills required</p>
            <div className="flex flex-wrap gap-2">
              {internship.skillsRequired.map((s) => (
                <span key={s} className="chip !text-sm !px-3 !py-1">{s}</span>
              ))}
            </div>
          </div>
        )}

        {internship.eligibility && (
          <div>
            <p className="label">Eligibility</p>
            <p className="text-sm">{internship.eligibility}</p>
          </div>
        )}

        {message && <ErrorBanner message={message} />}

        <div className="flex gap-3 pt-2">
          {user.role === "student" && (
            <button className="btn-primary" disabled={applying} onClick={handleApply}>
              {applying ? "Applying..." : "Apply to this internship"}
            </button>
          )}
          <button onClick={handleToggleSaved} className={`btn-outline ${saved ? "!text-danger-500 !border-danger-300" : ""}`}>
            {saved ? "♥ Saved" : "♡ Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetail;

