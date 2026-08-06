import React from "react";

// A stat card with label, value, and accent color.
const StatCard = ({ index, label, value, accent = "ink" }) => {
  const accentClasses = {
    ink: "text-ink-800 dark:text-ink-100",
    primary: "text-primary-600 dark:text-primary-400",
    success: "text-success-600 dark:text-success-400",
    warning: "text-warning-600 dark:text-warning-400",
    danger: "text-danger-600 dark:text-danger-400",
  };

  return (
    <div className="card p-5 relative overflow-hidden card-hover">
      <span className="absolute top-3 right-4 font-mono text-[11px] text-ink-300 dark:text-ink-700">
        {String(index).padStart(2, "0")}
      </span>
      <p className="label">{label}</p>
      <p className={`font-mono text-3xl font-medium mt-1 ${accentClasses[accent]}`}>{value}</p>
    </div>
  );
};

export default StatCard;

