import numberFormatter from '@/utils/NumberFormatter';
import { getPayment } from './actions'
import ToWord from './ToWord';
import styles from './view.module.css'
import s from '@/app/[locale]/(protected)/invoice/_common/view.module.css'
import Link from 'next/link';
import DeleteButton from './DeleteButton';
import { getCreditBalance } from '@/app/[locale]/(protected)/invoice/_common/actions';
import CompanyDetailsHead from '@/components/CompanyDetailsHead';
import EventNotFound from '@/components/NotFound';
import ViewNoteValue from './viewNoteValue';
import ViewReceivedBy from './ViewReceivedBy';
import { getTranslations } from 'next-intl/server';
import PrintButton from './PrintButton';


async function TransactionView({ id, type }) {
    const transaction = (await getPayment(id, type)).data
    const ownerData = (await getCreditBalance(transaction.owner, transaction.date)).data;
    let credit = ownerData.credit || '00.00'
    const t = await getTranslations();

    if (!transaction?.id) return <EventNotFound eventId={id} />


    return (
        <div id='printarea' className={`p-4 ${styles["receipt-container"]}`}>
            <div className={`${s['invoice-controls']} gap-2 none-printable`}>
                <Link
                    href={`/finance/${type}/list`}
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
                    href={`/finance/${type}/form/${id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                    {t('global.form.edit')}
                </Link>

                <DeleteButton type={type} id={id} isDeleteFromView={true} />
                
                <PrintButton />

            </div>


            <div className='pr-4 pb-4 w-full shadow-[8px_8px_8px_-5px_rgba(0,0,0,0.3)] print-custom-shadow'>
                <CompanyDetailsHead>
                    <div className="mx-auto text-base text-black">
                        <p className="text-2xl font-serif font-bold">Receipt</p>
                        <p className='font-serif'>Date: <span className="text-sm text-gray-700 print:text-black">{transaction.date}</span></p>
                        <p className='font-serif'>Nu: <span className="text-sm text-gray-700 print:text-black">#{transaction.hashed_id}</span></p>
                    </div>
                </CompanyDetailsHead>
                {/* <!-- Receipt Details --> */}
                <div className={styles["receipt-details"]}>
                    <div className={styles["detail-row"]}>
                        <span className={styles["label"]}>{type === 'payment' ? 'From' : 'To'}</span>
                        <Link className={`${styles["value-field"]}`} href={`/customer-supplier/view/${transaction.owner}`}>
                            <span className="text-sm text-gray-900 hover:text-gray-700 transition-colors print:text-black">{transaction.owner_name}</span>
                        </Link>
                    </div>

                    <div className={styles["detail-row"]}>
                        <span className={styles["label"]}>Method</span>
                        <div className={`${styles["value-field"]}`}>
                            <span>{transaction.payment_method_name}{transaction?.transaction_id ? ` #Ref ` : ''}<strong>{transaction?.transaction_id ? `${transaction.transaction_id}` : ''}</strong></span>
                        </div>
                    </div>

                    <div className={styles["detail-row"]}>
                        <span className={styles["label"]}>Sum Of</span>
                        <div className={`${styles["value-field"]} ${styles['q']} ${styles['upper']}`}><ToWord num={transaction.amount} /> EGP</div>

                        <div className={`${styles["value-field"]} ${styles['q']} max-w-[8rem]`}>{numberFormatter(transaction.amount)} EGP</div>
                        {/* <div className={`${styles["detail-row"]}`} style={{ textAlign: 'center' }}>
                            <div className={` ${styles["amount"]}`}>
                                <span className={styles["label"]}>L.E</span>
                                <div className={`${styles["value-field"]} ${styles['q']}`}>{numberFormatter(transaction.amount.split('.')[0])}</div>
                            </div>
                            <div className={` ${styles["amount"]}`}>
                                <span className={styles["label"]} >Kersh</span>
                                <div className={`${styles["value-field"]} ${styles['q']}`}>{transaction.amount.split('.')[1]}</div>
                            </div>
                        </div> */}
                    </div>

                    <ViewNoteValue note={transaction.notes} recieptAmount={transaction.amount} ref_order={transaction.ref} ref_order_total_amount={transaction?.ref_order_total_amount} />
                </div>

                {/* <!-- Footer Section --> */}
                <div className={styles["footer-section"]}>
                    <ViewReceivedBy recivedBy={transaction.received_by} />

                    {Number(credit) !== 0 && <div className={`${styles['remaining-credit']}`} style={{ position: "relative" }}>
                        <span className={`${styles["label"]} text-gray-900 print:text-black`}>Remaining Credit Balance: </span>
                        <div className={`${styles["valfue-fieldf"]} text-gray-900 print:text-black`} style={{ borderBottom: 'none' }}>{numberFormatter(credit)}</div>
                    </div>}



                    <div className={styles["thank-you"]}>
                        <p>Thank you for your business</p>
                    </div>
                    <div className={styles["thank-you"]}>
                        <p>Generated on {new Date(transaction.created_at).toString().split(' GMT')[0]}</p>
                    </div>
                </div>
            </div>

            <div className={`none-printable pt-6`}>
                <img src={transaction?.payment_proof} alt="" />
            </div>
        </div>
    )
}

export default TransactionView
