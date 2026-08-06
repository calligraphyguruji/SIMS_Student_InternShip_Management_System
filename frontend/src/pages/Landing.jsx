import React from "react";
import { Link } from "../router.jsx";
import SIMSLogo from "../components/ui/SIMSLogo.jsx";

const FEATURES = [
  { n: "01", title: "One registry, five roles", body: "Students, faculty mentors, coordinators, company HR and admins each get a dashboard scoped to what they need to act on." },
  { n: "02", title: "A visible approval trail", body: "Every application carries a timestamped history — submitted, mentor-reviewed, shortlisted, decided — so nothing is settled off the record." },
  { n: "03", title: "Mentor accountability built in", body: "Faculty mentors are attached to students directly, and their sign-off is a distinct step in the workflow, not a comment thread." },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-ink-50">
      <header className="border-b border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <SIMSLogo size={32} withText textClassName="text-lg" />
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-outline text-sm">Log in</Link>
            <Link to="/register" className="btn-primary text-sm">Register</Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-4">Internship Registry — Est. for this cohort</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight">
            Every internship, mentor sign-off, and offer letter — in <span className="gradient-text">one ledger</span>.
          </h1>
          <p className="mt-5 text-ink-500 dark:text-ink-300 text-base leading-relaxed max-w-lg">
            SIMS replaces the spreadsheet-and-email shuffle between students, faculty mentors and company HR
            with a single system of record for the whole internship cycle.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/register" className="btn-primary">Get started</Link>
            <Link to="/login" className="btn-secondary">I already have an account</Link>
          </div>
        </div>
        <div className="card p-8 card-hover">
          <p className="label mb-4">This term, at a glance</p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="font-mono text-4xl font-semibold text-primary-600 dark:text-primary-400">05</p>
              <p className="text-xs text-ink-400 mt-1">Role types</p>
            </div>
            <div>
              <p className="font-mono text-4xl font-semibold text-primary-600 dark:text-primary-400">∞</p>
              <p className="text-xs text-ink-400 mt-1">Internships tracked</p>
            </div>
            <div>
              <p className="font-mono text-4xl font-semibold text-success-600">7</p>
              <p className="text-xs text-ink-400 mt-1">Application stages</p>
            </div>
            <div>
              <p className="font-mono text-4xl font-semibold text-ink-800 dark:text-ink-100">1</p>
              <p className="text-xs text-ink-400 mt-1">Source of truth</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-ink-100 dark:border-ink-800">
        <h2 className="font-display text-2xl font-semibold mb-10">How it's built</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div key={f.n} className="card p-6 card-hover">
              <p className="font-mono text-xs text-primary-600 dark:text-primary-400 mb-2">{f.n}</p>
              <h3 className="font-display text-lg font-medium mb-2">{f.title}</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-ink-100 dark:border-ink-800 py-8">
        <div className="max-w-6xl mx-auto px-6 text-xs text-ink-400 flex justify-between">
          <span>Student Internship Management System</span>
          <span>Built as an academic project</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
