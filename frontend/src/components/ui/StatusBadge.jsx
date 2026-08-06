import React from "react";

const STYLES = {
  pending: "bg-warning-50 text-warning-700 dark:bg-warning-900/30 dark:text-warning-200",
  shortlisted: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-200",
  interview_scheduled: "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200",
  approved: "bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-200",
  offer_received: "bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-200",
  completed: "bg-ink-800 text-white dark:bg-ink-100 dark:text-ink-900",
  rejected: "bg-danger-50 text-danger-700 dark:bg-danger-900/30 dark:text-danger-200",
  open: "bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-200",
  closed: "bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400",
};

const LABELS = {
  pending: "Pending",
  shortlisted: "Shortlisted",
  interview_scheduled: "Interview Scheduled",
  approved: "Approved",
  rejected: "Rejected",
  offer_received: "Offer Received",
  completed: "Completed",
  open: "Open",
  closed: "Closed",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
      STYLES[status] || STYLES.pending
    }`}
  >
    {LABELS[status] || status}
  </span>
);

export default StatusBadge;

