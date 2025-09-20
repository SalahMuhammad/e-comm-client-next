import Link from 'next/link'
import {
    ArrowPathIcon,
    CurrencyDollarIcon,
    BuildingStorefrontIcon,
    UserGroupIcon,
    ChartBarIcon,
    ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

async function page({ params }) {
    const reportSections = [
        {
            title: "Warehouse",
            icon: BuildingStorefrontIcon,
            color: "blue",
            gradient: "from-blue-500 to-blue-600",
            darkGradient: "dark:from-blue-600 dark:to-blue-700",
            links: [
                {
                    href: "/reports/item-movement",
                    label: "Item Movement",
                    description: "Track inventory movements and transfers",
                    icon: ChartBarIcon,
                }
            ]
        },
        {
            title: "Refillable Items",
            icon: ArrowPathIcon,
            color: "emerald",
            gradient: "from-emerald-500 to-emerald-600",
            darkGradient: "dark:from-emerald-600 dark:to-emerald-700",
            links: [
                {
                    href: "/reports/refilled-used-items",
                    label: "Refilled & Used Items",
                    description: "Items refilled and used in period",
                    icon: ArrowPathIcon,
                },
                {
                    href: "/reports/refillable-items-client-has",
                    label: "Client Refillable Items",
                    description: "Refillable items client currently has",
                    icon: ArrowPathIcon,
                }
            ]
        },
        {
            title: "Finance",
            icon: CurrencyDollarIcon,
            color: "purple",
            gradient: "from-purple-500 to-purple-600",
            darkGradient: "dark:from-purple-600 dark:to-purple-700",
            links: [
                {
                    href: "/reports/payments-in-period",
                    label: "Payments in Period",
                    description: "Financial transactions and payments",
                    icon: CurrencyDollarIcon,
                }
            ]
        },
        {
            title: "Client & Supplier",
            icon: UserGroupIcon,
            color: "orange",
            gradient: "from-orange-500 to-orange-600",
            darkGradient: "dark:from-orange-600 dark:to-orange-700",
            links: [
                {
                    href: "/reports/owner-account-statement",
                    label: "Account Statement",
                    description: "Detailed account statements",
                    icon: CurrencyDollarIcon,
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300 pt-3 rounded-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

                <div className="mb-8 sm:mb-12">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent mb-3">
                                Reports Dashboard
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Reports Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-6 lg:gap-8">
                    {reportSections.map((section, sectionIndex) => {
                        const SectionIcon = section.icon;
                        return (
                            <div
                                key={sectionIndex}
                                className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Section Header */}
                                <div className={`bg-gradient-to-r ${section.gradient} ${section.darkGradient} p-6 relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>
                                    <div className="relative flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                                <SectionIcon className="w-6 h-6 text-white drop-shadow-sm" />
                                            </div>
                                            <h2 className="text-xl font-bold text-white drop-shadow-sm">
                                                {section.title}
                                            </h2>
                                        </div>
                                        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Section Links */}
                                <div className="p-6 space-y-4">
                                    {section.links.map((link, linkIndex) => {
                                        const LinkIcon = link.icon;
                                        return (
                                            <Link
                                                key={linkIndex}
                                                href={link.href}
                                                className="group/link block p-4 rounded-2xl border border-gray-100 dark:border-gray-600 hover:border-gray-200 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-start space-x-4 flex-1 min-w-0">
                                                        <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-700 rounded-xl group-hover/link:bg-gray-200 dark:group-hover/link:bg-gray-600 transition-colors">
                                                            <LinkIcon className={`w-5 h-5 text-${section.color}-600 dark:text-${section.color}-400`} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-semibold text-gray-900 dark:text-white group-hover/link:text-gray-700 dark:group-hover/link:text-gray-200 transition-colors truncate">
                                                                    {link.label}
                                                                </h3>
                                                                {link.badge && (
                                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${section.color}-100 dark:bg-${section.color}-900/30 text-${section.color}-700 dark:text-${section.color}-300`}>
                                                                        {link.badge}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                                                {link.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0 ml-3">
                                                        <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover/link:text-gray-600 dark:group-hover/link:text-gray-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all duration-200" />
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}

export default page;
