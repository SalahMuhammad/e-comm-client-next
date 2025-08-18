import numberFormatter from '@/utils/NumberFormatter';
import { getPayment } from './actions'
import ToWord from './ToWord';
import styles from './view.module.css'
import s from '@/app/[locale]/(protected)/invoice/common/view.module.css'
import Link from 'next/link';
import DeleteButton from './DeleteButton';


async function TransactionView({ id, type }) {
    const transaction = (await getPayment(id, type)).data


    return (
        <div id='printarea' className={styles["receipt-container"]}>
            <div className={`${s['invoice-controls']}`}>
                <Link href={`/finance/${type}/form/${id}`}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                    Edit
                </Link>

                <DeleteButton type={type} id={id} isDeleteFromView={true} />

            </div>

            <div className={styles["receipt-card"]}>
                {/* <!-- Header Section --> */}
                <div className={styles["header-section"]}>
                    <div className={styles["company-info"]}>
                        <h1 className={styles["company-name"]}>Med Pro Corp</h1>
                        <p className={styles["company-details"]}>GENERAL TRADING L.L.C</p>
                        <p className={styles["phone-number"]}>(+20) 22507508</p>
                        <div className={styles["contact-info"]}>
                            <p>PHONE: (+20) 1002087584</p>
                            <p>PHONE: (+20) 1000696011</p>
                        </div>
                    </div>
                    <div className={styles["logo-section"]}>
                        <img src="/logo.jpeg" alt="Med Pro Corp Logo" className={styles["company-logo"]} />
                    </div>
                    <div className={styles['header-right']}>
                        <p style={{ fontSize: '1.5rem' }}>Receipt</p>
                        <p>Date: <span className={styles['values']}>{transaction.date}</span></p>
                        <p>No: <span className={styles['values']}>#{transaction.hashed_id}</span></p>
                    </div>
                </div>

                {/* <!-- Receipt Details --> */}
                <div className={styles["receipt-details"]}>
                    <div className={styles["detail-row"]}>
                        <span className={styles["label"]}>Received From</span>
                        <div className={`${styles["value-field"]}`}>{transaction.owner_name}</div>
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

                    <div className={styles["thank-you"]}>
                        <p>Thank you for your business</p>
                    </div>

                    <div className={styles["address"]}>
                        <p>20 Block 2, Emergency city Emocaram, Cairo</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionView
