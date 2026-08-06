import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { ErrorBanner } from "../components/ui/Feedback.jsx";

const SuccessBanner = ({ message }) => {
  if (!message) return null;
  return (
    <div className="rounded-md border border-success-200 bg-success-50 dark:bg-success-900/20 dark:border-success-800 text-success-700 dark:text-success-200 text-sm px-4 py-3 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
    </div>
  );
};

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [editing, setEditing] = useState(false);
  const resumeInputRef = useRef(null);

  const initials = (user?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const skills = user?.studentProfile?.skills || [];
  const cgpa = user?.studentProfile?.cgpa;
  const dept = user?.studentProfile?.department || user?.facultyProfile?.department || "";

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user.name,
      phone: user.phone,
      department: user.studentProfile?.department || user.facultyProfile?.department || "",
      year: user.studentProfile?.year || "",
      cgpa: user.studentProfile?.cgpa || "",
      skills: user.studentProfile?.skills?.join(", ") || "",
      linkedin: user.studentProfile?.linkedin || "",
      github: user.studentProfile?.github || "",
      portfolio: user.studentProfile?.portfolio || "",
      resumeUrl: user.studentProfile?.resumeUrl || "",
      designation: user.facultyProfile?.designation || "",
      companyName: user.companyProfile?.companyName || "",
      industry: user.companyProfile?.industry || "",
      website: user.companyProfile?.website || "",
    },
  });

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError("");
    setMessage("");
    setUploadingResume(true);

    try {
      const data = await fileToBase64(file);
      await api.post("/users/me/resume", {
        fileName: file.name,
        mimeType: file.type,
        data,
      });
      await refreshUser();
      setMessage("Resume uploaded successfully.");
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  const onSubmit = async (values) => {
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const payload = { name: values.name, phone: values.phone };

      if (user.role === "student") {
        payload.studentProfile = {
          department: values.department,
          year: values.year,
          cgpa: Number(values.cgpa) || undefined,
          skills: values.skills ? values.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
          linkedin: values.linkedin,
          github: values.github,
          portfolio: values.portfolio,
          resumeUrl: values.resumeUrl,
        };
      }
      if (user.role === "faculty") {
        payload.facultyProfile = { department: values.department, designation: values.designation };
      }
      if (user.role === "company") {
        payload.companyProfile = { companyName: values.companyName, industry: values.industry, website: values.website };
      }

      await api.put("/users/me", payload);
      await refreshUser();
      setMessage("Changes saved successfully.");
      setTimeout(() => setMessage(""), 4000);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-primary-600 dark:text-primary-400">Account</p>
        <h1 className="font-display text-2xl font-semibold mt-1">My Profile</h1>
      </div>

      {/* Profile card */}
      <div className="card overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary-600 to-primary-400" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 flex-wrap gap-4">
            <div className="flex items-end gap-4">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-400 text-white flex items-center justify-center font-display text-2xl font-semibold ring-4 ring-white dark:ring-ink-900">
                {initials}
              </div>
              <div className="pb-1">
                <h2 className="font-display text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-ink-400">
                  {dept || (user.role === "company" ? user.companyProfile?.companyName : "")}
                  {user.studentProfile?.year ? ` · ${user.studentProfile.year}` : ""}
                </p>
              </div>
            </div>
            <button className="btn-outline" onClick={() => setEditing((e) => !e)}>
              {editing ? "Cancel" : "✎ Edit Profile"}
            </button>
          </div>

          {/* Stat chips */}
          {user.role === "student" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="rounded-lg bg-ink-50 dark:bg-ink-800/60 p-3 text-center">
                <p className="font-mono text-2xl font-semibold text-primary-600">{cgpa || "—"}</p>
                <p className="text-[11px] text-ink-400 uppercase tracking-wide mt-0.5">CGPA</p>
              </div>
              <div className="rounded-lg bg-ink-50 dark:bg-ink-800/60 p-3 text-center">
                <p className="font-mono text-2xl font-semibold text-ink-800 dark:text-ink-100">{skills.length}</p>
                <p className="text-[11px] text-ink-400 uppercase tracking-wide mt-0.5">Skills</p>
              </div>
              <div className="rounded-lg bg-ink-50 dark:bg-ink-800/60 p-3 text-center">
                <p className="font-mono text-2xl font-semibold text-success-600">0</p>
                <p className="text-[11px] text-ink-400 uppercase tracking-wide mt-0.5">Certificates</p>
              </div>
              <div className="rounded-lg bg-ink-50 dark:bg-ink-800/60 p-3 text-center">
                <p className="font-mono text-2xl font-semibold text-warning-600">0</p>
                <p className="text-[11px] text-ink-400 uppercase tracking-wide mt-0.5">On-going</p>
              </div>
            </div>
          )}

          {/* Skills */}
          {user.role === "student" && skills.length > 0 && (
            <div className="mt-5">
              <p className="label mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span key={s} className="chip !px-3 !py-1 !text-sm">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Resume / certificates actions */}
          {user.role === "student" && (
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-ink-100 dark:border-ink-800 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-danger-50 dark:bg-danger-900/20 flex items-center justify-center text-danger-600">📄</div>
                  <div>
                    <p className="text-sm font-medium">Resume</p>
                    <p className="text-xs text-ink-400">{user.studentProfile?.resumeUrl ? "Uploaded" : "Not uploaded"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.studentProfile?.resumeUrl && (
                    <a
                      href={user.studentProfile.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline !px-3 !py-1.5 text-xs"
                    >
                      View
                    </a>
                  )}
                  <button
                    type="button"
                    className="btn-primary !px-3 !py-1.5 text-xs"
                    disabled={uploadingResume}
                    onClick={() => resumeInputRef.current?.click()}
                  >
                    {uploadingResume ? "Uploading..." : user.studentProfile?.resumeUrl ? "Replace" : "Upload"}
                  </button>
                  <input
                    ref={resumeInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleResumeUpload}
                  />
                </div>
              </div>
              <div className="rounded-lg border border-ink-100 dark:border-ink-800 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-success-50 dark:bg-success-900/20 flex items-center justify-center text-success-600">🏆</div>
                  <div>
                    <p className="text-sm font-medium">Certificates</p>
                    <p className="text-xs text-ink-400">View your earned certificates</p>
                  </div>
                </div>
                <button className="btn-outline !px-3 !py-1.5 text-xs">View</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
          <p className="font-semibold">Edit Profile</p>
          <SuccessBanner message={message} />
          <ErrorBanner message={error} />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Name</label>
              <input className="input" {...register("name")} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" {...register("phone")} />
            </div>
          </div>

          <div>
            <label className="label">Email</label>
            <input className="input opacity-60" value={user.email} disabled />
          </div>

          {user.role === "student" && (
            <>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="label">Department</label>
                  <input className="input" {...register("department")} />
                </div>
                <div>
                  <label className="label">Year</label>
                  <input className="input" {...register("year")} />
                </div>
                <div>
                  <label className="label">CGPA</label>
                  <input type="number" step="0.01" className="input" {...register("cgpa")} />
                </div>
              </div>
              <div>
                <label className="label">Skills (comma-separated)</label>
                <input className="input" {...register("skills")} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">LinkedIn</label>
                  <input className="input" {...register("linkedin")} />
                </div>
                <div>
                  <label className="label">GitHub</label>
                  <input className="input" {...register("github")} />
                </div>
                <div>
                  <label className="label">Portfolio</label>
                  <input className="input" {...register("portfolio")} />
                </div>
                <div>
                  <label className="label">Resume</label>
                  <div className="flex gap-2">
                    <input className="input" value={user.studentProfile?.resumeUrl || "No resume uploaded"} disabled />
                    <button
                      type="button"
                      className="btn-outline shrink-0"
                      disabled={uploadingResume}
                      onClick={() => resumeInputRef.current?.click()}
                    >
                      {uploadingResume ? "Uploading..." : "Upload file"}
                    </button>
                  </div>
                  <input type="hidden" {...register("resumeUrl")} />
                </div>
              </div>
            </>
          )}

          {user.role === "faculty" && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Department</label>
                <input className="input" {...register("department")} />
              </div>
              <div>
                <label className="label">Designation</label>
                <input className="input" {...register("designation")} />
              </div>
            </div>
          )}

          {user.role === "company" && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Company name</label>
                <input className="input" {...register("companyName")} />
              </div>
              <div>
                <label className="label">Industry</label>
                <input className="input" {...register("industry")} />
              </div>
              <div>
                <label className="label">Website</label>
                <input className="input" {...register("website")} />
              </div>
            </div>
          )}

          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "Saving..." : "Save changes"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
