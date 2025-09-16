import numberFormatter from '@/utils/NumberFormatter';
import { getPayment } from './actions'
import ToWord from './ToWord';
import styles from './view.module.css'
import s from '@/app/[locale]/(protected)/invoice/common/view.module.css'
import Link from 'next/link';
import DeleteButton from './DeleteButton';
import { getCreditBalance } from '@/app/[locale]/(protected)/invoice/common/actions';
import CompanyDetailsHead from '@/components/CompanyDetailsHead';


async function TransactionView({ id, type }) {
    const transaction = (await getPayment(id, type)).data
    const ownerData = (await getCreditBalance(transaction.owner, transaction.date)).data;
    let credit = ownerData.credit || '00.00'


    if (! transaction?.id) return 'not found'


    return (
        <div id='printarea' className={`p-4 ${styles["receipt-container"]}`}>
            <div className={`${s['invoice-controls']} none-printable`}>
                <Link href={`/finance/${type}/form/${id}`}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                    Edit
                </Link>

                <DeleteButton type={type} id={id} isDeleteFromView={true} />

            </div>

            <div className='pr-4 pb-4 w-full shadow-[8px_8px_8px_-10px_rgba(0,0,0,0.3)]'>
                <CompanyDetailsHead>
                    <div className="mx-auto text-base text-black">
                        <p className="text-2xl font-serif">Receipt</p>
                        <p className='font-serif'>Date: <span className="text-xs text-gray-500">{transaction.date}</span></p>
                        <p className='font-serif'>No: <span className="text-xs text-gray-500">#{transaction.hashed_id}</span></p>
                    </div>
                </CompanyDetailsHead>
                {/* <!-- Receipt Details --> */}
                <div className={styles["receipt-details"]}>
                    <div className={styles["detail-row"]}>
                        <span className={styles["label"]}>{type === 'payments' ? 'Received From' : 'Sent To'}</span>
                        <Link className={`${styles["value-field"]}`} href={`/customer-supplier/view/${transaction.owner}`}>
                            <span className="transition-opacity duration-300 group-hover:opacity-90 text-sm text-blue-600 hover:text-blue-500 group transition-colors dark:text-blue-400 dark:hover:text-blue-300 text-xs">{transaction.owner_name}</span>
                        </Link>
                    </div>

                    <div className={styles["detail-row"]}>
                        <span className={styles["label"]}>Payment Method</span>
                        <div className={`${styles["value-field"]}`}>
                            <span>{transaction.payment_method_name}</span>
                        </div>
                    </div>

                    <div className={styles["detail-row"]}>
                        <span className={styles["label"]}>Sum Of</span>
                        <div className={`${styles["value-field"]} ${styles['q']} ${styles['upper']}`}><ToWord num={transaction.amount} /> EGP</div>

                        <div className={`${styles["detail-row"]}`} style={{ textAlign: 'center' }}>
                            <div className={` ${styles["amount"]}`}>
                                <span className={styles["label"]}>L.E</span>
                                <div className={`${styles["value-field"]} ${styles['q']}`}>{numberFormatter(transaction.amount.split('.')[0])}</div>
                            </div>
                            <div className={` ${styles["amount"]}`}>
                                <span className={styles["label"]} >Kersh</span>
                                <div className={`${styles["value-field"]} ${styles['q']}`}>{transaction.amount.split('.')[1]}</div>
                            </div>
                        </div>
                    </div>

                    <div className={styles["detail-row"]}>
                        <span className={styles["label"]}>Description</span>
                        <div className={`${styles["value-field"]}`}>{transaction.note}</div>
                    </div>
                </div>

                {/* <!-- Footer Section --> */}
                <div className={styles["footer-section"]}>
                    <div className={`${styles['received-by']}`}>
                        <span className={styles["label"]}>Received By</span>
                        <div className={styles["value-field"]} style={{ borderBottom: 'none' }}></div>
                    </div>

                    {Number(credit) !== 0 && <div className={`${styles['remaining-credit']}`} style={{position: "relative"}}>
                        <span className={styles["label"]}>Remaining Credit Balance: </span>
                        <div className={styles["valfue-fieldf"]} style={{ borderBottom: 'none' }}>{numberFormatter(credit)}</div>
                    </div>}

                    

                    <div className={styles["thank-you"]}>
                        <p>Thank you for your business</p>
                    </div>
                    <div className={styles["thank-you"]}>
                        <p>Generated on {new Date(transaction.created_at).toString().split(' GMT')[0]}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionView
