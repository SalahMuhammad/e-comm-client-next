'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { RepositoryForm } from '../form/RepositoryFormComponent';
import RepositoryTable from './RepositoryTable';
import CreateDialogButton from '@/components/CreateDialogButton';

export default function RepositoryListClient({ initialRepositories, count, next, previous }) {
    const t = useTranslations("warehouse.repositories");
    const [repositories, setRepositories] = useState(initialRepositories);

    useEffect(() => {
        setRepositories(initialRepositories);
    }, [initialRepositories]);

    const handleRepositoryCreated = (newRepositoryData) => {
        if (newRepositoryData) {
            setRepositories(prev => [newRepositoryData, ...prev]);
        }
    };

    return (
        <>
            <CreateDialogButton
                label={t("table.create")}
                title={t("table.createTitle")}
                description={t("table.createDescription")}
                FormComponent={RepositoryForm}
                formProps={{ obj: {} }}
                onSuccess={handleRepositoryCreated}
                buttonClassName="w-full mb-4"
            />

            <div className="relative overflow-x-auto shadow-md sm:rounded-md">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                {t('table.head.name')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {/* {t('table.head.actions')} */}
                            </th>
                        </tr>
                    </thead>

                    <RepositoryTable repositories={repositories} setRepositories={setRepositories} />
                </table>
            </div>
        </>
    );
}
