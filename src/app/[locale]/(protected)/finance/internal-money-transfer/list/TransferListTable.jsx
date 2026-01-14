"use client";
import PaginationControls from '@/components/PaginationControls';
import DeleteButton from "../../_common/DeleteButton";
import Link from 'next/link';
import numberFormatter from "@/utils/NumberFormatter";
import ToolTip from "@/components/ToolTip2";
import { EyeIcon, PencilIcon, PhotoIcon } from "@heroicons/react/24/outline";
import ErrorLoading from "@/components/ErrorLoading";
import TableNote from '@/components/TableNote';
import LocalizedDate from '@/components/LocalizedDate';
import { useTranslations } from "next-intl";
import { useState } from 'react';
import ImageView from "@/components/ImageView";

export default function TransferListTable({ data }) {
    const t = useTranslations();
    const [images, setImages] = useState([]);
    const [startIndex, setStartIndex] = useState(0);

    const handleViewImage = (proofUrl) => {
        if (proofUrl) {
            setImages([{ img: proofUrl }]);
            setStartIndex(0);
        }
    };

    return (
        <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.fromVault')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.toVault')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.amount')}
                            </th>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                {t('finance.fields.transferType')}
                            </th>
                            <th scope="col" className="px-6 py-3 w-48 min-w-[12rem]">
                                {t('finance.fields.date')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.note')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.transferProof')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('global.actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.results?.map((transfer) => (
                            <tr key={transfer.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-4 w-[12rem] max-w-[16rem] font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <Link className="ml-2 flex items-center text-blue-600 group transition duration-300 dark:text-blue-200 dark:hover:text-white hover:underline" href={`/finance/account-vault/view/${transfer.from_vault_hashed_id}`}>
                                        {transfer.from_vault_name}
                                    </Link>
                                </th>
                                <td className="px-6 py-4 w-56 min-w-[14rem]">
                                    <Link className="ml-2 flex items-center text-blue-600 group transition duration-300 dark:text-blue-200 dark:hover:text-white hover:underline" href={`/finance/account-vault/view/${transfer.to_vault_hashed_id}`}>
                                        {transfer.to_vault_name}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                    {numberFormatter(transfer.amount)}
                                </td>
                                <td className="px-6 py-4 max-w-xs overflow-x-auto whitespace-nowrap">
                                    <TransferTypeBadge type={transfer.transfer_type} t={t} />
                                </td>
                                <td className="px-6 py-4 w-48 min-w-[12rem] whitespace-nowrap">
                                    <LocalizedDate date={transfer.date} />
                                </td>
                                <td className="px-6 py-4 w-[10rem] max-w-[10rem]">
                                    <TableNote note={transfer.notes} />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="w-16 cursor-pointer group" onClick={() => handleViewImage(transfer.proof)}>
                                        {transfer.proof ? (
                                            <img
                                                src={transfer.proof}
                                                alt="Proof"
                                                className="w-10 h-10 rounded object-cover border-2 border-transparent group-hover:border-blue-500 transition-all duration-300"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded object-cover border rounded-sm flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                                                <PhotoIcon className="w-5 h-5 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                </td>

                                <td className="px-6 py-4 align-middle">
                                    <div className="flex items-center">
                                        <Link className="ml-2 flex items-center text-blue-700 hover:text-blue-800 group transition duration-300 dark:text-blue-200 dark:hover:text-white" href={`/finance/internal-money-transfer/view/${transfer.hashed_id}`}>
                                            <EyeIcon
                                                className="h-5 w-5 mr-1 transition-transform duration-300 ease-in-out transform origin-center group-hover:scale-125 group-hover:-translate-y-1 group-hover:drop-shadow-sm"
                                            />
                                            <span className="transition-opacity duration-300 group-hover:opacity-90 text-sm">
                                                {t("finance.table.view")}
                                            </span>
                                        </Link>

                                        <Link
                                            href={`/finance/internal-money-transfer/form/${transfer.hashed_id}`}
                                            className="ml-2 flex items-center text-blue-600 hover:text-blue-800 group transition duration-300 dark:text-blue-200 dark:hover:text-white"
                                        >
                                            <PencilIcon
                                                className="
                                                    h-4 w-4 mr-1
                                                    transition-all duration-300 ease-in-out
                                                    group-hover:rotate-[8deg]
                                                    group-hover:-translate-y-0.5
                                                    group-hover:scale-110
                                                    group-hover:drop-shadow-sm
                                                "
                                            />
                                            <span className="transition-opacity duration-300 group-hover:opacity-90 text-sm">
                                                {t("finance.table.edit")}
                                            </span>
                                        </Link>

                                        <DeleteButton type={'internal-money-transfer'} id={transfer.hashed_id} />
                                        <ToolTip obj={transfer} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {data.count == 0 &&
                <ErrorLoading name="global.errors" err="nothing" className="w-full transform-translate-x-1/2 flex justify-center items-center bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 p-5 rounded-md mt-3" />
            }

            <ImageView images={images} onClose={() => { setImages([]); setStartIndex(0); }} startIndex={startIndex} />

            <PaginationControls
                resCount={data.count}
                hasNext={data.next}
                hasPrev={data.previous}
            />
        </>
    );
}

function TransferTypeBadge({ type, t }) {
    const typeConfig = {
        'internal': {
            label: t('finance.transferTypes.internal'),
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-800',
            dotColor: 'bg-blue-500'
        },
        'external': {
            label: t('finance.transferTypes.external'),
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-800',
            dotColor: 'bg-purple-500'
        },
        'p2p': {
            label: t('finance.transferTypes.p2p'),
            bgColor: 'bg-green-100',
            textColor: 'text-green-800',
            dotColor: 'bg-green-500'
        }
    };

    const config = typeConfig[type] || typeConfig['internal'];

    return (
        <span
            className={`flex items-center justify-center w-[8rem] px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${config.bgColor} ${config.textColor}`}
        >
            <span className={`w-2 h-2 rounded-full ${config.dotColor} mr-2`}></span>
            {config.label}
        </span>
    );
}
