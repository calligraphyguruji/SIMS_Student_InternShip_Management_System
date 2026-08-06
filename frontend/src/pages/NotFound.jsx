import React from "react";
import { Link } from "../router.jsx";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-ink-50 dark:bg-ink-950 text-center px-4">
    <p className="font-mono text-xs uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3">Error 404</p>
    <h1 className="font-display text-3xl font-semibold text-ink-800 dark:text-ink-50">Page not found</h1>
    <p className="text-ink-400 mt-2 max-w-sm">
      The page you're looking for doesn't exist, or you don't have access to it.
    </p>
    <Link to="/" className="btn-primary mt-6">
      Back to home
    </Link>
  </div>
);

export default NotFound;
