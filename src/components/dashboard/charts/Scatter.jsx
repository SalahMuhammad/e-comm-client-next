"use client";
import { useMemo, useState, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------- small presentational slider (keeps UI only) ---------- */
const ModernRangeSlider = ({
  value,
  min,
  max,
  onChange,
  className = "",
  trackColor = "bg-indigo-500",
  showProgress = false,
  progressStart = 0,
  progressEnd = 100,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className={`relative ${className}`}>
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-auto">
        {showProgress ? (
          <div
            className="absolute h-full rounded-full transition-all duration-300"
            style={{
              left: `${progressStart}%`,
              width: `${progressEnd - progressStart}%`,
              background:
                "linear-gradient(90deg, rgba(99,102,241,1) 0%, rgba(79,70,229,1) 100%)",
            }}
          />
        ) : (
          <div
            className={`absolute h-full rounded-full transition-all duration-300 ${trackColor}`}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="range"
      />

      <div
        className="absolute top-1/2 w-4 h-4 md:w-6 md:h-6 bg-white border-2 md:border-4 border-indigo-500 rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 transition-all duration-200"
        style={{ left: `${percentage}%` }}
        aria-hidden
      />
    </div>
  );
};

/* ---------- logic helpers ---------- */
const expectedRefilledForUsed = (used) => used * 13;

// color: red -> yellow -> green based on ratio refilled/expected (clamped)
const colorFromRefillRatio = (refilled, used) => {
  const expected = expectedRefilledForUsed(used) || 1;
  const ratio = refilled / expected;
  const clamped = Math.max(0, Math.min(ratio, 1));
  const hue = Math.round(clamped * 120); // 0..120
  if (ratio >= 1) return `hsl(${120}, 65%, 37%)`;
  return `hsl(${hue}, 70%, 45%)`;
};

const markerRadiusFromUsed = (used) => {
  const base = 8;
  const growth = Math.floor(used / 10) * 4;
  return Math.max(base, base + growth);
};

/* ---------- tooltip + custom dot ---------- */
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  const expected = expectedRefilledForUsed(d.used);
  const ratio = d.refilled / (expected || 1);
  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
        <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{d.name}</p>
      </div>

      <div className="text-xs md:text-sm space-y-1 text-gray-600 dark:text-gray-300">
        <div>📅 {d.date.toLocaleDateString()}</div>
        <div>
          ↻ <span className="font-semibold text-blue-600">Refilled</span>: {d.refilled} (expected {expected})
        </div>
        <div>
          ↗ <span className="font-semibold" style={{ color: d.color }}>Used</span>: {d.used}
          {d.used_name && <span className="ml-1 text-gray-500">({d.used_name})</span>}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Rate: {d.refilled > 0 ? ((d.used / d.refilled) * 100).toFixed(1) + "%" : "—"}
        </div>
        <div className="text-xs">
          Status: {" "}
          <span className="font-semibold" style={{ color: d.color }}>
            {ratio >= 1 ? "Good" : "Low refill"}
          </span>
        </div>
        {d.notes && d.notes.length > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 italic">
            📝 {d.notes}
          </div>
        )}
      </div>
    </div>
  );
};

const CustomDot = ({ cx, cy, payload }) => {
  const r = markerRadiusFromUsed(payload.used);
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={payload.color}
        stroke="#ffffff"
        strokeWidth={2}
        style={{ filter: "drop-shadow(0 1px 6px rgba(0,0,0,0.15))", transition: "all 300ms" }}
      />
      <circle cx={cx} cy={cy} r={Math.max(2, r * 0.25)} fill="white" opacity={0.8} />
    </g>
  );
};

/* ---------- main component ---------- */
// new props added: maxWidth, maxHeight, compact, initialCollapsed
const ScatterChartView = ({
  data = {},
  className = "",
  compact = false,
  initialCollapsed = true,
  viewLast = 20
}) => {
  // timeline state as percentages over date range
  const [timeStart, setTimeStart] = useState(0);
  const [timeWindowSize, setTimeWindowSize] = useState(100);
  const [viewMode, setViewMode] = useState("all"); // all / high / low
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [animationEnabled] = useState(true);

  // sorted by date ascending
  const sortedData = useMemo(
    () => {
      if(data.length === 0) {
        return [];
      }
      return [...data].sort((a, b) => a.date.getTime() - b.date.getTime());
    },
    [data]
  );

  const dateRange = useMemo(() => {
    if (!sortedData.length) return { min: 0, max: 0 };
    const dates = sortedData.map((d) => d.date.getTime());
    return { min: Math.min(...dates), max: Math.max(...dates) };
  }, [sortedData]);

  // on mount (or when data changes) set default to last 20 points
  useEffect(() => {
    const N = viewLast;
    if (!sortedData.length || dateRange.max === dateRange.min) {
      setTimeStart(0);
      setTimeWindowSize(100);
      return;
    }
    if (sortedData.length <= N) {
      setTimeStart(0);
      setTimeWindowSize(100);
      return;
    }
    // compute timestamps for last N points
    const startIdx = Math.max(0, sortedData.length - N);
    const startTs = sortedData[startIdx].date.getTime();
    const endTs = sortedData[sortedData.length - 1].date.getTime();
    const totalSpan = dateRange.max - dateRange.min;
    const startPercent = ((startTs - dateRange.min) / totalSpan) * 100;
    const endPercent = ((endTs - dateRange.min) / totalSpan) * 100;
    const windowSize = Math.max(10, endPercent - startPercent);
    setTimeStart(Math.max(0, startPercent));
    setTimeWindowSize(Math.min(100, windowSize));
  }, [sortedData, dateRange]);

  // compute filtered data based on timeline and viewMode
  const filteredByTime = useMemo(() => {
    if (!sortedData.length || dateRange.max === dateRange.min) return sortedData;
    const totalSpan = dateRange.max - dateRange.min;
    const startTs = dateRange.min + (totalSpan * timeStart) / 100;
    const endTs = dateRange.min + (totalSpan * (timeStart + timeWindowSize)) / 100;
    return sortedData.filter((it) => {
      const ts = it.date.getTime();
      return ts >= startTs && ts <= endTs;
    });
  }, [sortedData, dateRange, timeStart, timeWindowSize]);

  const filteredData = useMemo(() => {
    if (viewMode === "high") {
      // "High" = points where refilled < expected (problematic)
      return filteredByTime.filter((it) => it.refilled < expectedRefilledForUsed(it.used));
    } else if (viewMode === "low") {
      // "Low" = points where refilled >= expected (good)
      return filteredByTime.filter((it) => it.refilled >= expectedRefilledForUsed(it.used));
    }
    return filteredByTime;
  }, [filteredByTime, viewMode]);

  // build chart data
  const chartData = useMemo(
    () =>
      filteredData.map((item) => {
        const color = colorFromRefillRatio(item.refilled, item.used);
        return {
          x: item.date.getTime(),
          y: item.refilled,
          z: markerRadiusFromUsed(item.used),
          used: item.used,
          name: item.name,
          used_name: item.used_name,
          notes: item.notes,
          color,
          date: item.date,
          refilled: item.refilled,
        };
      }),
    [filteredData]
  );

  // totals for stats
  const totalUsed = filteredData.reduce((s, d) => s + d.used, 0);
  const totalRefilled = filteredData.reduce((s, d) => s + d.refilled, 0);
  const avgUsageRate = totalRefilled > 0 ? (totalUsed / totalRefilled) * 100 : 0;

  // handlers
  const handleTimeStartChange = (e) => setTimeStart(Number(e.target.value));
  const handleWindowSizeChange = (e) => {
    const val = Number(e.target.value);
    const clamped = Math.max(10, Math.min(100, val));
    setTimeWindowSize(clamped);
    setTimeStart((s) => Math.min(s, 100 - clamped));
  };

  // compact variants (smaller paddings/heights)
  const chartHeightClass = compact ? "h-56 sm:h-64 md:h-72" : "h-72 sm:h-80 md:h-96 lg:h-[420px]";
  const cardPadding = compact ? "p-3 md:p-4" : "p-4 md:p-6";
  const statPadding = compact ? "p-2" : "p-3 md:p-6";

  return (
    <div
      className={`rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-auto ${className}`}
    >
      <div className={`${cardPadding} border-b border-gray-200 dark:border-gray-700 flex items-start justify-between gap-4`}>
        <div className="min-w-0 flex-1">
          <h2 className="text-md font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
            Resource Analytics
          </h2>
        </div>

        {/* view mode buttons now visible on all sizes */}
        <div className="flex items-center gap-2">
          {[
            { key: "all", label: "All" },
            { key: "high", label: "High" },
            { key: "low", label: "Good" },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setViewMode(m.key)}
              className={`px-3 py-1 rounded text-xs font-medium ${viewMode === m.key ? "bg-white dark:bg-gray-600 shadow text-blue-600" : "text-gray-500 dark:text-gray-300"}`}
            >
              {m.label}
            </button>
          ))}

          <button
            onClick={() => setIsCollapsed((s) => !s)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-2"
            aria-label="toggle"
          >
            <svg className={`w-5 h-5 transform transition-transform ${isCollapsed ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* chart */}
      <div className={`${cardPadding}`}>
        <div className={`w-full ${chartHeightClass} bg-transparent rounded-md`}> 
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="2 2" stroke="#e5e7eb" />
              <XAxis
                type="number"
                dataKey="x"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(t) =>
                  new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
                angle={-30}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={{ stroke: "#d1d5db", strokeWidth: 1 }}
                tickLine={{ stroke: "#d1d5db" }}
              />
              <YAxis
                type="number"
                dataKey="y"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={{ stroke: "#d1d5db", strokeWidth: 1 }}
                tickLine={{ stroke: "#d1d5db" }}
                label={{
                  value: "Refilled",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle", fill: "#6b7280", fontSize: "13px", fontWeight: "600" },
                }}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter data={chartData} shape={<CustomDot />} isAnimationActive={animationEnabled} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* timeline controls */}
          <div className={`${cardPadding} md:px-6 md:pb-6`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Timeline</span>
              <span className="text-xs text-gray-500">{Math.round(timeWindowSize)}% window</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>Start: {Math.round(timeStart)}%</span>
                  <span>End: {Math.round(timeStart + timeWindowSize)}%</span>
                </div>
                <ModernRangeSlider
                  value={timeStart}
                  min={0}
                  max={100 - timeWindowSize}
                  onChange={handleTimeStartChange}
                  showProgress={true}
                  progressStart={timeStart}
                  progressEnd={timeStart + timeWindowSize}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Window Size</span>
                  <span className="text-xs text-gray-500">{Math.round(timeWindowSize)}%</span>
                </div>
                <ModernRangeSlider
                  value={timeWindowSize}
                  min={10}
                  max={100}
                  onChange={handleWindowSizeChange}
                  trackColor="bg-indigo-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>10%</span>
                  <span>{Math.round(timeWindowSize)}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* stats */}
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 ${statPadding} pt-0`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-xs text-gray-500 mb-1">Points</div>
              <div className="text-xl md:text-2xl font-bold">{filteredData.length}</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-xs text-gray-500 mb-1">Refilled</div>
              <div className="text-xl md:text-2xl font-bold text-green-600">{totalRefilled}</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-xs text-gray-500 mb-1">Used</div>
              <div className="text-xl md:text-2xl font-bold text-red-600">{totalUsed}</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-xs text-gray-500 mb-1">Rate</div>
              <div className="text-xl md:text-2xl font-bold text-purple-600">{avgUsageRate.toFixed(1)}%</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ScatterChartView;
