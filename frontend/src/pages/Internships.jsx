import React, { useEffect, useState } from "react";
import { Link } from "../router.jsx";
import { useForm } from "react-hook-form";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { Loader, EmptyState, ErrorBanner } from "../components/ui/Feedback.jsx";
import CompanyLogo from "../utils/companyLogos.jsx";

const CAN_POST = ["company", "admin"];
const CAN_MANAGE = ["company", "admin", "coordinator"];

// ---- Local saved-internships helpers (localStorage) ----
const getSaved = () => {
  try {
    return JSON.parse(localStorage.getItem("sims_saved") || "[]");
  } catch {
    return [];
  }
};
const toggleSaved = (id) => {
  const cur = getSaved();
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  localStorage.setItem("sims_saved", JSON.stringify(next));
  return next.includes(id);
};

const PostForm = ({ onCreated, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values) => {
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        stipend: Number(values.stipend) || 0,
        openings: Number(values.openings) || 1,
        skillsRequired: values.skillsRequired
          ? values.skillsRequired.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };
      await api.post("/internships", payload);
      reset();
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Could not post this internship");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-5 space-y-4">
      <p className="font-semibold">Post a new internship</p>
      <ErrorBanner message={error} />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Title</label>
          <input className="input" {...register("title", { required: true })} />
          {errors.title && <p className="text-xs text-danger-500 mt-1">Title is required</p>}
        </div>
        <div>
          <label className="label">Company name</label>
          <input className="input" {...register("companyName", { required: true })} />
        </div>
      </div>

      <div>
        <label className="label">Description</label>
        <textarea className="input" rows={3} {...register("description", { required: true })} />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="label">Location</label>
          <input className="input" {...register("location")} />
        </div>
        <div>
          <label className="label">Mode</label>
          <select className="input" {...register("mode")}>
            <option value="onsite">Onsite</option>
            <option value="hybrid">Hybrid</option>
            <option value="remote">Remote</option>
          </select>
        </div>
        <div>
          <label className="label">Stipend (₹/month)</label>
          <input type="number" className="input" {...register("stipend")} />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="label">Duration</label>
          <input className="input" placeholder="e.g. 8 weeks" {...register("duration")} />
        </div>
        <div>
          <label className="label">Openings</label>
          <input type="number" className="input" defaultValue={1} {...register("openings")} />
        </div>
        <div>
          <label className="label">Application deadline</label>
          <input type="date" className="input" {...register("deadline", { required: true })} />
        </div>
      </div>

      <div>
        <label className="label">Skills required (comma-separated)</label>
        <input className="input" placeholder="React, Node.js, SQL" {...register("skillsRequired")} />
      </div>

      <div>
        <label className="label">Eligibility</label>
        <input className="input" {...register("eligibility")} />
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Posting..." : "Post internship"}
        </button>
        <button type="button" onClick={onCancel} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
};

// Rich internship card with logo, rating, skills, save button
const InternshipCard = ({ internship, onToggleSaved, saved, onApply, applyingId }) => {
  const { user } = useAuth();
  const canApply = user.role === "student";
  const deadlineDays = Math.ceil((new Date(internship.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  const rating = (() => {
    // Deterministic pseudo-rating from the internship id for visual richness
    const h = internship._id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return (4 + (h % 10) / 10).toFixed(1);
  })();

  return (
    <div className="card p-5 card-hover flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <CompanyLogo name={internship.companyName} size={48} />
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-ink-400 uppercase tracking-wide">{internship.companyName}</p>
            <h3 className="font-display text-lg font-semibold text-ink-800 dark:text-ink-50 truncate">{internship.title}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-warning-500">★★★★★</span>
              <span className="text-xs font-medium text-ink-500">{rating}</span>
              <span className="text-xs text-ink-300">·</span>
              <span className="text-xs capitalize text-ink-400">{internship.mode}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={internship.status} />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="flex items-center gap-1 text-ink-600 dark:text-ink-300 font-medium">
          <svg className="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
          {internship.location || "Remote"}
        </span>
        <span className="flex items-center gap-1 text-ink-600 dark:text-ink-300 font-medium">
          <svg className="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          ₹{internship.stipend.toLocaleString("en-IN")}/month
        </span>
        <span className="flex items-center gap-1 text-ink-600 dark:text-ink-300">
          <svg className="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {internship.duration || "Flexible"}
        </span>
      </div>

      {internship.skillsRequired?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {internship.skillsRequired.slice(0, 5).map((s) => (
            <span key={s} className="chip">{s}</span>
          ))}
          {internship.skillsRequired.length > 5 && (
            <span className="chip">+{internship.skillsRequired.length - 5}</span>
          )}
        </div>
      )}

      <div className="mt-auto pt-1 flex items-center justify-between">
        <span className={`text-xs font-medium ${deadlineDays < 3 ? "text-danger-500" : "text-ink-400"}`}>
          {deadlineDays > 0 ? `${deadlineDays} day${deadlineDays === 1 ? "" : "s"} left to apply` : "Closed"}
        </span>
        <div className="flex items-center gap-2">
          <Link to={`/internships/${internship._id}`} className="btn-outline !px-3 !py-1.5 text-xs">
            View
          </Link>
          {canApply && (
            <button
              className="btn-primary !px-3 !py-1.5 text-xs"
              disabled={applyingId === internship._id}
              onClick={() => onApply(internship._id)}
            >
              {applyingId === internship._id ? "Applying..." : "Apply"}
            </button>
          )}
          <button
            onClick={() => onToggleSaved(internship._id)}
            className={`btn-icon !p-2 ${saved ? "text-danger-500 hover:text-danger-600" : ""}`}
            aria-label={saved ? "Unsave" : "Save"}
            title={saved ? "Remove from saved" : "Save internship"}
          >
            <svg className="h-[18px] w-[18px]" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const Internships = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState("");
  const [minStipend, setMinStipend] = useState("");
  const [skill, setSkill] = useState("");
  const [duration, setDuration] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [applyingId, setApplyingId] = useState(null);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(getSaved());
  const [filtersApplied, setFiltersApplied] = useState(false);

  const fetchInternships = async (p = 1) => {
    setLoading(true);
    try {
      const params = {
        search: search || undefined,
        mode: mode || undefined,
        location: location || undefined,
        page: p,
        limit: 6,
      };
      const { data } = await api.get("/internships", { params });
      setInternships(data.internships);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
      setPage(data.page || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setFiltersApplied(true);
    fetchInternships(1);
  };

  const handleToggleSaved = (id) => {
    const isSaved = toggleSaved(id);
    setSaved(getSaved());
    if (isSaved) setMessage("Saved to your list ❤️");
    else setMessage("Removed from saved");
    setTimeout(() => setMessage(""), 2500);
  };

  const handleApply = async (internshipId) => {
    setApplyingId(internshipId);
    setMessage("");
    try {
      await api.post("/applications", { internshipId });
      setMessage("Application submitted successfully 🎉");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not submit application");
    } finally {
      setApplyingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this internship posting?")) return;
    await api.delete(`/internships/${id}`);
    fetchInternships(page);
  };

  const activeFilterCount = [location, minStipend, skill, duration].filter(Boolean).length + (mode ? 1 : 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-primary-600 dark:text-primary-400">
            {user.role === "student" ? "Browse" : "Manage"}
          </p>
          <h1 className="font-display text-2xl font-semibold mt-1">Internships</h1>
          <p className="text-sm text-ink-400 mt-1">{total} internship{total === 1 ? "" : "s"} available</p>
        </div>
        {CAN_POST.includes(user.role) && (
          <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Close" : "+ Post internship"}
          </button>
        )}
      </div>

      {message && (
        <div className="rounded-lg border border-success-200 bg-success-50 dark:bg-success-900/20 dark:border-success-800 text-success-700 dark:text-success-200 text-sm px-4 py-3">
          {message}
        </div>
      )}
      {showForm && (
        <PostForm
          onCreated={() => {
            setShowForm(false);
            fetchInternships(1);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Search bar */}
      <form onSubmit={handleSearch} className="card p-4 space-y-3">
        <div className="flex flex-wrap gap-3">
          <div className="input-group flex-1 min-w-[220px]">
            <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            <input
              className="input"
              placeholder="Search internships, companies, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="input max-w-[150px]" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="">All modes</option>
            <option value="onsite">Onsite</option>
            <option value="hybrid">Hybrid</option>
            <option value="remote">Remote</option>
          </select>
          <button type="submit" className="btn-primary">Search</button>
          <button
            type="button"
            onClick={() => setShowFilters((s) => !s)}
            className={`btn-outline ${activeFilterCount > 0 ? "!border-primary-400 !text-primary-600" : ""}`}
          >
            Filters {activeFilterCount > 0 && <span className="ml-1 rounded-full bg-primary-600 text-white text-[10px] h-5 w-5 flex items-center justify-center">{activeFilterCount}</span>}
          </button>
        </div>

        {showFilters && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-ink-100 dark:border-ink-800">
            <div>
              <label className="label">Location</label>
              <input className="input" placeholder="e.g. Bengaluru, Remote" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div>
              <label className="label">Min stipend (₹/mo)</label>
              <input className="input" type="number" placeholder="e.g. 10000" value={minStipend} onChange={(e) => setMinStipend(e.target.value)} />
            </div>
            <div>
              <label className="label">Skill</label>
              <input className="input" placeholder="e.g. React" value={skill} onChange={(e) => setSkill(e.target.value)} />
            </div>
            <div>
              <label className="label">Duration</label>
              <input className="input" placeholder="e.g. 8 weeks" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
          </div>
        )}
      </form>

      {/* Results */}
      {loading ? (
        <Loader label="Loading internships" />
      ) : internships.length === 0 ? (
        <EmptyState title="No internships found" description="Try a different search or check back later." />
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            {internships.map((i) => (
              <InternshipCard
                key={i._id}
                internship={i}
                saved={saved.includes(i._id)}
                onToggleSaved={handleToggleSaved}
                onApply={handleApply}
                applyingId={applyingId}
              />
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                className="btn-outline !px-3 !py-1.5 text-xs"
                disabled={page <= 1}
                onClick={() => fetchInternships(page - 1)}
              >
                ← Prev
              </button>
              <span className="text-sm text-ink-500">
                Page <span className="font-semibold">{page}</span> of {pages}
              </span>
              <button
                className="btn-outline !px-3 !py-1.5 text-xs"
                disabled={page >= pages}
                onClick={() => fetchInternships(page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Internships;

