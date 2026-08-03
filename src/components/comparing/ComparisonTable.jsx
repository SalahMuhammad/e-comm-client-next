"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { parseDate, formatDate, sameValue } from "./utils";
import { useTranslations } from "next-intl";

/* ============================================================================
   GENERIC: ComparisonTable
   ----------------------------------------------------------------------------
   Turns any set of selected records into a side-by-side diff table, tagging
   cells that changed vs. the previous column.

   Props
     columns    – ordered array of { record, tag } where tag is "selected" | "context"
     fields     – [{ key, label, accessor(record), render?(value, record), isList?, ignoreDiff? }]
     onRemove   – (record) => void (optional)
     getId      – (record) => unique id
     maxColumns – number (optional, e.g. 5)
   ============================================================================ */

function diffParts(prev = [], next = []) {
  const key = (p) => p._spare_part_name || String(p.spare_part);
  const prevMap = new Map(prev.map((p) => [key(p), p]));
  const nextMap = new Map(next.map((p) => [key(p), p]));
  const rows = [];
  Array.from(new Set([...prevMap.keys(), ...nextMap.keys()])).forEach((k) => {
    const p = prevMap.get(k);
    const n = nextMap.get(k);
    if (p && !n) rows.push({ name: k, kind: "removed", qty: p.quantity });
    else if (!p && n) rows.push({ name: k, kind: "added", qty: n.quantity });
    else if (p && n && String(p.quantity) !== String(n.quantity))
      rows.push({ name: k, kind: "changed", qty: n.quantity, prevQty: p.quantity });
    else if (p && n) rows.push({ name: k, kind: "same", qty: n.quantity });
  });
  return rows;
}

export function ComparisonTable({ columns, fields, onRemove, getId, maxColumns }) {
  const t = useTranslations("maintenance.report.table.table")

  // Cap columns if maxColumns is provided
  const visibleColumns = maxColumns ? columns.slice(0, maxColumns) : columns;

  return (
    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg snap-x snap-mandatory scroll-smooth touch-pan-x">
      <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300 border-collapse">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {/* Sticky top-left cell gets z-20 to stay above both row headers and column headers when scrolling */}
            <th
              scope="col"
              className="px-3 sm:px-4 py-3 sticky left-0 bg-gray-50 dark:bg-gray-700 z-20 min-w-[110px] sm:min-w-[140px] shadow-[1px_0_0_0_rgba(0,0,0,0.05)] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.05)]"
            >
              {t("field")}
            </th>
            {visibleColumns.map((col) => (
              <th
                key={getId(col.record)}
                scope="col"
                className="px-3 sm:px-4 py-3 min-w-[135px] sm:min-w-[160px] md:min-w-[180px] snap-start"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="normal-case">
                    <div className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">
                      {formatDate(parseDate(col.record.maintenance_date || col.record.date_in))}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-gray-400 font-normal">
                      {col.tag === "context" ? t("context") : t("selected")}
                    </div>
                  </div>
                  {col.tag === "selected" && onRemove && (
                    <button
                      onClick={() => onRemove(col.record)}
                      className="text-gray-400 hover:text-red-500 p-0.5 rounded"
                      title="Remove from comparison"
                    >
                      <XMarkIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => (
            <tr key={field.key} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
              {/* Sticky first column cell gets z-10 */}
              <th
                scope="row"
                className="px-3 sm:px-4 py-3 font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-800 z-10 whitespace-nowrap text-xs sm:text-sm shadow-[1px_0_0_0_rgba(0,0,0,0.05)] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.05)]"
              >
                {field.label}
              </th>
              {visibleColumns.map((col, i) => {
                const value = field.accessor(col.record);
                const prevValue = i > 0 ? field.accessor(visibleColumns[i - 1].record) : undefined;
                
                // Respect ignoreDiff property
                const changed = i > 0 && !field.isList && !field.ignoreDiff && !sameValue(value, prevValue);

                if (field.isList) {
                  const diffRows =
                    i === 0
                      ? (value || []).map((p) => ({
                          name: p._spare_part_name || p.spare_part,
                          kind: "same",
                          qty: p.quantity,
                        }))
                      : diffParts(prevValue, value);
                  return (
                    <td key={getId(col.record)} className="px-3 sm:px-4 py-3 align-top snap-start text-xs sm:text-sm">
                      {diffRows.length === 0 ? (
                        <span className="text-gray-400">—</span>
                      ) : (
                        <ul className="space-y-0.5">
                          {diffRows.map((d) => (
                            <li
                              key={d.name}
                              className={
                                d.kind === "added"
                                  ? "text-green-600 dark:text-green-400"
                                  : d.kind === "removed"
                                  ? "text-red-600 dark:text-red-400 line-through"
                                  : d.kind === "changed"
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-gray-600 dark:text-gray-300"
                              }
                            >
                              {d.kind === "added" && "+ "}
                              {d.kind === "removed" && "− "}
                              {d.name} × {d.qty}
                              {d.kind === "changed" && (
                                <span className="text-gray-400 line-through ml-1">{t("was", {status: d.prevQty})}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  );
                }

                return (
                  <td
                    key={getId(col.record)}
                    className={`px-3 sm:px-4 py-3 align-top snap-start text-xs sm:text-sm ${
                      changed ? "bg-amber-50 dark:bg-amber-900/20 border-l-2 border-amber-400" : ""
                    }`}
                  >
                    {field.render ? field.render(value, col.record) : value ?? <span className="text-gray-400">—</span>}
                    {changed && (
                      <span className="ml-1.5 inline-block text-[9px] sm:text-[10px] font-semibold uppercase text-amber-600 dark:text-amber-400 align-middle">
                        {t("changed")}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}