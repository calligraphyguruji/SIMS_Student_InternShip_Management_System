import React from "react";

export const Loader = ({ label = "Loading" }) => (
  <div className="flex items-center justify-center py-16 text-ink-400 dark:text-ink-500">
    <div className="flex items-center gap-3">
      <span className="h-5 w-5 rounded-full border-2 border-ink-200 border-t-primary-600 dark:border-ink-700 dark:border-t-primary-400 animate-spin" />
      <span className="text-sm">{label}...</span>
    </div>
  </div>
);

export const EmptyState = ({ title, description, action }) => (
  <div className="card flex flex-col items-center justify-center gap-2 py-16 text-center px-6">
    <p className="font-display text-lg text-ink-700 dark:text-ink-200">{title}</p>
    {description && <p className="text-sm text-ink-400 max-w-sm">{description}</p>}
    {action && <div className="mt-3">{action}</div>}
  </div>
);

export const ErrorBanner = ({ message }) => {
  if (!message) return null;
  return (
    <div className="rounded-md border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900/40 text-red-700 dark:text-red-200 text-sm px-4 py-3">
      {message}
    </div>
  );
};
