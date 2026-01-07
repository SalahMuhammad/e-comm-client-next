"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FillText } from "@/components/loaders";
import companyDetails from "@/constants/company";
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { toast } from "sonner";
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';
import { deleteDamagedItem } from "./actions";
import TableNote from "@/components/TableNote";

function handleDelete(t, id, onDelete) {
    const handleGenericErrors = useGenericResponseHandler(t)

    toast(t("items.card.remove.confirm"), {
        action: {
            label: t('items.card.remove.yes'),
            onClick: async () => {
                const res = await deleteDamagedItem(id);

                if (handleGenericErrors(res)) return;
                if (res.ok) {
                    toast.success(t('items.card.remove.success'));
                    onDelete?.(id);
                } else {
                    toast.error(t('items.card.remove.error'));
                }
            },
        },
        cancel: {
            label: t('items.card.remove.no'),
            onClick: () => {
                toast.info(t('items.card.remove.canceled'));
            },
        },
        duration: 10000,
    });

}

// Table Row Component
function TableRow({ id, item_id, owner_name, repository_name, item_name, quantity, unit_price, date, notes, isDeleting = false, funs }) {
    const tGlobal = useTranslations("");
    const t = useTranslations("warehouse");

    const handleOnDelete = (id) => {
        // trigger fade-out
        funs.setDeletingId(id);

        // wait for animation before removing
        setTimeout(() => {
            funs.setItems(prev => prev.filter(item => item.id !== id));
            funs.setDeletingId(null);
        }, 300); // match the transition duration
    };

    return (
        <tr
            className={`
              transition-all duration-300 ease-in-out 
              ${isDeleting ? 'opacity-0 -translate-x-5 pointer-events-none' : ''}
              bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600
            `}
        >
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <Link href={`/items/view/${item_id}`} className="block text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 hover:underline transition-all duration-200">
                    {item_name || item_id}
                </Link>
            </th>
            <td className="px-6 py-4 text-gray-900 dark:text-white">
                {owner_name || '-'}
            </td>
            <td className="px-6 py-4 text-gray-900 dark:text-white">
                {repository_name || '-'}
            </td>
            <td className="px-6 py-4 text-gray-900 dark:text-white font-bold">
                {quantity}
            </td>
            <td className="px-6 py-4 text-gray-900 dark:text-white font-bold">
                {unit_price}
            </td>
            <td className="px-6 py-4 text-gray-900 dark:text-white">
                {date}
            </td>
            <td className="px-6 py-4 text-gray-900 dark:text-white">
                <TableNote note={notes} />
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                    <button className="group flex items-center gap-1 px-2 py-1 rounded-md
                        text-red-600 dark:text-red-500 cursor-pointer
                        transition-all duration-300 ease-in-out"
                        onClick={() => handleDelete(t, id, handleOnDelete)}
                    >
                        <TrashIcon
                            className="
                            h-4 w-4
                            transition-transform duration-300 ease-in-out
                            group-hover:rotate-[15deg]
                            group-hover:scale-125
                            "
                        />

                        {t("repositories.damagedItems.table.remove.label")}
                    </button>
                    <Link
                        href={`/items/damaged/form/${id}`}
                        className="flex items-center gap-1 px-2 py-1 rounded-md text-blue-600 dark:text-blue-200 dark:hover:text-white group transition duration-300"
                    >
                        <PencilIcon
                            className="h-4 w-4 mr-1
                            transition-all duration-300 ease-in-out
                            group-hover:rotate-[8deg]
                            group-hover:-translate-y-0.5
                            group-hover:scale-110
                            group-hover:drop-shadow-sm"
                        />
                        {t("repositories.damagedItems.table.edit")}
                    </Link>
                </div>
            </td>
        </tr>
    );
}

// Table View Component
export function DamagedItemsTable({ items: rawItems, setItems }) {
    const t = useTranslations("warehouse");
    const [isClient, setIsClient] = useState(false);
    const items = rawItems;
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (<div className="flex flex-row min-h-screen justify-center items-center">
            <FillText text={companyDetails.name} />
        </div>)
    }

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">{t("repositories.damagedItems.table.item")}</th>
                        <th scope="col" className="px-6 py-3">{t("repositories.damagedItems.table.owner")}</th>
                        <th scope="col" className="px-6 py-3">{t("repositories.damagedItems.table.repository")}</th>
                        <th scope="col" className="px-6 py-3">{t("repositories.damagedItems.table.quantity")}</th>
                        <th scope="col" className="px-6 py-3">{t("repositories.damagedItems.table.unitPrice")}</th>
                        <th scope="col" className="px-6 py-3">{t("repositories.damagedItems.table.date")}</th>
                        <th scope="col" className="px-6 py-3">{t("repositories.damagedItems.table.notes")}</th>
                        <th scope="col" className="px-6 py-3">{t("repositories.damagedItems.table.actions")}</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => {
                        return (
                            <TableRow
                                key={item.id}
                                id={item.id}
                                item_id={item.item}
                                owner_name={item.owner_name}
                                repository_name={item.repository_name}
                                item_name={item.item_name}
                                quantity={item.quantity}
                                unit_price={item.unit_price}
                                date={item.date}
                                notes={item.notes}
                                isDeleting={deletingId === item.id}
                                funs={{
                                    setItems,
                                    setDeletingId
                                }}
                            />)
                    })}
                </tbody>
            </table>
        </div>
    );
}
