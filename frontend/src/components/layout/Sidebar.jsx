import React from "react";
import { NavLink } from "../../router.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import SIMSLogo from "../ui/SIMSLogo.jsx";

// Lightweight inline icon components (no new deps)
const Icons = {
  dashboard: () => (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
  ),
  browse: () => (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
  ),
  applications: () => (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
  ),
  saved: () => (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
  ),
  notifications: () => (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
  ),
  profile: () => (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
  ),
  settings: () => (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  ),
  logout: () => (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
  ),
};

const NAV_BY_ROLE = {
  student: [
    { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/internships", label: "Browse Internships", icon: "browse" },
    { to: "/my-applications", label: "My Applications", icon: "applications" },
    { to: "/saved", label: "Saved Internships", icon: "saved" },
    { to: "/notifications", label: "Notifications", icon: "notifications" },
    { to: "/profile", label: "My Profile", icon: "profile" },
  ],
  faculty: [
    { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/mentee-applications", label: "Mentee Applications", icon: "applications" },
    { to: "/notifications", label: "Notifications", icon: "notifications" },
    { to: "/profile", label: "My Profile", icon: "profile" },
  ],
  company: [
    { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/internships", label: "My Postings", icon: "browse" },
    { to: "/manage-applications", label: "Applicants", icon: "applications" },
    { to: "/notifications", label: "Notifications", icon: "notifications" },
    { to: "/profile", label: "My Profile", icon: "profile" },
  ],
  coordinator: [
    { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/internships", label: "All Internships", icon: "browse" },
    { to: "/manage-applications", label: "All Applications", icon: "applications" },
    { to: "/admin/users", label: "Students & Faculty", icon: "profile" },
    { to: "/notifications", label: "Notifications", icon: "notifications" },
    { to: "/profile", label: "My Profile", icon: "profile" },
  ],
  admin: [
    { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/internships", label: "Internships", icon: "browse" },
    { to: "/manage-applications", label: "Applications", icon: "applications" },
    { to: "/admin/users", label: "Manage Users", icon: "profile" },
    { to: "/notifications", label: "Notifications", icon: "notifications" },
    { to: "/profile", label: "My Profile", icon: "profile" },
  ],
};

const ROLE_LABEL = {
  student: "Student",
  faculty: "Faculty Mentor",
  company: "Company HR",
  coordinator: "Coordinator",
  admin: "Administrator",
};

const Sidebar = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const items = NAV_BY_ROLE[user?.role] || [];
  const initials = (user?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    if (onNavigate) onNavigate();
  };

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col border-r border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 h-screen sticky top-0">
      <div className="px-6 py-5 border-b border-ink-100 dark:border-ink-800 flex items-center gap-2.5">
        <SIMSLogo size={34} />
        <div>
          <p className="font-display text-lg font-semibold text-ink-800 dark:text-ink-50 leading-none">SIMS</p>
          <p className="text-[11px] text-ink-400 mt-0.5">Internship Registry</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const Icon = Icons[item.icon];
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 font-semibold"
                    : "text-ink-500 hover:bg-ink-50 hover:text-ink-800 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-100"
                }`
              }
            >
              <Icon />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-ink-100 dark:border-ink-800 space-y-3">
        <div className="flex items-center gap-3 rounded-xl bg-ink-50 dark:bg-ink-800/60 p-3">
          <div className="h-9 w-9 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink-800 dark:text-ink-100 truncate">{user?.name}</p>
            <p className="text-[11px] text-ink-400">{ROLE_LABEL[user?.role]}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-danger-50 hover:text-danger-600 dark:text-ink-400 dark:hover:bg-danger-900/20 dark:hover:text-danger-400 transition-all"
        >
          <Icons.logout />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

