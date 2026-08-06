import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "../../router.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import SIMSLogo from "../ui/SIMSLogo.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem("sims_theme") === "dark");
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("sims_theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const onClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials = (user?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const notifications = [
    { id: 1, title: "2 new internships posted", desc: "Frontend & Data roles match your skills", time: "Just now", to: "/internships" },
    { id: 2, title: "Interview scheduled", desc: "TechCorp Solutions · Frontend Developer Intern", time: "Tomorrow, 10:00 AM", to: "/my-applications" },
    { id: 3, title: "Resume viewed", desc: "Your resume was viewed by TechCorp HR", time: "Yesterday", to: "/profile" },
  ];

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-100 dark:border-ink-800 bg-white/90 dark:bg-ink-900/90 backdrop-blur px-4 md:px-8 py-3">
      <div className="md:hidden">
        <Link to="/dashboard">
          <SIMSLogo size={28} withText textClassName="text-base" />
        </Link>
      </div>
      <div className="hidden md:block" />

      <div className="flex items-center gap-2 md:gap-3">
        {/* Dark mode toggle */}
        <button
          onClick={() => setDark((d) => !d)}
          className="btn-icon"
          aria-label="Toggle dark mode"
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? (
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          ) : (
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          )}
        </button>

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen((o) => !o);
              setUserOpen(false);
            }}
            className="btn-icon relative"
            aria-label="Notifications"
          >
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white dark:ring-ink-900" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-cardHover overflow-hidden z-20">
              <div className="px-4 py-3 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between">
                <p className="text-sm font-semibold">Notifications</p>
                <Link to="/notifications" className="text-xs text-primary-600 hover:underline" onClick={() => setNotifOpen(false)}>
                  View all
                </Link>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-ink-100 dark:divide-ink-800">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    to={n.to}
                    onClick={() => setNotifOpen(false)}
                    className="block px-4 py-3 hover:bg-ink-50 dark:hover:bg-ink-800/60 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-primary-500 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-ink-400 mt-0.5">{n.desc}</p>
                        <p className="text-[11px] text-ink-300 dark:text-ink-500 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User avatar dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => {
              setUserOpen((o) => !o);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 rounded-full hover:opacity-80 transition-opacity"
            aria-label="Account menu"
          >
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 text-white flex items-center justify-center text-xs font-semibold">
              {initials}
            </div>
          </button>

          {userOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-cardHover overflow-hidden z-20">
              <div className="px-4 py-3 border-b border-ink-100 dark:border-ink-800">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-ink-400 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link to="/profile" onClick={() => setUserOpen(false)} className="block px-4 py-2 text-sm text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors">
                  My Profile
                </Link>
                <Link to="/profile" onClick={() => setUserOpen(false)} className="block px-4 py-2 text-sm text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors">
                  Settings
                </Link>
              </div>
              <div className="border-t border-ink-100 dark:border-ink-800 py-1">
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-900/20 transition-colors">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

