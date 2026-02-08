'use client'

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import FileInput from '@/components/inputs/FileInput';
import StaticOptionsInput from '@/components/inputs/text/StaticOptionsInput';
import { createDbBackup, getBackups, restoreDbBackup } from '../actions';
import {
    ArchiveBoxArrowDownIcon,
    ArrowUpTrayIcon,
    ServerStackIcon,
    ArrowPathIcon,
    CircleStackIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';

const ACCEPTED_FILE_TYPES = [
    { label: 'JSON', value: '.json' },
    { label: 'SQL', value: '.sql' },
    { label: 'DUMP', value: '.dump' },
    { label: 'ZIP', value: '.zip' }
];

const ActionButton = ({ onClick, isLoading, icon: Icon, label, subLabel }) => (
    <button
        onClick={onClick}
        disabled={isLoading}
        className="w-full group relative flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-transparent hover:border-blue-500/50 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
        <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
            <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-gray-100">{label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{subLabel}</div>
            </div>
        </div>
        {isLoading && <ArrowPathIcon className="w-5 h-5 animate-spin text-blue-500" />}
    </button>
);

export default function DatabaseManager() {
    const t = useTranslations('settings.database');
    const [backups, setBackups] = useState([]);
    const [restoreMode, setRestoreMode] = useState('file'); // 'file' or 'server'
    const [selectedBackup, setSelectedBackup] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileInputKey, setFileInputKey] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // New state for enhancements
    const [backupNotes, setBackupNotes] = useState('');
    const [maxBackups, setMaxBackups] = useState(15);
    const [isSavingConfig, setIsSavingConfig] = useState(false);

    const handleGenericErrors = useGenericResponseHandler();

    // Fetch config on mount
    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const { getBackupConfig } = await import('../actions'); // Dynamically import to avoid cycle if any
            const result = await getBackupConfig();
            if (result.ok && result.data) {
                setMaxBackups(result.data.max_backups);
            }
        } catch (error) {
            console.error('Failed to load backup config', error);
        }
    };

    // Fetch backups when component mounts or when switching to server mode
    useEffect(() => {
        if (restoreMode === 'server') {
            loadBackups();
        }
    }, [restoreMode]);

    const loadBackups = async () => {
        setIsRefreshing(true); // Use isRefreshing for loading backups
        try {
            const result = await getBackups();
            if (handleGenericErrors(result)) return;

            const fetchedBackups = result.data || [];
            const formattedBackups = Array.isArray(fetchedBackups) ? fetchedBackups.map(b => {
                let label = b.name ? b.name.replace(/\.[^/.]+$/, "") : b.created_at || b.id;

                // Construct note string
                const metaParts = [];
                if (b.user && b.user !== 'System') metaParts.push(t('backupBy', { user: b.user }));
                if (b.notes) metaParts.push(b.notes);

                return {
                    value: b.id || b.name,
                    label: label,
                    note: metaParts.join(' • ')
                };
            }) : [];
            setBackups(formattedBackups);
        } catch (error) {
            console.error('Failed to load backups', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const refreshBackups = () => {
        if (restoreMode === 'server') {
            loadBackups();
        }
    };

    const handleSaveConfig = async () => {
        setIsSavingConfig(true);
        try {
            const { updateBackupConfig } = await import('../actions');
            const result = await updateBackupConfig(maxBackups);
            if (handleGenericErrors(result)) return;
            toast.success(t('configSaved') || 'Configuration saved');
        } catch (error) {
            console.error('Save config error:', error);
            toast.error(t('errorGeneric'));
        } finally {
            setIsSavingConfig(false);
        }
    };

    const executeBackup = async (dataOnly = false, withMedia = false) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            if (dataOnly) formData.append('data-only', '1');
            if (withMedia) formData.append('media', '1');
            if (backupNotes) formData.append('notes', backupNotes);

            // Using formData version of createDbBackup
            const result = await createDbBackup(formData);

            if (handleGenericErrors(result)) return;

            const responseData = result.data || {};

            if (responseData.is_file && responseData.file_data) {
                toast(t('downloadConfirmation'), {
                    action: {
                        label: t('download'),
                        onClick: () => {
                            const link = document.createElement('a');
                            link.href = `data:${responseData.content_type};base64,${responseData.file_data}`;
                            link.download = responseData.file_name || 'backup.json';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }
                    },
                });
                setBackupNotes('');
            } else {
                toast.success(t('backupSuccess'));
                setBackupNotes('');
            }
            refreshBackups();

        } catch (error) {
            console.error('Backup error:', error);
            toast.error(t('errorGeneric'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestore = () => {
        if (restoreMode === 'file' && !selectedFile) {
            toast.warning(t('selectFileWarning'));
            return;
        }
        if (restoreMode === 'server' && !selectedBackup) {
            toast.warning(t('selectBackupWarning'));
            return;
        }

        toast(t('restoreConfirmation'), {
            action: {
                label: t('restore'),
                onClick: () => executeRestore()
            },
            cancel: {
                label: t('cancel')
            }
        });
    };

    const executeRestore = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();

            if (restoreMode === 'file') {
                formData.append('file', selectedFile[0]);
            } else {
                formData.append('backup_id', selectedBackup.value);
            }

            const result = await restoreDbBackup(formData);

            if (handleGenericErrors(result)) return;

            toast.success(t('restoreSuccess'));
            // Optionally reset form
            setSelectedFile(null);
            setFileInputKey(prev => prev + 1);
            setSelectedBackup('');
        } catch (error) {
            console.error('Restore error:', error);
            toast.error(t('errorGeneric'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="md:grid md:grid-cols-2 md:gap-6">

                {/* Backup Section */}
                <div className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700/50 transition-all hover:shadow-xl h-full">
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                <ArchiveBoxArrowDownIcon className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h2>
                        </div>

                        {/* Config Section (Admin Only - simplified check for now, can be improved) */}
                        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
                            <div className="flex items-end gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t('maxBackupsRetention')}
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={maxBackups}
                                        onChange={(e) => setMaxBackups(parseInt(e.target.value) || '')}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
                                    />
                                </div>
                                <button
                                    onClick={handleSaveConfig}
                                    disabled={isSavingConfig}
                                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {isSavingConfig ? t('saving') : t('saveChanges')}
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                                {t('backupRetentionWarning', { count: maxBackups })}
                            </p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('notes')}
                            </label>
                            <input
                                type="text"
                                value={backupNotes}
                                onChange={(e) => setBackupNotes(e.target.value)}
                                placeholder={t('notesPlaceholder')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <ActionButton
                                onClick={() => executeBackup(false)}
                                isLoading={isLoading}
                                icon={CircleStackIcon}
                                label={t('createFullBackup')}
                                subLabel={t('fullBackupDesc')}
                            />
                            <ActionButton
                                onClick={() => executeBackup(true)}
                                isLoading={isLoading}
                                icon={DocumentTextIcon} // Changed from ServerStackIcon to DocumentTextIcon for data only
                                label={t('createDataOnlyBackup')}
                                subLabel={t('dataOnlyBackupDesc')}
                            />
                            <ActionButton
                                onClick={() => executeBackup(false, true)}
                                isLoading={isLoading}
                                icon={ServerStackIcon} // Changed from CircleStackIcon to ServerStackIcon for media
                                label={t('createFullBackupWithMedia')}
                                subLabel={t('fullBackupMediaDesc')}
                            />
                        </div>
                    </div>
                </div>

                {/* Restore Section */}
                <div className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700/50 transition-all hover:shadow-xl mt-6 md:mt-0 h-fit">
                    <div className="p-6 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                                <ArrowUpTrayIcon className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('restoreTitle')}</h2>
                        </div>

                        {/* Mode Selection Tabs */}
                        <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-lg mb-6">
                            <button
                                onClick={() => setRestoreMode('file')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${restoreMode === 'file'
                                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                            >
                                <ArrowUpTrayIcon className="w-4 h-4" />
                                {t('uploadFile')}
                            </button>
                            <button
                                onClick={() => setRestoreMode('server')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${restoreMode === 'server'
                                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                            >
                                <ServerStackIcon className="w-4 h-4" />
                                {t('selectFromServer')}
                            </button>
                        </div>

                        <div className="space-y-4">
                            {restoreMode === 'file' ? (
                                <div className="min-h-[160px]">
                                    <FileInput
                                        key={fileInputKey}
                                        name="restoreFile"
                                        placeholder={t('dropBackupFile')}
                                        onChange={({ newFiles }) => setSelectedFile(newFiles)}
                                        defaultValue={[]}
                                        acceptedTypes={ACCEPTED_FILE_TYPES}
                                        multiple={false}
                                        className="w-full"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <StaticOptionsInput
                                        label={t('selectBackup')}
                                        options={backups}
                                        value={selectedBackup}
                                        onChange={setSelectedBackup}
                                        placeholder={t('selectBackupPlaceholder')}
                                        isDisabled={isRefreshing || backups.length === 0}
                                    />
                                    {backups.length === 0 && (
                                        <p className="text-xs text-center text-gray-500 mt-2">{t('noBackupsFound')}</p>
                                    )}
                                </div>
                            )}
                            <button
                                onClick={handleRestore}
                                disabled={isLoading || (restoreMode === 'file' && !selectedFile) || (restoreMode === 'server' && !selectedBackup)}
                                className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent
                            text-sm font-bold rounded-lg text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600
                            dark:from-red-700 dark:to-red-600 dark:hover:from-red-600 dark:hover:to-red-500
                            shadow-md hover:shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? (
                                    <>
                                        <ArrowPathIcon className="w-5 h-5 animate-spin mr-2" />
                                        {t('processing')}
                                    </>
                                ) : (
                                    t('restore')
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
