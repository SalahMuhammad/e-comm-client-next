"use client";

import { useState, useMemo } from "react";
import { ArrowsRightLeftIcon, TrashIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { parseDate, formatDate } from "@/components/comparing/utils";
import { StatusBadge, statusMeta } from "@/components/comparing/StatusBadge";
import { TimelineChart } from "@/components/comparing/TimelineChart";
import { ComparisonTable } from "@/components/comparing/ComparisonTable";
import { useTranslations } from "next-intl";

export default function MaintenanceComparisonDashboard({
  data = [],
}) {
  const t = useTranslations("maintenance.report.table");
  // const defaultStatusStyles = useDefaultStatusStyles();
  const statusStyles = {
    mcomplete: {
      label: t("status.completed"),
      color: "#10b981", // Emerald Green
      badge: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
    },
    maintained: {
      label: t("status.maintained"),
      color: "#0284c7",
      badge: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/20",
    },
    pending: {
      label: t("status.pending"),
      color: "#f59e0b", // Warm Amber
      badge: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/20",
    },
    rejected: {
      label: t("status.rejected"),
      color: "#e11d48", // Rose Red
      badge: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20",
    },
  };
  // const statusStyles = customStatusStyles || defaultStatusStyles;
  const results = data?.data?.results ?? [];
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [allowUnlimited, setAllowUnlimited] = useState(false);
  
  // 1. Status Filter State (null = show all statuses)
  const [activeStatusFilter, setActiveStatusFilter] = useState(null);

  const sortedByDate = useMemo(() => {
    return [...results].sort((a, b) => {
      const da = parseDate(a.maintenance_date || a.date_in) ?? 0;
      const db = parseDate(b.maintenance_date || b.date_in) ?? 0;
      return da - db;
    });
  }, [results]);

  // 2. Filter records based on selected status filter
  const filteredRecords = useMemo(() => {
    if (!activeStatusFilter) return sortedByDate;
    return sortedByDate.filter((r) => r.status === activeStatusFilter);
  }, [sortedByDate, activeStatusFilter]);

  function toggle(record) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(record._hashed_id)) {
        next.delete(record._hashed_id);
      } else {
        if (!allowUnlimited && next.size >= 5) return prev;
        next.add(record._hashed_id);
      }
      return next;
    });
  }

  function remove(record) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(record._hashed_id);
      return next;
    });
  }

  function clearAll() {
    setSelectedIds(new Set());
  }

  const selectedRecords = sortedByDate.filter((r) => selectedIds.has(r._hashed_id));

  const columns = selectedRecords.map((r) => ({
    record: r,
    tag: "selected",
  }));

  // Passing customStatusStyles down to StatusBadge in render
  const fields = [
    { key: "client", label: t("fields.client"), accessor: (r) => r._client_name, ignoreDiff: true },
    { key: "item", label: "Item", accessor: (r) => r._item_name, ignoreDiff: true },
    { key: "status", label: "Status", accessor: (r) => r.status, render: (v) => <StatusBadge status={v} customStyles={statusStyles} /> },
    { key: "date_in", label: t("fields.dateIn"), accessor: (r) => (r.date_in ? formatDate(parseDate(r.date_in)) : null) },
    { key: "maintenance_date", label: t("fields.maintenanceDate"), accessor: (r) => (r.maintenance_date ? formatDate(parseDate(r.maintenance_date)) : null) },
    { key: "date_out", label: t("fields.dateOut"), accessor: (r) => (r.date_out ? formatDate(parseDate(r.date_out)) : null) },
    { key: "maintained_by", label: t("fields.maintainedBy"), accessor: (r) => r._maintained_by_name?.trim() || null },
    { key: "malfunctions", label: t("fields.malfunctions"), accessor: (r) => r.malfunctions },
    { key: "notes", label: t("fields.notes"), accessor: (r) => r.notes, ignoreDiff: true },
    { key: "parts", label: t("fields.parts"), accessor: (r) => r.parts, isList: true },
  ];

  const firstRecord = sortedByDate[0];
  const availableStatuses = Object.keys(statusStyles);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Maintenance history</h2>
          {firstRecord && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("serial")} <span className="font-mono"><b>{firstRecord.serial_number}</b></span> · {/* {firstRecord._client_name} */}
            </p>
          )}
        </div>

        {/* Timeline Chart Container */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          
          {/* Status Filter Interactive Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
              <FunnelIcon className="w-3.5 h-3.5" />
              {t("filter")}
            </div>
            
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveStatusFilter(null)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeStatusFilter === null
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {t("all")} ({sortedByDate.length})
              </button>

              {availableStatuses.map((stKey) => {
                const meta = statusMeta(stKey, statusStyles);
                const count = sortedByDate.filter((r) => r.status === stKey).length;
                const isActive = activeStatusFilter === stKey;

                return (
                  <button
                    key={stKey}
                    onClick={() => setActiveStatusFilter(isActive ? null : stKey)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? "ring-2 ring-offset-1 ring-blue-500 shadow-sm"
                        : "opacity-75 hover:opacity-100"
                    } ${meta.badge}`}
                  >
                    {meta.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Render Timeline with Filtered Records */}
          <TimelineChart
            records={filteredRecords}
            getId={(r) => r._hashed_id}
            getDate={(r) => r.maintenance_date || r.date_in}
            getValue={(r) => r.parts?.length ?? 0}
            getStatus={(r) => r.status}
            customStatusStyles={statusStyles}
            valueLabel="Parts replaced"
            selectedIds={selectedIds}
            onToggle={toggle}
            renderSummary={(r) => [
              { label: t("fields.item"), value: r._item_name },
              { label: t("fields.status"), value: statusMeta(r.status, statusStyles).label },
              { label: t("fields.dateIn"), value: r.date_in ? formatDate(parseDate(r.date_in)) : "—" },
              { label: t("status.maintained"), value: r.maintenance_date ? formatDate(parseDate(r.maintenance_date)) : "—" },
              { label: t("fields.dateOut"), value: r.date_out ? formatDate(parseDate(r.date_out)) : "—" },
              { label: t("fields.maintainedBy"), value: r._maintained_by_name?.trim() || "—" },
              { label: t("fields.replacedParts"), value: r.parts?.length ?? 0 },
            ]}
          />

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 flex items-center gap-1">
            <ArrowsRightLeftIcon className="w-3.5 h-3.5" />
            {t('timeLineChart.status')} {allowUnlimited ? `(${t('timeLineChart.unlimited')})` : `(${t("timeLineChart.upTo", {num: 5})})`}
          </p>
        </div>

        {/* Comparison Table Section */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Comparison {selectedRecords.length > 0 && `(${selectedRecords.length})`}
            </h3>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allowUnlimited}
                  onChange={(e) => setAllowUnlimited(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                {t("table.unlimited")}
              </label>

              {selectedRecords.length > 0 && (
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                  {t("table.clear")}
                </button>
              )}
            </div>
          </div>

          {columns.length === 0 ? (
            <div className="text-sm text-gray-400 dark:text-gray-500 text-center py-8 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              {t("table.des")}
            </div>
          ) : (
            <ComparisonTable
              columns={columns}
              fields={fields}
              onRemove={remove}
              getId={(r) => r._hashed_id}
              maxColumns={allowUnlimited ? undefined : 5}
            />
          )}
        </div>
      </div>
    </div>
  );
}