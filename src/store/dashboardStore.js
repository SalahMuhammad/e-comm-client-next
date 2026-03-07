import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WIDGET_REGISTRY } from '@/app/[locale]/(protected)/dashboard/_widgets/configs';

// Re-export so DashboardGridClient can import from one place
export { WIDGET_REGISTRY };

function buildDefaultLayout() {
    const COLS = 12;
    let cursorX = 0;
    let cursorY = 0;
    let rowH = 0; // tallest widget in the current row

    return Object.values(WIDGET_REGISTRY).map(reg => {
        const w = reg.defaultW;
        const h = reg.defaultH;

        // Wrap to next row if widget doesn't fit
        if (cursorX + w > COLS) {
            cursorY += rowH;
            cursorX = 0;
            rowH = 0;
        }

        const item = {
            i: reg.id,
            x: cursorX, y: cursorY,
            w, h,
            minW: reg.minW, minH: reg.minH,
            maxW: reg.maxW, maxH: reg.maxH,
        };

        cursorX += w;
        rowH = Math.max(rowH, h);
        return item;
    });
}

const DEFAULT_LAYOUT = buildDefaultLayout();
const DEFAULT_ACTIVE = Object.keys(WIDGET_REGISTRY);

export const useDashboardStore = create(
    persist(
        (set, get) => ({
            isCustomizing: false,
            activeWidgets: DEFAULT_ACTIVE,
            layout: DEFAULT_LAYOUT,

            toggleCustomization: () => set((state) => ({ isCustomizing: !state.isCustomizing })),

            addWidget: (widgetId) => set((state) => {
                if (state.activeWidgets.includes(widgetId)) return state;
                const reg = WIDGET_REGISTRY[widgetId] || {};
                return {
                    activeWidgets: [...state.activeWidgets, widgetId],
                    layout: [...state.layout, {
                        i: widgetId,
                        x: 0, y: Infinity,
                        w: reg.defaultW ?? 4, h: reg.defaultH ?? 4,
                        minW: reg.minW ?? 3, minH: reg.minH ?? 3,
                        maxW: reg.maxW ?? 12, maxH: reg.maxH ?? 8,
                    }],
                };
            }),

            removeWidget: (widgetId) => set((state) => ({
                activeWidgets: state.activeWidgets.filter(id => id !== widgetId),
                layout: state.layout.filter(item => item.i !== widgetId),
            })),

            updateLayout: (newLayout) => set({ layout: newLayout }),

            resetLayout: () => set({
                activeWidgets: DEFAULT_ACTIVE,
                layout: DEFAULT_LAYOUT,
            }),
        }),
        {
            name: 'dashboard-layout-storage',
            partialize: (state) => ({
                layout: state.layout,
                activeWidgets: state.activeWidgets,
            }),
        }
    )
);
