"use client";

import { useRef, useState, useCallback } from "react";

/* ============================================================================
   GENERIC: RangeSlider
   ----------------------------------------------------------------------------
   A custom draggable slider — filled track + thumb — used to replace the
   native <input type="range"> in TimelineChart. Native range inputs jump in
   steps and feel clunky to drag; this one tracks the pointer continuously
   and only animates (via CSS transition) when you're *not* actively
   dragging, so live dragging feels instant and letting go feels smooth.

   Props
     min, max   – numeric bounds
     value      – current value (integer)
     onChange   – (value) => void
     className  – optional extra classes on the track wrapper
   ============================================================================ */

export function RangeSlider({ min, max, value, onChange, className = "" }) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;

  const updateFromClientX = useCallback(
    (clientX) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const raw = min + ratio * (max - min);
      onChange(Math.round(raw));
    },
    [min, max, onChange]
  );

  function handlePointerDown(e) {
    e.preventDefault();
    setDragging(true);
    trackRef.current?.setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  }

  function handlePointerMove(e) {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  }

  function handlePointerUp(e) {
    setDragging(false);
    trackRef.current?.releasePointerCapture?.(e.pointerId);
  }

  return (
    <div
      ref={trackRef}
      className={`relative h-5 flex items-center select-none touch-none ${
        dragging ? "cursor-grabbing" : "cursor-pointer"
      } ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div className="absolute inset-x-0 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div
        className="absolute left-0 h-1.5 rounded-full bg-blue-600"
        style={{
          width: `${percent}%`,
          transition: dragging ? "none" : "width 150ms ease-out",
        }}
      />
      <div
        className="absolute w-4 h-4 rounded-full bg-blue-600 border-2 border-white dark:border-gray-900 shadow-md"
        style={{
          left: `calc(${percent}% - 8px)`,
          transition: dragging ? "none" : "left 150ms ease-out",
          transform: dragging ? "scale(1.15)" : "scale(1)",
        }}
      />
    </div>
  );
}
