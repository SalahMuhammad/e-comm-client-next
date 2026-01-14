"use client";
import PaginationControls from '@/components/PaginationControls';
import DeleteButton from "./DeleteButton";
import Link from 'next/link';
import numberFormatter from "@/utils/NumberFormatter";
import ToolTip from "@/components/ToolTip2";
import { EyeIcon, PencilIcon, PhotoIcon } from "@heroicons/react/24/outline";
import ErrorLoading from "@/components/ErrorLoading";
import { useTranslations } from "next-intl";
import { useState } from 'react';
import ImageView from "@/components/ImageView";

export default function PaymentListTable({ data, type, pageCount }) {
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
                                {t('finance.fields.owner')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.paymentMethod')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.amount')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.status')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.ref')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.paymentProof')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.transactionId')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.senderPhone')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.senderName')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.bankName')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.receivedBy')}
                            </th>

                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.date')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.note')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('global.actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.results?.map((payment) => (
                            <tr key={payment.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-4 w-[12rem] max-w-[16rem] font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <Link href={`/customer-supplier/view/${payment.owner}`} className="text-blue-600 dark:text-blue-200 hover:underline dark:hover:text-white hover:text-gray-700 transition-all duration-200">
                                        {payment.owner_name}
                                    </Link>
                                </th>
                                <td className="px-6 py-4 w-56 min-w-[14rem]">
                                    {payment.payment_method_name}
                                </td>
                                <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                    {numberFormatter(payment.amount)}
                                </td>
                                <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                    <StatusBadge status={payment.status} t={t} />
                                </td>
                                <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                    {payment?.ref ? (
                                        <Link className="
                                            ml-2 flex items-center text-blue-700 
                                            hover:text-blue-800 group transition 
                                            duration-300 dark:text-blue-200 
                                            dark:hover:text-white" href={`/invoice/${type == 'payment' ? 'sales' : 'purchases'}/view/${payment.ref}`}
                                        >
                                            #{payment.ref}
                                        </Link>
                                    ) : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="w-16 cursor-pointer group" onClick={() => handleViewImage(payment.payment_proof)}>
                                        {payment.payment_proof ? (
                                            <img
                                                src={payment.payment_proof}
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
                                <td className="px-6 py-4">
                                    {payment.transaction_id || '-'}
                                </td>
                                <td className="px-6 py-4">
                                    {payment.sender_phone || '-'}
                                </td>
                                <td className="px-6 py-4">
                                    {payment.sender_name || '-'}
                                </td>
                                <td className="px-6 py-4">
                                    {payment.bank_name || '-'}
                                </td>
                                <td className="px-6 py-4">
                                    {payment.received_by || '-'}
                                </td>
                                <td className="px-6 py-4 w-48 min-w-[12rem] whitespace-nowrap">
                                    {payment.date}
                                </td>
                                <td className="px-6 py-4 w-[10rem] max-w-[10rem] overflow-auto">
                                    {payment.notes ? (
                                        <pre>
                                            {payment.notes}
                                        </pre>
                                    ) : '-'}
                                </td>

                                <td className="px-6 py-4 align-middle">
                                    <div className="flex items-center">
                                        <Link className="ml-2 flex items-center text-blue-700 hover:text-blue-800 group transition duration-300 dark:text-blue-200 dark:hover:text-white" href={`/finance/${type}${type == 'payment' ? 's' : ''}/view/${payment.hashed_id}`}>
                                            <EyeIcon
                                                className="h-5 w-5 mr-1 transition-transform duration-300 ease-in-out transform origin-center group-hover:scale-125 group-hover:-translate-y-1 group-hover:drop-shadow-sm"
                                            />
                                            <span className="transition-opacity duration-300 group-hover:opacity-90 text-sm">
                                                {t("finance.table.view")}
                                            </span>
                                        </Link>

                                        <Link
                                            href={`/finance/${type}${type == 'payment' ? 's' : ''}/form/${payment.hashed_id}`}
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

                                        <DeleteButton type={type} id={payment.hashed_id} />
                                        <ToolTip obj={payment} />
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


function StatusBadge({ status, t }) {
    const statusConfig = {
        '1': {
            label: t('finance.statusOptions.pending'),
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-800',
            dotColor: 'bg-yellow-500'
        },
        '2': {
            label: t('finance.statusOptions.confirmed'),
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-800',
            dotColor: 'bg-blue-500'
        },
        '3': {
            label: t('finance.statusOptions.rejected'),
            bgColor: 'bg-red-100',
            textColor: 'text-red-800',
            dotColor: 'bg-red-500'
        },
        '4': {
            label: t('finance.statusOptions.reimbursed'),
            bgColor: 'bg-green-100',
            textColor: 'text-green-800',
            dotColor: 'bg-green-500'
        }
    };

    const config = statusConfig[status] || statusConfig['1'];

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="space-y-8">
                <div>
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${config.bgColor} ${config.textColor}`}
                    >
                        <span className={`w-2 h-2 rounded-full ${config.dotColor} mr-2`}></span>
                        {config.label}
                    </span>
                </div>
            </div>
        </div>
    );
}
