import numberFormatter from "@/utils/NumberFormatter";
import Link from 'next/link';
import style from './view.module.css'
import { getCreditBalance, getInv } from "./actions";
import logo from '@@/public/logo.jpeg'; // Import your logo image
import { formatDate } from "@/utils/dateFormatter";
import RepositoryPermitButton from "./RepositoryPermitButton";


const InvoicePrintableView = async ({ id, type }) => {
    const invoice = (await getInv(type, id)).data
    const ownerData = (await getCreditBalance(invoice.owner, invoice.issue_date)).data;
    const typePrefix = type.includes('sales') ? 's_invoice_items' : 'p_invoice_items';
    const isRefund = type.split('/')[1] || false;

    // Get status text
    const getStatusText = (statusCode) => {
        const statuses = {
            1: "Draft",
            3: "UnPaid",
            9: "Refund"
        };
        return statuses[statusCode] || "Unknown";
    };

    // Get status class
    const getStatusClass = (statusCode) => {
        const classes = {
            1: "status-draft",
            3: "status-unpaid",
            9: "status-refund"
        };
        return classes[statusCode] || "status-draft";
    };

    

    const tax = invoice[`${typePrefix}`]?.reduce((acc, item) => parseFloat(acc) + parseFloat(item.tax_rate), 0);
    const discount = invoice[typePrefix]?.reduce((acc, item) => parseFloat(acc) + parseFloat(item.discount), 0);
    const credit = ownerData.credit && ownerData.credit > 0 ? parseFloat(ownerData.credit) : 0
    const subTotal = invoice[typePrefix]?.reduce((acc, item) => parseFloat(acc) + (parseFloat(item.unit_price) * parseFloat(item.quantity)), 0);

    return (
        <div id="printarea" className={`${style['invoice-container']}`}>
            {/* Controls - Only visible on screen */}
            {! isRefund && (
                <div className={`${style['invoice-controls']}`}>
                    <Link href={`/invoice/${type}/form/${id}`} className={`${style['edit-link']}`}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                        Edit Invoice
                    </Link>

                    <Link href={`/invoice/${type}/refund/form/${invoice.id}`} className={`${style['edit-link']}`}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                        Refund Invoice
                    </Link>
                    
                    <RepositoryPermitButton id={invoice.id} type={type} permitValue={invoice.repository_permit} />
                </div>
            )}

            {/* Header */}
            <div className={`${style['invoice-header']}`}>
                <div className={`${style['logo-container']}`}>
                    <div className={`${style['logo']}`}>
                        {/* <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg> */}
                        <img src={logo.src} alt="" />
                    </div>
                </div>
                <div>
                    <h1 className={`${style['invoice-title']}`}>{type.includes('sales') ? isRefund ? `REFUND SALES` : 'PROFORMA' : 'PURCHASE'} INVOICE</h1>
                    <div className={`${style['invoice-status']} ${style[getStatusClass(invoice.status)]} ${style['none-printable']}`}>
                        {getStatusText(invoice.status)}
                    </div>
                </div>
            </div>

            {/* Client and Invoice Info */}
            <div className={`${style['invoice-info-section']}`}>
                <div>
                    <div>
                        <div className={`${style['invoice-id']}`}>{isRefund ? 'Refund' : 'Order'} No: #{invoice.hashed_id}</div>
                        <div className={`${style['invoice-id']} ${style['none-printable']}`}>Created by: {invoice.by_username}</div>
                        <div className={`${style['invoice-id']}`}>Issued: {formatDate(invoice.issue_date)}</div>
                        <div className={`${style['invoice-id']}`}>Total Amount: {invoice.total_amount}</div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }} >
                    <div className={`${style['info-group']}`}>
                        <div className={`${style['info-label']}`}>{isRefund ? 'Refunded From:' : 'Billed To:'}</div>
                        <div className={`${style['info-value']}`}>
                            <Link href={`/client-supplier/view/${invoice.owner}`} className={`${style['client-link']}`}>
                                {type.includes('sales') ? (
                                    <>
                                        {/* <div className={`${style['info-label']}`}></div> */}
                                        {invoice.owner_name}
                                        {ownerData?.address && (
                                            <div className={`${style['info-label']}`}>{ownerData.address}</div>
                                        )}
                                    </>
                                    ) : 
                                    'Med pro Corporation'
                                }
                            </Link>
                        </div>
                    </div>
                    {/* <div className={`${style['info-group']}`}>
                        <div className={`${style['info-label']}`}>From:</div>
                        <div className={`${style['info-value']}`}>{type === 'sales' ? 'Med pro Corporation' : invoice.owner_name}</div>
                        <div className={`${style['info-label']}`}>Business Address:</div>
                        <div className={`${style['info-value']}`}>Tax ID: {invoice.tax_number || 'N/A'}</div>
                    </div> */}
                    
                    {/* <div className={`${style['info-group']}`}>
                        <div className={`${style['info-label']}`}>Due:</div>
                        <div className={`${style['info-value']}`}>{formatDate(invoice.due_date)}</div>
                    </div> */}
                    {/* <div className={`${style['info-group']}`}>
                        <div className={`${style['info-label']}`}>Amount Due (EGP)</div>
                        <div className={`${style['amount-due']}`}>{invoice.remaining_balance || invoice.total_amount}</div>
                    </div> */}
                </div>
            </div>

            {/* Items Table */}
            <table className={`${style['invoice-table']}`}>
                <thead>
                    <tr>
                        <th>Service</th>
                        <th>Qty</th>
                        <th>unit_price</th>
                        {/* <th>Tax<!--Rate--></th> */}
                        <th>Tax</th>
                        <th>Discount</th>
                        <th>Line total</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice[typePrefix]?.map((item, index) => (
                        <tr key={item.id || index}>
                            <td>
                                <div className={`${style['item-name']}`}>{item.item_name?.split('##')[0]}</div>
                                {item.description && <div className={`${style['item-description']}`}>{item.description}</div>}
                            </td>
                            <td>{numberFormatter(item.quantity)}</td>
                            <td>{numberFormatter(item.unit_price)}</td>
                            <td>{numberFormatter(item.tax_rate)}</td>
                            <td>{numberFormatter(item.discount)}</td>
                            <td>{numberFormatter(item.total)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Summary */}
            <div className={`${style['invoice-summary']}`}>
                <div className={`${style['summary-container']}`}>
                    <div className={`${style['summary-row']}`}>
                        <span className={`${style['summary-label']}`}>Subtotal:</span>
                        <span className={`${style['summary-value']}`}>{numberFormatter(subTotal)}</span>
                    </div>
                    {tax > 0 && (
                        <div className={`${style['summary-row']}`}>
                            <span className={`${style['summary-label']}`}>Tax:</span>
                            <span className={`${style['summary-value']}`}>{numberFormatter(tax)}</span>
                        </div>
                    )}
                    {discount > 0 && (
                        <div className={`${style['summary-row']}`}>
                            <span className={`${style['summary-label']}`}>Discount:</span>
                            <span className={`${style['summary-value']}`}>-{numberFormatter(discount)}</span>
                        </div>
                    )}
                    {credit > 0 && (
                        <div className={`${style['summary-row']}`}>
                            <span className={`${style['summary-label']}`}>Old Credit Balance:</span>
                            <span className={`${style['summary-value']}`}>{numberFormatter(credit)}</span>
                        </div>
                    )}
                    <div className={`${style['summary-row']} ${style['summary-total']}`}>
                        <span>Total:</span>
                        <span>{numberFormatter(parseFloat(invoice.total_amount) + credit)}</span>
                    </div>
                    {/* <div className={`${style['summary-row summary-amount-due']}`}>
                        <span>Amount due</span>
                        <span className={`${style['summary-value']}`}>{invoice.remaining_balance || invoice.total_amount}</span>
                    </div> */}
                </div>
            </div>

            {invoice.notes && (
                <div className={`${style['notes-section']}`}>
                    <h3 className={`${style['notes-title']}`}>Notes</h3>
                    <pre className={`${style['notes-content']}`}>{invoice.notes}</pre>
                </div>
            )}

            {/* Payment Info */}
            <div className={`${style['payment-info']}`}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Please pay within 14 days of receiving this invoice.</span>
                
            </div>
            
            {/* Footer */}
            <div className={`${style['invoice-footer']}`}>
                <p>Thank you for your business!</p>
                <p>Generated on {new Date(invoice.created_at).toString().split(' GMT')[0]}</p>
            </div>
        </div>
    );
};

export default InvoicePrintableView;