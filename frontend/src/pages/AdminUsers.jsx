import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Loader, EmptyState, ErrorBanner } from "../components/ui/Feedback.jsx";

const ROLE_TABS = [
  { value: "student", label: "Students" },
  { value: "faculty", label: "Faculty" },
  { value: "company", label: "Company HR" },
];

const AdminUsers = () => {
  const { user: me } = useAuth();
  const [role, setRole] = useState("student");
  const [users, setUsers] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/users", { params: { role, search: search || undefined } });
      setUsers(data.users);

      if (role === "student" && faculty.length === 0) {
        const { data: facultyData } = await api.get("/users", { params: { role: "faculty", limit: 100 } });
        setFaculty(facultyData.users);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const handleAssignMentor = async (studentId, mentorId) => {
    setBusyId(studentId);
    try {
      await api.put(`/users/${studentId}/mentor`, { mentorId: mentorId || null });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Could not assign mentor");
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleStatus = async (userId, isActive) => {
    setBusyId(userId);
    try {
      await api.put(`/users/${userId}/status`, { isActive: !isActive });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update status");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Permanently delete this account?")) return;
    setBusyId(userId);
    try {
      await api.delete(`/users/${userId}`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete user");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-primary-600 dark:text-primary-400">Registry</p>
        <h1 className="font-display text-2xl font-semibold mt-1">Students &amp; Faculty</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-md border border-ink-200 dark:border-ink-700 overflow-hidden">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setRole(tab.value)}
              className={`px-4 py-2 text-sm font-medium ${
                role === tab.value
                  ? "bg-primary-600 text-white"
                  : "bg-white dark:bg-ink-900 text-ink-500 hover:bg-ink-50 dark:hover:bg-ink-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            fetchUsers();
          }}
        >
          <input
            className="input max-w-xs"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-secondary" type="submit">
            Search
          </button>
        </form>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <Loader label="Loading users" />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <div className="card divide-y divide-ink-100 dark:divide-ink-800">
          {users.map((u) => (
            <div key={u._id} className="p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium">
                  {u.name} {!u.isActive && <span className="text-xs text-red-500 ml-2">Suspended</span>}
                </p>
                <p className="text-xs text-ink-400">{u.email}</p>
                {role === "student" && (
                  <p className="text-xs text-ink-400 mt-1">
                    {u.studentProfile?.department || "No department set"} · {u.studentProfile?.year || "—"}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {role === "student" && (
                  <select
                    className="input !py-1.5 !text-xs max-w-[180px]"
                    value={u.studentProfile?.mentor || ""}
                    disabled={busyId === u._id}
                    onChange={(e) => handleAssignMentor(u._id, e.target.value)}
                  >
                    <option value="">No mentor assigned</option>
                    {faculty.map((f) => (
                      <option key={f._id} value={f._id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                )}

                {me.role === "admin" && (
                  <>
                    <button
                      className="btn-outline !py-1.5 text-xs"
                      disabled={busyId === u._id}
                      onClick={() => handleToggleStatus(u._id, u.isActive)}
                    >
                      {u.isActive ? "Suspend" : "Activate"}
                    </button>
                    <button
                      className="btn-outline !py-1.5 text-xs text-red-600"
                      disabled={busyId === u._id}
                      onClick={() => handleDelete(u._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
