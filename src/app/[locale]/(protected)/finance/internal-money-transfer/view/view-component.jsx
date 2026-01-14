import numberFormatter from '@/utils/NumberFormatter';
import { getTransfer } from '../actions'
import ToWord from '../../_common/ToWord';
import styles from '../../_common/view.module.css'
import s from '@/app/[locale]/(protected)/invoice/_common/view.module.css'
import Link from 'next/link';
import DeleteButton from '../../_common/DeleteButton';
import CompanyDetailsHead from '@/components/CompanyDetailsHead';
import EventNotFound from '@/components/NotFound';
import { getTranslations } from 'next-intl/server';
import PrintButton from '../../_common/PrintButton';


async function TransferView({ id }) {
    const t = await getTranslations();
    const transfer = (await getTransfer(id)).data

    if (!transfer?.id) return <EventNotFound eventId={id} />

    return (
        <div id='printarea' className={`p-4 ${styles["receipt-container"]}`}>
            <div className={`${s['invoice-controls']} none-printable gap-2`}>
                <Link
                    href={`/finance/internal-money-transfer/list`}
                    style={{ backgroundColor: '#3f3f46', opacity: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        width="16"
                        height="16"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    {t('global.backToList')}
                </Link>

                <Link
                    href={`/finance/internal-money-transfer/form/${id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                >
                    <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                    {t('global.form.edit')}
                </Link>

                <DeleteButton type={'internal-money-transfer'} id={id} isDeleteFromView={true} />

                <PrintButton />
            </div>

            <div className='pr-4 pb-4 w-full shadow-[8px_8px_8px_-5px_rgba(0,0,0,0.3)] print-custom-shadow'>
                <CompanyDetailsHead>
                    <div className="mx-auto text-base text-black">
                        <p className="text-2xl font-serif font-bold">Transfer Receipt</p>
                        <p className='font-serif'>Date: <span className="text-sm text-gray-700 print:text-black">{transfer.date}</span></p>
                        <p className='font-serif'>No: <span className="text-sm text-gray-700 print:text-black">#{transfer.hashed_id}</span></p>
                    </div>
                </CompanyDetailsHead>

                {/* Receipt Details */}
                <div className={styles["receipt-details"]}>
                    <div className={styles["detail-row"]}>
                        <span className={styles["label"]}>From Vault</span>
                        <div className={`${styles["value-field"]}`}>
                            <span className="text-sm text-gray-900 print:text-black">{transfer.from_vault_name}</span>
                        </div>
                    </div>

                    <div className={styles["detail-row"]}>
                        <span className={styles["label"]}>To Vault</span>
                        <div className={`${styles["value-field"]}`}>
                            <span className="text-sm text-gray-900 print:text-black">{transfer.to_vault_name}</span>
                        </div>
                    </div>

                    <div className={styles["detail-row"]}>
                        <span className={styles["label"]}>Transfer Type</span>
                        <div className={`${styles["value-field"]}`}>
                            <span className="text-sm text-gray-900 print:text-black capitalize">{transfer.transfer_type}</span>
                        </div>
                    </div>

                    <div className={styles["detail-row"]}>
                        <span className={styles["label"]}>Sum Of</span>
                        <div className={`${styles["value-field"]} ${styles['q']} ${styles['upper']}`}><ToWord num={transfer.amount} /> EGP</div>
                        <div className={`${styles["value-field"]} ${styles['q']} max-w-[8rem]`}>{numberFormatter(transfer.amount)} EGP</div>
                    </div>

                    {transfer.notes && (
                        <div className={styles["detail-row"]}>
                            <span className={styles["label"]}>Notes</span>
                            <div className={`${styles["value-field"]}`}>
                                <pre className="text-sm text-gray-900 print:text-black whitespace-pre-wrap">{transfer.notes}</pre>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <div className={styles["footer-section"]}>
                    <div className={styles["thank-you"]}>
                        <p>Thank you for your business</p>
                    </div>
                    <div className={styles["thank-you"]}>
                        <p>Generated on {new Date(transfer.created_at).toString().split(' GMT')[0]}</p>
                    </div>
                    {transfer.created_by && (
                        <div className={styles["thank-you"]}>
                            <p className="text-xs">Created by: {transfer.created_by} on {new Date(transfer.created_at).toLocaleString()}</p>
                        </div>
                    )}
                    {transfer.last_updated_by && transfer.last_updated_at && (
                        <div className={styles["thank-you"]}>
                            <p className="text-xs">Last updated by: {transfer.last_updated_by} on {new Date(transfer.last_updated_at).toLocaleString()}</p>
                        </div>
                    )}
                </div>
            </div>

            {transfer?.proof && (
                <div className={`none-printable pt-6`}>
                    <h3 className="text-lg font-semibold mb-2">Transfer Proof</h3>
                    <img src={transfer.proof} alt="Transfer proof" className="max-w-2xl rounded-lg shadow-md" />
                </div>
            )}
        </div>
    )
}

export default TransferView
