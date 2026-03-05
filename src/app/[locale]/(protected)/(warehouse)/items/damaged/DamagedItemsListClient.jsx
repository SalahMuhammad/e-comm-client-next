'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { DamagedItemsForm } from './form/DamagedItemsFormComponent';
import { DamagedItemsTable } from './Table';
import { PERMISSIONS } from '@/config/permissions.config';
import CreateDialogButton from '@/components/CreateDialogButton';

export default function DamagedItemsListClient({ initialItems }) {
    const t = useTranslations("warehouse.repositories.damagedItems");
    const [items, setItems] = useState(initialItems);

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    const handleItemCreated = (newItemData) => {
        if (newItemData) {
            setItems(prev => [newItemData, ...prev]);
        }
    };

    return (
        <>
            <CreateDialogButton
                label={t("table.create")}
                title={t("table.createTitle")}
                description={t("table.createDescription")}
                FormComponent={DamagedItemsForm}
                formProps={{ obj: {} }}
                onSuccess={handleItemCreated}
                permission={PERMISSIONS.DAMAGED_ITEMS.ADD}
                buttonClassName="w-full mb-1"
            />
            <DamagedItemsTable items={items} setItems={setItems} />
        </>
    );
}
