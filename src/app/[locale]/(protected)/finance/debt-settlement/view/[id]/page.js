import numberFormatter from '@/utils/NumberFormatter';
import { getDebtSettlement } from '../../actions'
import styles from '@/app/[locale]/(protected)/finance/_common/view.module.css'
import s from '@/app/[locale]/(protected)/invoice/_common/view.module.css'
import Link from 'next/link';
import DeleteButton from '../../DeleteButton';
import CompanyDetailsHead from '@/components/CompanyDetailsHead';
import EventNotFound from '@/components/NotFound';
import { getTranslations } from 'next-intl/server';
import { formatDate } from '@/utils/dateFormatter';


async function DebtSettlementView({ params }) {
    const t = await getTranslations('finance.debtSettlement');
    const tf = await getTranslations('finance.fields');
    const id = (await params).id
    const transaction = (await getDebtSettlement(id)).data


    if (!transaction?.id) return <EventNotFound eventId={id} />


    return (
        <div id='printarea' className={`p-4 ${styles["receipt-container"]}`}>
            <div className={`${s['invoice-controls']} none-printable`}>
                <Link
                    href={`/finance/debt-settlement/form/${id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                    Edit
                </Link>

                <DeleteButton id={id} isDeleteFromView={true} />

                <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                    </svg>
                    Print
                </button>
            </div>


            <div className='pr-4 pb-4 w-full shadow-[8px_8px_8px_-5px_rgba(0,0,0,0.3)] print-custom-shadow bg-white dark:bg-gray-900 print:bg-white'>
                <CompanyDetailsHead>
                    <div className="mx-auto text-base text-black dark:text-white print:text-black">
                        <p className="text-3xl font-serif font-bold mb-2">{t('header')}</p>
                        <div className="text-sm space-y-1">
                            <p className='font-serif'>{tf('date')}: <span className="font-semibold text-gray-700 dark:text-gray-300 print:text-black">{formatDate(transaction.date)}</span></p>
                            <p className='font-serif'>Reference: <span className="font-semibold text-gray-700 dark:text-gray-300 print:text-black">#{transaction.hashed_id}</span></p>
                        </div>
                    </div>
                </CompanyDetailsHead>

                {/* Main Content */}
                <div className="px-6 py-8">
                    {/* Customer/Supplier Info */}
                    <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 print:bg-white rounded-lg border border-gray-200 dark:border-gray-700 print:border-gray-300">
                        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white print:text-black">{tf('owner')} Information</h3>
                        <Link className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors print:text-black print:no-underline" href={`/customer-supplier/view/${transaction.owner}`}>
                            <span className="text-xl font-medium">{transaction.owner_name}</span>
                        </Link>
                    </div>

                    {/* Settlement Details */}
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-green-50 dark:bg-green-900/20 print:bg-white rounded-lg border-2 border-green-200 dark:border-green-800 print:border-gray-400">
                            <p className="text-sm text-gray-600 dark:text-gray-400 print:text-gray-700 mb-1 font-medium">{t('settlementAmount')}</p>
                            <p className="text-3xl font-bold text-green-700 dark:text-green-400 print:text-black">{numberFormatter(transaction.amount)} EGP</p>
                        </div>

                        <div className="p-6 bg-gray-50 dark:bg-gray-800 print:bg-white rounded-lg border-2 border-gray-200 dark:border-gray-700 print:border-gray-400">
                            <p className="text-sm text-gray-600 dark:text-gray-400 print:text-gray-700 mb-2 font-medium">{t('status.label')}</p>
                            <span className={`inline-flex px-4 py-2 rounded-full text-base font-semibold ${transaction.status === 'approved'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 print:bg-white print:text-black print:border-2 print:border-green-600'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 print:bg-white print:text-black print:border-2 print:border-yellow-600'
                                }`}>
                                {t(`status.${transaction.status}`)}
                            </span>
                        </div>
                    </div>

                    {/* Notes Section */}
                    {transaction.note && (
                        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 print:bg-gray-50 rounded-lg border border-blue-200 dark:border-blue-800 print:border-gray-300">
                            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white print:text-black">{tf('note')}</h3>
                            <p className="text-gray-700 dark:text-gray-300 print:text-black whitespace-pre-wrap leading-relaxed">{transaction.note}</p>
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <div className="px-6 pb-6 border-t-2 border-gray-200 dark:border-gray-700 print:border-gray-400 pt-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 print:text-gray-700">
                        <div className="print:text-left">
                            <p className="font-semibold mb-1">Created By:</p>
                            <p className="text-gray-800 dark:text-gray-300 print:text-black">{transaction.by_username}</p>
                        </div>
                        <div className="text-right print:text-right">
                            <p className="font-semibold mb-1">Created On:</p>
                            <p className="text-gray-800 dark:text-gray-300 print:text-black">{new Date(transaction.created_at).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500 print:text-gray-600 border-t border-gray-200 dark:border-gray-700 print:border-gray-300 pt-4">
                        <p className="font-medium">This is an official debt settlement document</p>
                        <p className="mt-1">Please keep this document for your records</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DebtSettlementView
