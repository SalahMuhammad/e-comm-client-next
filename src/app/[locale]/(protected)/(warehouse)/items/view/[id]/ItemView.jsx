'use server'

import { getTranslations } from "next-intl/server";
import { getItem } from "../../actions";
import { getItemFluctuationDuringlast60Dayes } from "../actions";
import './itemView.modul.css'

async function ItemView({ id }) {
    const t = await getTranslations("warehouse.items.view")
    const item = (await getItem(id))?.data
    const itemFluctuation = await getItemFluctuationDuringlast60Dayes(id)
    const itemFluctuationData = itemFluctuation.data
    const value = itemFluctuationData.last_30_dayes - itemFluctuationData.from_60_to_30_dayes
    const percentage = value * 100 / itemFluctuationData.from_60_to_30_dayes

    if (!item?.id) throw new Response('Not Found', { status: 404 })

    const isUpdated = new Date(item.created_at).toLocaleString() !== new Date(item.updated_at).toLocaleString()

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-3 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Main Container */}
                <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl border border-white/20 dark:border-gray-700/50">

                    {/* Header Section */}
                    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 p-4 sm:p-6 lg:p-8">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10">
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 lg:gap-6">
                                {/* Title Section */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white truncate">
                                            {item.name}
                                        </h1>
                                        {item.is_refillable && (
                                            <span className="inline-flex items-center bg-green-500/20 backdrop-blur-sm text-green-100 text-xs sm:text-sm font-medium px-3 py-1 rounded-full border border-green-400/30 whitespace-nowrap">
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                                </svg>
                                                {t("refillable")}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-blue-100 dark:text-blue-200 text-sm sm:text-base">
                                        {t("id")}: #{item.id}
                                    </p>
                                </div>

                                {/* Fluctuation Indicator */}
                                {value !== 0 && (
                                    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-gray-600/30 min-w-0">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                                            {/* Icon and Percentage */}
                                            <div className="flex items-center gap-2">
                                                {value > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M12 19V5M5 12l7-7 7 7" />
                                                        </svg>
                                                        <span className="text-green-400 font-bold text-lg sm:text-xl">+{Math.abs(percentage).toFixed(1)}%</span>
                                                    </div>
                                                )}

                                                {value < 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M12 5v14M19 12l-7 7-7-7" />
                                                        </svg>
                                                        <span className="text-red-400 font-bold text-lg sm:text-xl">-{Math.abs(percentage).toFixed(1)}%</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info Icon with Tooltip */}
                                            <div className="relative group flex-shrink-0">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 text-white/70 hover:text-white cursor-pointer transition-colors"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>

                                                <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full p-3 rounded-lg bg-gray-900 dark:bg-gray-700 text-white text-xs sm:text-sm whitespace-normal max-w-xs z-50 shadow-xl border border-gray-700">
                                                    <div className="text-center">
                                                        <p className="font-medium mb-1">{t("comparisonPeriod")}</p>
                                                        <p className="text-gray-300">{t("30vs30")}</p>
                                                        <p className="text-gray-400 text-xs mt-1">{t("excludedItems")}</p>
                                                    </div>
                                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45 border-r border-b border-gray-700"></div>
                                                </div>
                                            </div>

                                            {/* Values Display */}
                                            <div className="text-white/90 text-xs sm:text-sm">
                                                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                                    <div>
                                                        <p className="text-white/70 font-medium">{t("previous")}</p>
                                                        <p className="font-bold">{itemFluctuationData.from_60_to_30_dayes} {t("units")}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-white/70 font-medium">{t("current")}</p>
                                                        <p className="font-bold">{itemFluctuationData.last_30_dayes} {t("units")}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-4 sm:p-6 lg:p-8">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* Stock Information */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700/50 dark:to-gray-600/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border border-blue-100/50 dark:border-gray-600/30">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-500/10 rounded-lg">
                                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("information")}</h2>
                                    </div>

                                    <div className="space-y-3">
                                        {item.stock.map((stockItem, index) => (
                                            <div key={stockItem.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-blue-100/30 dark:border-gray-600/30">
                                                <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
                                                    {stockItem.repository_name}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                        {stockItem.quantity}
                                                    </span>
                                                    <span className="text-gray-500 dark:text-gray-400 text-sm">{t("units")}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-700/50 dark:to-gray-600/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border border-emerald-100/50 dark:border-gray-600/30">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                                            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("pricing")}</h2>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label:  `${t('price')} 1`, value: item.price1 },
                                            { label:  `${t('price')} 2`, value: item.price2 },
                                            { label:  `${t('price')} 3`, value: item.price3 },
                                            { label:  `${t('price')} 4`, value: item.price4 }
                                        ].map((price, index) => (
                                            <div key={index} className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-emerald-100/30 dark:border-gray-600/30">
                                                <div className="text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
                                                    {price.label}
                                                </div>
                                                <div className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                                    ${price.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Details */}
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700/50 dark:to-gray-600/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border border-purple-100/50 dark:border-gray-600/30">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-purple-500/10 rounded-lg">
                                            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("details")}</h2>
                                    </div>

                                    <div className="space-y-3">
                                        {[
                                            { label: t("type"), value: item.type_name, icon: '🏷️' },
                                            { label: t('origin'), value: item.origin, icon: '🌍' },
                                            { label: t('place'), value: item.place, icon: '📍' }
                                        ].map((detail, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-purple-100/30 dark:border-gray-600/30">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{detail.icon}</span>
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
                                                        {detail.label}:
                                                    </span>
                                                </div>
                                                <span className="font-bold text-purple-600 dark:text-purple-400 text-sm sm:text-base pl-8 sm:pl-0">
                                                    {detail.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Creation and Update Info */}
                                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700/50 dark:to-gray-600/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border border-orange-100/50 dark:border-gray-600/30">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-orange-500/10 rounded-lg">
                                            <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("timeline")}</h2>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-orange-100/30 dark:border-gray-600/30">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">📅</span>
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{t("created")}:</span>
                                                </div>
                                                <div className="text-right pl-8 sm:pl-0">
                                                    <div className="font-bold text-orange-600 dark:text-orange-400 text-sm">
                                                        {new Date(item.created_at).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {isUpdated && (
                                            <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-orange-100/30 dark:border-gray-600/30">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">🔄</span>
                                                        <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{t("updated")}:</span>
                                                    </div>
                                                    <div className="text-right pl-8 sm:pl-0">
                                                        <div className="font-bold text-orange-600 dark:text-orange-400 text-sm">
                                                            {new Date(item.updated_at).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-orange-100/30 dark:border-gray-600/30">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">👤</span>
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                                                        {isUpdated ? t("lastUpdated") : t("created")} {t('by')}:
                                                    </span>
                                                </div>
                                                <div className="text-right pl-8 sm:pl-0">
                                                    <div className="font-bold text-orange-600 dark:text-orange-400 text-sm">
                                                        {item.by_username}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* third row */}
                            {(item?.barcodes?.legnth > 0) && <div className="space-y-6">
                                {/* barcodes */}
                                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-700/50 dark:to-gray-600/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border border-emerald-100/50 dark:border-gray-600/30">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                                            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("barcodes")}</h2>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {item.barcodes.map((obj, index) => (
                                            <div key={index} className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-emerald-100/30 dark:border-gray-600/30">
                                                <div className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                                    {obj.barcode}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default ItemView;