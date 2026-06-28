// ─── Status config ─────────────────────────────────────────────────────────────
export const STATUS_CONFIG = {
    pending: {
        label: 'Pending',
        dot: 'bg-amber-400',
        badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    },
    in_progress: {
        label: 'In Progress',
        dot: 'bg-blue-500',
        badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    },
    completed: {
        label: 'Completed',
        dot: 'bg-green-500',
        badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
    },
    cancelled: {
        label: 'Cancelled',
        dot: 'bg-red-500',
        badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700',
    },
};

// ─── StatusBadge ───────────────────────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
};
