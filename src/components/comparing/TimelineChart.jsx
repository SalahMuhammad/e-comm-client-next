"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { WrenchIcon } from "@heroicons/react/24/outline";
import { parseDate, formatDate, useIsDark } from "./utils";
import { statusMeta } from "./StatusBadge";
import { RangeSlider } from "./RangeSlider";

/* ============================================================================
   GENERIC: TimelineChart
   ----------------------------------------------------------------------------
   A scatter timeline with a built-in "show N of M" range slider + click-to-
   select dots + hover tooltip. Feed it any array + accessor functions.

   Props
     records       – array of source records (any shape)
     getId(r)      – unique id for a record
     getDate(r)    – date string/ms used for the x-axis
     getValue(r)   – number used for the y-axis
     getStatus(r)  – optional, drives dot color + a small legend
     valueLabel    – y-axis label
     renderSummary(r) – (record) => [{ label, value }] shown on hover
     selectedIds   – Set of currently-selected ids
     onToggle(r)   – called when a dot is clicked
     title         – optional heading above the chart

   To reuse for something else (e.g. comparing invoices, comparing
   inspection reports), import this component unchanged and pass new
   accessor functions.
   ============================================================================ */

export function TimelineChart({
  records,
  getId,
  getDate,
  getValue,
  getStatus,
  customStatusStyles,
  valueLabel = "Value",
  renderSummary,
  selectedIds,
  onToggle,
  title,
}) {
  const isDark = useIsDark();
  const gridColor = isDark ? "#374151" : "#e5e7eb";
  const axisColor = isDark ? "#9ca3af" : "#6b7280";
  const tooltipBg = isDark ? "#1f2937" : "#ffffff";
  const tooltipBorder = isDark ? "#374151" : "#e5e7eb";
  const tooltipText = isDark ? "#f9fafb" : "#111827";

  // Allow windowSize to be a number or "all"
  const [windowSize, setWindowSize] = useState(15);

  const sorted = useMemo(() => {
    return [...records]
      .map((r) => ({ record: r, ts: parseDate(getDate(r)) }))
      .filter((r) => r.ts !== null)
      .sort((a, b) => a.ts - b.ts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records]);

  // Determine active display size
  const activeWindowSize = windowSize === "all" ? sorted.length : Number(windowSize);

  const [startIndex, setStartIndex] = useState(() =>
    Math.max(0, sorted.length - activeWindowSize)
  );

  useEffect(() => {
    setStartIndex((s) => Math.min(s, Math.max(0, sorted.length - activeWindowSize)));
  }, [activeWindowSize, sorted.length]);

  const maxStart = Math.max(0, sorted.length - activeWindowSize);
  const isWindowed = sorted.length > activeWindowSize;
  const visible = isWindowed
    ? sorted.slice(startIndex, startIndex + activeWindowSize)
    : sorted;
  const step = Math.max(1, Math.floor(activeWindowSize / 2));

  const chartData = visible.map(({ record, ts }) => ({
    x: ts,
    y: getValue(record),
    record,
  }));

  const statusesPresent = getStatus
    ? Array.from(new Set(sorted.map((s) => getStatus(s.record))))
    : [];

  function CustomDot(props) {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null) return null;
    const id = getId(payload.record);
    const isSelected = selectedIds?.has(id);
    const color = getStatus ? statusMeta(getStatus(payload.record), customStatusStyles).color : "#2563eb"; return (
      <g
        style={{ cursor: onToggle ? "pointer" : "default" }}
        onClick={() => onToggle?.(payload.record)}
      >
        {isSelected && <circle cx={cx} cy={cy} r={11} fill={color} opacity={0.2} />}
        <circle
          cx={cx}
          cy={cy}
          r={isSelected ? 7 : 5.5}
          fill={color}
          stroke={isSelected ? color : isDark ? "#111827" : "#ffffff"}
          strokeWidth={isSelected ? 2 : 1.5}
        />
      </g>
    );
  }

  function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const record = payload[0].payload.record;
    const rows = renderSummary ? renderSummary(record) : [];
    return (
      <div
        className="rounded-md border px-3 py-2 shadow-lg text-xs"
        style={{
          background: tooltipBg,
          borderColor: tooltipBorder,
          color: tooltipText,
          minWidth: 190,
        }}
      >
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 py-0.5">
            <span className="opacity-60">{row.label}</span>
            <span className="font-medium text-right">{row.value ?? "—"}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <div className="flex items-center gap-2 mb-3">
          <WrenchIcon className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="text-sm text-gray-400 dark:text-gray-500 text-center py-10 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
          No records to display
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                type="number"
                dataKey="x"
                domain={["dataMin", "dataMax"]}
                tickFormatter={formatDate}
                stroke={axisColor}
                tick={{ fill: axisColor, fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                allowDecimals={false}
                stroke={axisColor}
                tick={{ fill: axisColor, fontSize: 11 }}
                width={36}
                label={{
                  value: valueLabel,
                  angle: -90,
                  position: "insideLeft",
                  fill: axisColor,
                  fontSize: 11,
                }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ strokeDasharray: "3 3", stroke: axisColor }}
              />
              <Scatter data={chartData} shape={CustomDot} isAnimationActive={false} />
            </ScatterChart>
          </ResponsiveContainer>

          {/* Controls section remains rendered whenever records exist */}
          <div className="flex items-center gap-3 mt-1 px-1">
            {isWindowed ? (
              <>
                <button
                  type="button"
                  onClick={() => setStartIndex((s) => Math.max(0, s - step))}
                  disabled={startIndex === 0}
                  className="p-1 rounded border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>

                <RangeSlider
                  min={0}
                  max={maxStart}
                  value={startIndex}
                  onChange={setStartIndex}
                  className="flex-1"
                />

                <button
                  type="button"
                  onClick={() => setStartIndex((s) => Math.min(maxStart, s + step))}
                  disabled={startIndex >= maxStart}
                  className="p-1 rounded border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </>
            ) : (
              /* Spacer to push select & label to the right when full chart is showing */
              <div className="flex-1" />
            )}

            <select
              value={windowSize}
              onChange={(e) => {
                const val = e.target.value;
                setWindowSize(val === "all" ? "all" : Number(val));
              }}
              className="text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-1.5 py-1"
            >
              {[10, 15, 20, 30].map((n) => (
                <option key={n} value={n}>
                  {n} pts
                </option>
              ))}
              <option value="all">All</option>
            </select>

            <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
              {isWindowed
                ? `${startIndex + 1}–${Math.min(
                  startIndex + activeWindowSize,
                  sorted.length
                )} of ${sorted.length}`
                : `Showing all ${sorted.length}`}
            </span>
          </div>

          {statusesPresent.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3 px-1">

              {statusesPresent.map((s) => {
                const meta = statusMeta(s, customStatusStyles);
                return (
                  <span
                    key={s}
                    className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ background: meta.color }}
                    />
                    {meta.label}
                  </span>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}