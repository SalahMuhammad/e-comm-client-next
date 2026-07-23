import NotifyV2 from '@/components/sonner_actions/NotifyV2';
import { StatusBadge } from './utility';
import {
    WrenchScrewdriverIcon,
    CalendarIcon,
    UserIcon,
    CubeIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { httpDelete } from '@/utils/HTTPMethods';



const MaintenanceCard = ({ record, onClick, onEdit, t }) => {
    const router = useRouter();

    return (
        <div
            onClick={onClick}
            className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
        >
            <div className="p-5">
                <div className="flex items-start justify-between gap-4">

                    {/* Left: main info */}
                    <div className="flex-1 min-w-0 space-y-2">
                        {/* ID + Serial */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono text-gray-400 dark:text-gray-500">#{record._hashed_id}</span>
                            {record?.serial_number && (
                                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-mono">
                                    SN: {record.serial_number}
                                </span>
                            )}
                        </div>

                        {/* Item name */}
                        <div className="flex items-center gap-1.5">
                            <CubeIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base truncate group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                                {record._item_name}
                            </p>
                        </div>

                        {/* Client */}
                        <div className="flex items-center gap-1.5">
                            <UserIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{record._client_name}</p>
                        </div>

                        {/* Malfunctions preview */}
                        {record.malfunctions && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-1 italic">
                                &ldquo;{record.malfunctions}&rdquo;
                            </p>
                        )}
                    </div>

                    {/* Right: status + dates */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <StatusBadge status={record.status} />

                        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            <span>{record.date_in}</span>
                        </div>

                        {record.date_out && (
                            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                <CalendarIcon className="w-3.5 h-3.5" />
                                <span>{record.date_out}</span>
                            </div>
                        )}

                        {record?.parts?.length > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-medium">
                                {record.parts.length} {t('parts')}
                            </span>
                        )}
                    </div>
                </div>

                {/* ── Bottom action strip ── */}
                <div
                    className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between"
                    onClick={(e) => e.stopPropagation()}
                >
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                        {t('updated')}: {new Date(record?._audit_info?.last_updated_at).toLocaleDateString()}
                    </span>
                    <div className='flex gap-8'>
                        <NotifyV2
                            variant='action'
                            action={() => httpDelete(`api/maintenance/${record._hashed_id}/`)}
                            onResponse={(result, error) => { if (!error) router.refresh() }}
                        />
                        <button
                            onClick={onEdit}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-blue-200 dark:border-blue-800 transition-all duration-200"
                        >
                            <WrenchScrewdriverIcon className="w-3.5 h-3.5" />
                            {t('editRecord')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceCard;
