'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useDashboardStore, WIDGET_REGISTRY } from '@/store/dashboardStore';
import { useTranslations } from 'next-intl';
import {
    PlusIcon,
    XMarkIcon,
    CheckIcon,
    Cog6ToothIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    Squares2X2Icon,
    Bars3Icon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';
import * as HeroIcons from '@heroicons/react/24/outline';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Resolve any heroicon by its string name from configs.js — no manual map needed
function WidgetIcon({ name, className = 'w-4 h-4' }) {
    const Icon = HeroIcons[name] ?? HeroIcons.Squares2X2Icon;
    return <Icon className={className} />;
}

export default function DashboardGridClient({ availableWidgets }) {
    const t = useTranslations('dashboard');
    const tGlobal = useTranslations('');
    const [mounted, setMounted] = useState(false);
    const [isMobileLibraryOpen, setIsMobileLibraryOpen] = useState(false);

    const {
        layout,
        activeWidgets,
        isCustomizing,
        toggleCustomization,
        addWidget,
        removeWidget,
        updateLayout,
        resetLayout,
    } = useDashboardStore();

    const [localLayout, setLocalLayout] = useState(layout);
    const isResetting = useRef(false);

    useEffect(() => {
        setMounted(true);
        if (isCustomizing) useDashboardStore.setState({ isCustomizing: false });
        return () => useDashboardStore.setState({ isCustomizing: false });
    }, []);

    useEffect(() => {
        if (!isCustomizing) {
            setLocalLayout(layout);
        } else {
            const newItems = layout.filter(item => !localLayout.some(l => l.i === item.i));
            const activeSet = new Set(activeWidgets);
            if (newItems.length > 0 || localLayout.length !== activeWidgets.length) {
                setLocalLayout((prev) => {
                    const keptItems = prev.filter(l => activeSet.has(l.i));
                    return [...keptItems, ...newItems];
                });
            }
        }
    }, [layout, activeWidgets, isCustomizing]);

    const handleLayoutChange = useCallback((currentLayout) => {
        if (isResetting.current) return;          // skip during reset
        if (isCustomizing) setLocalLayout(currentLayout);
    }, [isCustomizing]);

    const handleSave = () => {
        updateLayout(localLayout);
        toggleCustomization();
        setIsMobileLibraryOpen(false);
    };

    const handleCancel = () => {
        setLocalLayout(layout);
        toggleCustomization();
        setIsMobileLibraryOpen(false);
    };

    const handleReset = () => {
        isResetting.current = true;
        resetLayout();
        // Read the just-reset layout synchronously from the store and apply it once.
        // Setting isResetting prevents onLayoutChange from firing during the transition.
        const { layout: freshLayout } = useDashboardStore.getState();
        setLocalLayout(freshLayout);
        requestAnimationFrame(() => { isResetting.current = false; });
    };

    // Apply a width or height preset to a specific widget in localLayout
    const resizeWidget = useCallback((widgetId, changes) => {
        setLocalLayout(prev =>
            prev.map(l => l.i === widgetId ? { ...l, ...changes } : l)
        );
    }, []);

    // Width presets (out of 12 columns)
    const W_PRESETS = [
        { label: '¼', w: 3 },
        { label: '½', w: 6 },
        { label: '¾', w: 9 },
        { label: '■', w: 12 },
    ];
    // Height presets (in row units × rowHeight 60px)
    const H_PRESETS = [
        { label: 'S', h: 3 },
        { label: 'M', h: 5 },
        { label: 'L', h: 8 },
    ];

    const activeLayout = isCustomizing ? localLayout : layout;
    const availableWidgetKeys = Object.keys(availableWidgets);
    const inactiveWidgets = availableWidgetKeys.filter(key => !activeWidgets.includes(key));

    // useMemo MUST be above any early return — hooks must run unconditionally.
    // Stabilises the reference so react-grid-layout doesn't see a "new" layouts
    // object on every render and call onLayoutChange in an infinite loop.
    const gridLayouts = useMemo(
        () => ({ lg: activeLayout.filter(l => activeWidgets.includes(l.i) && availableWidgets[l.i]) }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [activeLayout, activeWidgets, availableWidgetKeys.join(',')]
    );

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 space-y-4 animate-pulse">
                <div className="h-14 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg" />)}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, i) => <div key={i} className="h-64 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">

            {/* ─── Header bar ─── */}
            <div className={`
                relative z-20 flex flex-col sm:flex-row justify-between items-start sm:items-center
                bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700
                px-4 sm:px-6 py-3 gap-3 sm:gap-2 sticky top-0
                ${isCustomizing ? 'border-indigo-100 dark:border-indigo-900/50' : ''}
                transition-colors duration-200 shadow-sm
            `}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-l flex items-center justify-center">
                        <Squares2X2Icon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-none">
                            {tGlobal('MainMenu.dashboard.headLabel', { fallback: 'Dashboard' })}
                        </h1>
                        {isCustomizing && (
                            <p className="text-xs text-blue-500 dark:text-blue-400 font-medium mt-0.5">
                                {t('customizingHint')}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    {!isCustomizing ? (
                        <button
                            onClick={toggleCustomization}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors shadow-sm active:scale-95"
                        >
                            <Cog6ToothIcon className="w-4 h-4" />
                            {t('customize')}
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleReset}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-800/40 transition-all"
                            >
                                {t('resetLayout')}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg transition-all"
                            >
                                <XMarkIcon className="w-4 h-4" />
                                {t('cancelCustomization')}
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white rounded-lg bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 border border-transparent transition-all shadow-sm active:scale-95"
                            >
                                <CheckIcon className="w-4 h-4" />
                                <span className="sm:hidden">
                                    {t('saveCustomizationCompact')}
                                </span>
                                <span className="hidden sm:inline">
                                    {t('saveCustomization')}
                                </span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* ─── Content area (grid + library side by side on desktop) ─── */}
            <div className="flex flex-1 relative">

                {/* ─── Grid ─── */}
                <div className="flex-1 min-w-0">
                    {/* Empty state: No widgets available due to permissions */}
                    {Object.keys(availableWidgets).length === 0 ? (
                        <div className="min-h-[calc(100vh-120px)] w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300 pt-3 rounded-2xl flex flex-col">
                            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col justify-center">
                                <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto w-full">
                                    <div className="w-20 h-20 mb-6 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                                        <ChartBarIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {t('emptyState.title')}
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                                        {t('emptyState.description')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Empty state: User removed all widgets but CAN add them */}
                            {activeWidgets.length === 0 && !isCustomizing && (
                                <div className="min-h-[calc(100vh-120px)] w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300 pt-3 rounded-2xl flex flex-col">
                                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col justify-center">
                                        <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto w-full">
                                            <div className="w-20 h-20 mb-6 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                                                <Squares2X2Icon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                                {t('noWidgets.title')}
                                            </h2>
                                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                                                {t('noWidgets.description')}
                                            </p>
                                            <button
                                                onClick={toggleCustomization}
                                                className="flex items-center gap-2 px-6 py-3 text-sm font-medium  bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-xl shadow-md transition-all hover:-translate-y-0.5 active:scale-95"
                                            >
                                                <PlusIcon className="w-5 h-5" />
                                                {t('addWidgets')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Edit mode hint strip */}
                    {isCustomizing && (
                        <div className="mx-4 sm:mx-6 mt-3 mb-0.5 p-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                            <Bars3Icon className="w-4 h-4 flex-shrink-0" />
                            <span>{t('customizingHint')}</span>
                        </div>
                    )}

                    <div className="p-0 sm:p-1">
                        <ResponsiveGridLayout
                            className="layout"
                            layouts={gridLayouts}
                            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                            rowHeight={60}
                            onLayoutChange={handleLayoutChange}
                            isDraggable={isCustomizing}
                            isResizable={isCustomizing}
                            resizeHandles={isCustomizing ? ['se'] : []}
                            margin={[16, 16]}
                            useCSSTransforms={true}
                            draggableHandle=".widget-drag-handle"
                            cancel=".non-draggable"
                        >
                            {activeLayout
                                .filter(l => activeWidgets.includes(l.i) && availableWidgets[l.i])
                                .map((l) => {
                                    const reg = WIDGET_REGISTRY[l.i] || {};
                                    return (
                                        <div
                                            key={l.i}
                                            data-grid={{
                                                w: l.w, h: l.h, x: l.x, y: l.y,
                                                minW: reg.minW ?? 3, minH: reg.minH ?? 3,
                                                maxW: reg.maxW ?? 12, maxH: reg.maxH ?? 10,
                                            }}
                                            className={`group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex flex-col transition-all duration-200 ${isCustomizing
                                                ? 'ring-2 ring-blue-500/30 dark:ring-blue-400/30 shadow-xl'
                                                : 'shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700 hover:-translate-y-0.5'
                                                }`}
                                        >
                                            {/* Drag handle bar */}
                                            {isCustomizing && (
                                                <div className={`widget-drag-handle shrink-0 h-8 px-2.5 flex items-center justify-between cursor-grab active:cursor-grabbing bg-gradient-to-r ${reg.colorClass ?? 'from-blue-500 to-blue-600'}`}>
                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                        <Bars3Icon className="w-3.5 h-3.5 text-white/70 flex-shrink-0" />
                                                        <span className="text-xs font-semibold text-white/90 truncate">
                                                            {t(`widgets.${l.i.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}.title`)}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onTouchStart={(e) => { e.stopPropagation(); removeWidget(l.i); }}
                                                        onClick={(e) => { e.stopPropagation(); removeWidget(l.i); }}
                                                        className="non-draggable relative z-20 w-8 h-8 -mr-1.5 rounded-full flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer group"
                                                    >
                                                        <div className="w-5 h-5 rounded-full bg-white/20 group-hover:bg-red-500 group-active:bg-red-600 flex items-center justify-center transition-colors">
                                                            <XMarkIcon className="w-3 h-3 text-white" />
                                                        </div>
                                                    </button>
                                                </div>
                                            )}

                                            {/* Widget content */}
                                            <div className={`flex-1 min-h-0 overflow-hidden ${isCustomizing ? 'pointer-events-none opacity-60' : ''}`}>
                                                {availableWidgets[l.i]}
                                            </div>

                                            {/* Size preset toolbar — shown at the bottom in edit mode */}
                                            {isCustomizing && (
                                                <div
                                                    onMouseDown={(e) => e.stopPropagation()}
                                                    className="shrink-0 flex items-center justify-between gap-2 px-2.5 py-1.5 bg-gray-50 dark:bg-gray-900/60 border-t border-gray-100 dark:border-gray-700/60 select-none"
                                                >
                                                    {/* Width presets */}
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 mr-0.5 font-medium">W</span>
                                                        {W_PRESETS.map(p => {
                                                            const cur = localLayout.find(ll => ll.i === l.i);
                                                            const active = cur?.w === p.w;
                                                            return (
                                                                <button
                                                                    key={p.label}
                                                                    onClick={() => resizeWidget(l.i, { w: p.w })}
                                                                    className={`non-draggable px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${active
                                                                        ? 'bg-indigo-500 text-white'
                                                                        : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-gray-200 dark:border-gray-700'
                                                                        }`}
                                                                >
                                                                    {p.label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    {/* Height presets */}
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 mr-0.5 font-medium">H</span>
                                                        {H_PRESETS.map(p => {
                                                            const cur = localLayout.find(ll => ll.i === l.i);
                                                            const active = cur?.h === p.h;
                                                            return (
                                                                <button
                                                                    key={p.label}
                                                                    onClick={() => resizeWidget(l.i, { h: p.h })}
                                                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${active
                                                                        ? 'bg-indigo-500 text-white'
                                                                        : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-gray-200 dark:border-gray-700'
                                                                        }`}
                                                                >
                                                                    {p.label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                        </ResponsiveGridLayout>
                    </div>

                    {/* Mobile bottom padding when library is showing */}
                    {isCustomizing && <div className="h-20 md:h-0" />}
                </div>

                {/* ─── Widget Library Floating Popup ─── */}
                {isCustomizing && (
                    <div className={`
                        fixed z-20
                        bottom-4 right-4
                        w-[calc(100vw-2rem)] sm:w-80
                        bg-white dark:bg-gray-900
                        border border-gray-200 dark:border-gray-700
                        rounded-2xl
                        shadow-2xl shadow-black/15 dark:shadow-black/40
                        flex flex-col
                        transition-all duration-300 ease-in-out
                        max-h-[70vh]
                        overflow-hidden
                    `}>
                        {/* Popup header — tap to collapse on mobile */}
                        <div
                            className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer"
                            onClick={() => setIsMobileLibraryOpen(v => !v)}
                        >
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                                    <PlusIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                                    {t('widgetLibrary')}
                                </h3>
                                {inactiveWidgets.length > 0 && (
                                    <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-1.5 py-0.5 rounded-full font-bold leading-none">
                                        {inactiveWidgets.length}
                                    </span>
                                )}
                            </div>
                            <div className="text-gray-400">
                                {isMobileLibraryOpen
                                    ? <ChevronDownIcon className="w-4 h-4" />
                                    : <ChevronUpIcon className="w-4 h-4" />
                                }
                            </div>
                        </div>

                        {/* Scrollable list — collapsed by default, expand on tap header */}
                        {isMobileLibraryOpen && (
                            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                {inactiveWidgets.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className="w-10 h-10 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-2">
                                            <CheckIcon className="w-5 h-5 text-green-500" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('allWidgetsActive')}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{t('allWidgetsActiveHint')}</p>
                                    </div>
                                ) : (
                                    inactiveWidgets.map(widgetKey => {
                                        const camelKey = widgetKey.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
                                        const reg = WIDGET_REGISTRY[widgetKey] || {};
                                        return (
                                            <div key={widgetKey} className="rounded-xl border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-all overflow-hidden">
                                                <div className="flex items-center gap-2.5 p-2.5">
                                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${reg.colorClass ?? 'from-blue-500 to-indigo-600'} flex items-center justify-center flex-shrink-0`}>
                                                        <span className="text-white"><WidgetIcon name={reg.iconName} /></span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate leading-tight">
                                                            {t(`widgets.${camelKey}.title`)}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                                                            {t(`widgets.${camelKey}.description`)}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => addWidget(widgetKey)}
                                                        className="w-7 h-7 rounded-lg bg-blue-100 hover:bg-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-600 flex items-center justify-center transition-colors group flex-shrink-0"
                                                    >
                                                        <PlusIcon className="w-4 h-4 text-blue-600 group-hover:text-white dark:text-blue-400 dark:group-hover:text-white transition-colors" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
