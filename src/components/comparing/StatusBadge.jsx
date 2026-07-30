"use client";

import { useTranslations } from "next-intl";

// 1. Custom hook for default translated status styles
export function useDefaultStatusStyles() {
  // Use "report.table.status" (or "maintenance.report.table.status" depending on your JSON file structure)
  const t = useTranslations("maintenance.report.table.status");

  return {
    mcomplete: {
      label: t("completed"),
      color: "#16a34a",
      badge: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400",
    },
    pending: {
      label: t("pending"),
      color: "#d97706",
      badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400",
    },
    in_progress: {
      label: t("inProgress"), // 👈 Fixed: matches "inProgress" in your JSON
      color: "#2563eb",
      badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400",
    },
    cancelled: {
      label: t("cancelled"),
      color: "#dc2626",
      badge: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400",
    },
  };
}

// 2. Pure helper function to get metadata out of a resolved styles object
export function statusMeta(status, styles = {}) {
  return (
    styles[status] || {
      label: status || "Unknown",
      color: "#6b7280",
      badge: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    }
  );
}

// 3. Badge Component
export function StatusBadge({ status, customStyles }) {
  const defaultStyles = useDefaultStatusStyles();
  const styles = customStyles || defaultStyles;
  const meta = statusMeta(status, styles);

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${meta.badge}`}>
      {meta.label}
    </span>
  );
}